const { ObjectId } = require("mongodb");
const { connectToDatabase } = require("../_lib/mongodb");
const { COLLECTIONS, USER_ROLES, SUBSCRIPTION_STATUS } = require("../_lib/models");
const { requireRole } = require("../_lib/auth");
const { logAdminAction } = require("../_lib/audit");

/**
 * Super Admin Subscription & Feature Management API
 * PATCH /api/admin/subscriptions
 */
module.exports = async function handler(req, res) {
  const adminUser = requireRole(req, res, USER_ROLES.ADMIN);
  if (!adminUser) return;

  if (req.method !== "PATCH") {
    return res.status(405).json({ success: false, error: "Method not allowed. Only PATCH is supported." });
  }

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch (e) {
      return res.status(400).json({ success: false, error: "Invalid JSON body." });
    }
  }
  body = body || {};

  const { id, subscriptionStatus, subscriptionExpiry, enabledFeatures } = body;

  if (!id) {
    return res.status(400).json({ success: false, error: "Business ID ('id') is required." });
  }

  try {
    const { db } = await connectToDatabase();
    const bizId = new ObjectId(id);

    const existing = await db.collection(COLLECTIONS.BUSINESSES).findOne({ _id: bizId });
    if (!existing) {
      return res.status(404).json({ success: false, error: "Business not found." });
    }

    const updates = { updatedAt: new Date() };

    if (subscriptionStatus) {
      const validStatuses = Object.values(SUBSCRIPTION_STATUS);
      if (!validStatuses.includes(subscriptionStatus)) {
        return res.status(400).json({
          success: false,
          error: `Invalid subscriptionStatus. Allowed: ${validStatuses.join(", ")}`
        });
      }
      updates.subscriptionStatus = subscriptionStatus;
    }

    if (subscriptionExpiry) {
      updates.subscriptionExpiry = new Date(subscriptionExpiry);
    }

    if (Array.isArray(enabledFeatures)) {
      updates.enabledFeatures = enabledFeatures;
    }

    await db.collection(COLLECTIONS.BUSINESSES).updateOne(
      { _id: bizId },
      { $set: updates }
    );

    // Record in Audit Log
    await logAdminAction(db, {
      adminId: adminUser.userId,
      businessId: bizId,
      action: "subscription_and_features_updated",
      previousValue: {
        subscriptionStatus: existing.subscriptionStatus,
        subscriptionExpiry: existing.subscriptionExpiry,
        enabledFeatures: existing.enabledFeatures
      },
      newValue: {
        subscriptionStatus: updates.subscriptionStatus || existing.subscriptionStatus,
        subscriptionExpiry: updates.subscriptionExpiry || existing.subscriptionExpiry,
        enabledFeatures: updates.enabledFeatures || existing.enabledFeatures
      }
    });

    const updated = await db.collection(COLLECTIONS.BUSINESSES).findOne({ _id: bizId });

    return res.status(200).json({
      success: true,
      message: "Subscription and features updated successfully.",
      business: updated
    });
  } catch (error) {
    console.error("[Admin /subscriptions] Error:", error);
    return res.status(500).json({ success: false, error: "An internal server error occurred." });
  }
};
