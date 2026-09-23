const { MongoClient, ObjectId } = require("mongodb");

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || "menucard_saas";

const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

let client;
let clientPromise;

if (uri) {
  if (process.env.NODE_ENV === "development" || !process.env.NODE_ENV) {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
}

const { DEFAULT_15_CATEGORIES, DEFAULT_TODAY_SPECIAL_ITEMS } = require("./defaultData");

// =========================================================================
// In-Memory Dev Store (Active ONLY when MONGODB_URI is not yet configured)
// =========================================================================
if (!global._mockDb) {
  const royalBizId = new ObjectId();
  const royalOwnerId = new ObjectId();
  const spicyBizId = new ObjectId();
  const spicyOwnerId = new ObjectId();

  const categories = [];
  const menu_items = [];

  [royalBizId, spicyBizId].forEach((bId) => {
    // Seed fixed undeletable "TODAY'S SPECIAL" category
    const todaySpecialId = new ObjectId();
    categories.push({
      _id: todaySpecialId,
      businessId: bId,
      name: "TODAY'S SPECIAL",
      displayOrder: -1,
      isFixed: true,
      isVisible: true,
      isAvailable: true,
      createdAt: new Date()
    });

    DEFAULT_TODAY_SPECIAL_ITEMS.forEach((item, itemIdx) => {
      menu_items.push({
        _id: new ObjectId(),
        businessId: bId,
        categoryId: todaySpecialId,
        name: item.name,
        description: item.description,
        price: item.price,
        image: "",
        isAvailable: true,
        isFeatured: itemIdx < 3,
        displayOrder: itemIdx,
        createdAt: new Date()
      });
    });

    DEFAULT_15_CATEGORIES.forEach((catData, catIdx) => {
      const catId = new ObjectId();
      categories.push({
        _id: catId,
        businessId: bId,
        name: catData.name,
        displayOrder: catIdx,
        isVisible: true,
        createdAt: new Date()
      });

      catData.items.forEach((item, itemIdx) => {
        menu_items.push({
          _id: new ObjectId(),
          businessId: bId,
          categoryId: catId,
          name: item.name,
          description: item.description,
          price: item.price,
          image: "",
          isAvailable: true,
          isFeatured: itemIdx === 0,
          displayOrder: itemIdx,
          createdAt: new Date()
        });
      });
    });
  });

  global._mockDb = {
    users: [
      {
        _id: royalOwnerId,
        email: "owner@royalfoodcorner.com",
        name: "Royal Owner",
        role: "owner",
        accountStatus: "active",
        createdAt: new Date()
      },
      {
        _id: spicyOwnerId,
        email: "owner@spicyhut.com",
        name: "Owner",
        role: "owner",
        accountStatus: "active",
        createdAt: new Date()
      }
    ],
    businesses: [
      {
        _id: royalBizId,
        ownerId: royalOwnerId,
        name: "Royal Food Corner",
        slug: "royal-food-corner",
        contact: {
          phone: "+91 98765 43210",
          email: "contact@royalfoodcorner.com",
          address: "Main Street, Food Plaza"
        },
        branding: { accentColor: "#991e2e", logoUrl: "" },
        approvalStatus: "approved",
        subscriptionStatus: "active",
        subscriptionExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        enabledFeatures: ["platter", "customColors", "analytics"],
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: spicyBizId,
        ownerId: spicyOwnerId,
        name: "Spicy Hut",
        slug: "spicy-hut",
        contact: {
          phone: "+91 98765 12345",
          email: "contact@spicyhut.com",
          address: "12 Spicy Avenue, Central Market"
        },
        branding: { accentColor: "#991e2e", logoUrl: "" },
        approvalStatus: "approved",
        subscriptionStatus: "active",
        subscriptionExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        enabledFeatures: ["platter", "customColors", "analytics"],
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    categories,
    menu_items,
    admin_logs: []
  };
}

function matchesQuery(doc, query) {
  if (!query || typeof query !== "object") return true;

  if (Array.isArray(query.$or)) {
    const anyPassed = query.$or.some(subQuery => matchesQuery(doc, subQuery));
    if (!anyPassed) return false;
  }

  for (const [key, val] of Object.entries(query)) {
    if (key === "$or") continue;
    const docVal = doc[key];
    if (val && typeof val === "object" && "$ne" in val) {
      if (String(docVal) === String(val.$ne)) return false;
      continue;
    }
    if (String(docVal) !== String(val)) return false;
  }
  return true;
}

function createMockCollection(name) {
  return {
    async findOne(query) {
      const list = global._mockDb[name] || [];
      const found = list.find(d => matchesQuery(d, query));
      return found ? JSON.parse(JSON.stringify(found)) : null;
    },
    async findOneAndUpdate(query, update, options = {}) {
      const list = global._mockDb[name] || (global._mockDb[name] = []);
      let index = list.findIndex(d => matchesQuery(d, query));
      let doc;

      if (index === -1 && options.upsert) {
        doc = {
          _id: new ObjectId(),
          ...(update.$setOnInsert || {}),
          ...(update.$set || {})
        };
        list.push(doc);
      } else if (index !== -1) {
        doc = list[index];
        if (update.$set) {
          Object.assign(doc, update.$set);
        }
      }

      return doc ? JSON.parse(JSON.stringify(doc)) : null;
    },
    async insertOne(doc) {
      const list = global._mockDb[name] || (global._mockDb[name] = []);
      const toInsert = { _id: doc._id || new ObjectId(), ...doc };
      list.push(toInsert);
      return { insertedId: toInsert._id };
    },
    async insertMany(docs) {
      const list = global._mockDb[name] || (global._mockDb[name] = []);
      const inserted = docs.map(d => ({ _id: d._id || new ObjectId(), ...d }));
      list.push(...inserted);
      return { insertedIds: inserted.map(d => d._id) };
    },
    find(query = {}) {
      const list = global._mockDb[name] || [];
      let results = list.filter(d => matchesQuery(d, query));
      return {
        sort(sortObj) {
          if (sortObj) {
            const [field, direction] = Object.entries(sortObj)[0] || [];
            if (field) {
              results.sort((a, b) => {
                if (a[field] < b[field]) return direction === -1 ? 1 : -1;
                if (a[field] > b[field]) return direction === -1 ? -1 : 1;
                return 0;
              });
            }
          }
          return this;
        },
        limit(n) {
          if (typeof n === "number") {
            results = results.slice(0, n);
          }
          return this;
        },
        async toArray() {
          return JSON.parse(JSON.stringify(results));
        }
      };
    },
    async updateOne(query, update) {
      const list = global._mockDb[name] || [];
      const doc = list.find(d => matchesQuery(d, query));
      if (doc && update.$set) {
        Object.assign(doc, update.$set);
      }
      return { modifiedCount: doc ? 1 : 0 };
    },
    async updateMany(query, update) {
      const list = global._mockDb[name] || [];
      let count = 0;
      list.forEach(doc => {
        if (matchesQuery(doc, query) && update.$set) {
          Object.assign(doc, update.$set);
          count++;
        }
      });
      return { modifiedCount: count };
    },
    async deleteOne(query) {
      const list = global._mockDb[name] || [];
      const index = list.findIndex(d => matchesQuery(d, query));
      if (index !== -1) {
        list.splice(index, 1);
        return { deletedCount: 1 };
      }
      return { deletedCount: 0 };
    },
    async deleteMany(query) {
      const list = global._mockDb[name] || [];
      const kept = list.filter(d => !matchesQuery(d, query));
      const deletedCount = list.length - kept.length;
      global._mockDb[name] = kept;
      return { deletedCount };
    },
    async countDocuments(query = {}) {
      const list = global._mockDb[name] || [];
      return list.filter(d => matchesQuery(d, query)).length;
    },
    async createIndex() {
      return Promise.resolve("index_ok");
    }
  };
}

async function connectToDatabase() {
  if (process.env.MONGODB_URI) {
    const connectedClient = await clientPromise;
    const db = connectedClient.db(dbName);
    return { client: connectedClient, db };
  }

  // Development fallback when MONGODB_URI is not yet provided in .env
  return {
    client: { close: async () => {} },
    db: {
      collection: (name) => createMockCollection(name)
    }
  };
}

module.exports = {
  connectToDatabase,
  clientPromise
};
