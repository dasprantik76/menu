// Collection Names
const COLLECTIONS = {
  USERS: "users",
  BUSINESSES: "businesses",
  CATEGORIES: "categories",
  MENU_ITEMS: "menu_items",
  ADMIN_LOGS: "admin_logs"
};

// Lifecycle Status Definitions
const APPROVAL_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  SUSPENDED: "suspended"
};

const SUBSCRIPTION_STATUS = {
  INACTIVE: "inactive",
  TRIAL: "trial",
  ACTIVE: "active",
  EXPIRED: "expired"
};

const USER_ROLES = {
  OWNER: "owner",
  ADMIN: "admin"
};

/**
 * Ensures required database indexes exist for performance and uniqueness constraints
 */
async function ensureIndexes(db) {
  try {
    // Unique slug for businesses
    await db.collection(COLLECTIONS.BUSINESSES).createIndex({ slug: 1 }, { unique: true });
    // Fast lookup for businesses by owner
    await db.collection(COLLECTIONS.BUSINESSES).createIndex({ ownerId: 1 });
    // Unique Google ID for users
    await db.collection(COLLECTIONS.USERS).createIndex({ googleId: 1 }, { unique: true, sparse: true });
    // Fast lookup for users by email
    await db.collection(COLLECTIONS.USERS).createIndex({ email: 1 });
    // Scoped categories by business and ordered
    await db.collection(COLLECTIONS.CATEGORIES).createIndex({ businessId: 1, displayOrder: 1 });
    // Scoped menu items by business, category, and ordered
    await db.collection(COLLECTIONS.MENU_ITEMS).createIndex({ businessId: 1, categoryId: 1, displayOrder: 1 });
    // Admin logs ordered by timestamp descending
    await db.collection(COLLECTIONS.ADMIN_LOGS).createIndex({ timestamp: -1 });
  } catch (err) {
    console.error("Index creation error (non-fatal):", err.message);
  }
}

const { getTrustedDate, isRollbackDetected } = require("./time");

/**
 * Automatically checks if an approved business has passed its approvalExpiry date,
 * or if a device clock rollback / calendar tampering attempt has occurred.
 * If expired or tampered, reverts approvalStatus back to 'pending', sets isPublished to false,
 * and records the update in the database so the restaurant goes on hold mode seeking approval.
 */
async function checkAndExpireApproval(db, business) {
  if (!business || business.approvalStatus !== APPROVAL_STATUS.APPROVED || !business.approvalExpiry) {
    return business;
  }
  const now = await getTrustedDate();
  const expiry = new Date(business.approvalExpiry);
  const approvedAt = business.approvedAt ? new Date(business.approvedAt) : null;
  const lastVerifiedAt = business.lastVerifiedAt ? new Date(business.lastVerifiedAt) : null;
  const updatedAt = business.updatedAt ? new Date(business.updatedAt) : null;

  // Clock rollback detection:
  // If the observed time is earlier than when approval was granted or earlier than previously verified activity
  const isClockRollback =
    (approvedAt && isRollbackDetected(now, approvedAt, 15000)) ||
    (lastVerifiedAt && isRollbackDetected(now, lastVerifiedAt, 30000)) ||
    (updatedAt && !approvedAt && isRollbackDetected(now, updatedAt, 30000));

  const isExpired = now.getTime() >= expiry.getTime();

  if (isExpired || isClockRollback) {
    const reason = isClockRollback
      ? "Approval revoked: Device clock rollback or calendar tampering detected."
      : "Approval duration expired.";

    await db.collection(COLLECTIONS.BUSINESSES).updateOne(
      { _id: business._id },
      {
        $set: {
          approvalStatus: APPROVAL_STATUS.PENDING,
          isPublished: false,
          updatedAt: now,
          statusReason: reason
        }
      }
    );
    business.approvalStatus = APPROVAL_STATUS.PENDING;
    business.isPublished = false;
    business.statusReason = reason;
    return business;
  }

  // Monotonically advance lastVerifiedAt (throttle updates to every 15s to keep DB writes low)
  if (!lastVerifiedAt || (now.getTime() - lastVerifiedAt.getTime() > 15000)) {
    await db.collection(COLLECTIONS.BUSINESSES).updateOne(
      { _id: business._id },
      { $set: { lastVerifiedAt: now } }
    );
    business.lastVerifiedAt = now;
  }

  return business;
}

module.exports = {
  COLLECTIONS,
  APPROVAL_STATUS,
  SUBSCRIPTION_STATUS,
  USER_ROLES,
  ensureIndexes,
  checkAndExpireApproval,
  getTrustedDate
};
