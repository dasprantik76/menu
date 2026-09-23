const { ObjectId } = require("mongodb");
const { connectToDatabase } = require("../_lib/mongodb");
const { COLLECTIONS, USER_ROLES, APPROVAL_STATUS } = require("../_lib/models");
const { requireRole } = require("../_lib/auth");
const { logAdminAction } = require("../_lib/audit");

/**
 * Super Admin Businesses API
 * Strictly accessible by users with role "admin".
 * GET /api/admin/businesses — List all restaurants with approval & subscription statuses
 * PATCH /api/admin/businesses — Approve, reject, or suspend a restaurant
 */
module.exports = async function handler(req, res) {
  const adminUser = requireRole(req, res, USER_ROLES.ADMIN);
  if (!adminUser) return;

  // Parse body
  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch (e) {
      return res.status(400).json({ success: false, error: "Invalid JSON body." });
    }
  }
  body = body || {};

  try {
    const { db } = await connectToDatabase();

    // -------------------------------------------------------------
    // GET: List all businesses with stats
    // -------------------------------------------------------------
    if (req.method === "GET") {
      const businesses = await db.collection(COLLECTIONS.BUSINESSES)
        .find({})
        .sort({ createdAt: -1 })
        .toArray();

      // Enrich with owner information
      const enriched = await Promise.all(businesses.map(async (biz) => {
        const owner = await db.collection(COLLECTIONS.USERS).findOne(
          { _id: new ObjectId(biz.ownerId) },
          { projection: { name: 1, email: 1, picture: 1 } }
        );

        const catCount = await db.collection(COLLECTIONS.CATEGORIES).countDocuments
          ? await db.collection(COLLECTIONS.CATEGORIES).countDocuments({ businessId: biz._id })
          : (await db.collection(COLLECTIONS.CATEGORIES).find({ businessId: biz._id }).toArray()).length;

        const itemCount = await db.collection(COLLECTIONS.MENU_ITEMS).countDocuments
          ? await db.collection(COLLECTIONS.MENU_ITEMS).countDocuments({ businessId: biz._id })
          : (await db.collection(COLLECTIONS.MENU_ITEMS).find({ businessId: biz._id }).toArray()).length;

        return {
          ...biz,
          owner: owner || { name: "Unknown", email: "" },
          stats: {
            categories: catCount,
            items: itemCount
          }
        };
      }));

      return res.status(200).json({
        success: true,
        businesses: enriched
      });
    }

    // -------------------------------------------------------------
    // PATCH: Approve, Reject, or Suspend a Business
    // -------------------------------------------------------------
    if (req.method === "PATCH") {
      const { id, approvalStatus } = body;

      if (!id || !approvalStatus) {
        return res.status(400).json({ success: false, error: "Business ID ('id') and 'approvalStatus' are required." });
      }

      const validStatuses = Object.values(APPROVAL_STATUS);
      if (!validStatuses.includes(approvalStatus)) {
        return res.status(400).json({
          success: false,
          error: `Invalid approvalStatus. Allowed values: ${validStatuses.join(", ")}`
        });
      }

      const bizId = new ObjectId(id);
      const existing = await db.collection(COLLECTIONS.BUSINESSES).findOne({ _id: bizId });
      if (!existing) {
        return res.status(404).json({ success: false, error: "Business not found." });
      }

      const previousStatus = existing.approvalStatus;
      const updates = {
        approvalStatus,
        updatedAt: new Date()
      };

      // Auto-publish when approved for instant convenience
      if (approvalStatus === APPROVAL_STATUS.APPROVED) {
        updates.isPublished = true;
      } else if (approvalStatus === APPROVAL_STATUS.SUSPENDED || approvalStatus === APPROVAL_STATUS.REJECTED) {
        updates.isPublished = false;
      }

      await db.collection(COLLECTIONS.BUSINESSES).updateOne(
        { _id: bizId },
        { $set: updates }
      );

      // Record in Audit Log
      await logAdminAction(db, {
        adminId: adminUser.userId,
        businessId: bizId,
        action: `business_${approvalStatus}`,
        previousValue: { approvalStatus: previousStatus, isPublished: existing.isPublished },
        newValue: { approvalStatus, isPublished: updates.isPublished }
      });

      const updated = await db.collection(COLLECTIONS.BUSINESSES).findOne({ _id: bizId });

      return res.status(200).json({
        success: true,
        message: `Business status updated to '${approvalStatus}'.`,
        business: updated
      });
    }

    return res.status(405).json({ success: false, error: "Method not allowed." });
  } catch (error) {
    console.error("[Admin /businesses] Error:", error);
    return res.status(500).json({ success: false, error: "An internal server error occurred." });
  }
};
