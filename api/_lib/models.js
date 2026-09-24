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

/**
 * Automatically checks if an approved business has passed its approvalExpiry date.
 * If expired, reverts approvalStatus back to 'pending', sets isPublished to false,
 * and records the update in the database so the restaurant goes on hold mode seeking approval.
 */
async function checkAndExpireApproval(db, business) {
  if (!business || business.approvalStatus !== APPROVAL_STATUS.APPROVED || !business.approvalExpiry) {
    return business;
  }
  const now = new Date();
  if (now > new Date(business.approvalExpiry)) {
    await db.collection(COLLECTIONS.BUSINESSES).updateOne(
      { _id: business._id },
      {
        $set: {
          approvalStatus: APPROVAL_STATUS.PENDING,
          isPublished: false,
          updatedAt: now
        }
      }
    );
    business.approvalStatus = APPROVAL_STATUS.PENDING;
    business.isPublished = false;
  }
  return business;
}

module.exports = {
  COLLECTIONS,
  APPROVAL_STATUS,
  SUBSCRIPTION_STATUS,
  USER_ROLES,
  ensureIndexes,
  checkAndExpireApproval
};
