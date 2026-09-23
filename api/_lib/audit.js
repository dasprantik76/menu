const { ObjectId } = require("mongodb");
const { COLLECTIONS } = require("./models");

/**
 * Record an administrative action into the audit log
 */
async function logAdminAction(db, { adminId, businessId, action, previousValue = null, newValue = null }) {
  try {
    const logEntry = {
      adminId: adminId ? new ObjectId(adminId) : null,
      businessId: businessId ? new ObjectId(businessId) : null,
      action,
      previousValue,
      newValue,
      timestamp: new Date()
    };

    await db.collection(COLLECTIONS.ADMIN_LOGS).insertOne(logEntry);
    return logEntry;
  } catch (err) {
    console.error("[Audit Log Error]:", err);
    return null;
  }
}

module.exports = {
  logAdminAction
};
