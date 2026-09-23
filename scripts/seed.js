require("dotenv").config();
const { connectToDatabase } = require("../api/_lib/mongodb");
const { COLLECTIONS, APPROVAL_STATUS, SUBSCRIPTION_STATUS, ensureIndexes } = require("../api/_lib/models");

const INITIAL_RESTAURANT = {
  name: "Royal Food Corner",
  slug: "royal-food-corner",
  contact: {
    phone: "+91 98765 43210",
    email: "contact@royalfoodcorner.com",
    address: "Main Street, Food Plaza"
  },
  branding: {
    accentColor: "#991e2e",
    logoUrl: ""
  },
  approvalStatus: APPROVAL_STATUS.APPROVED,
  subscriptionStatus: SUBSCRIPTION_STATUS.ACTIVE,
  subscriptionExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
  enabledFeatures: ["platter", "customColors", "analytics"],
  isPublished: true
};

const { DEFAULT_15_CATEGORIES, DEFAULT_TODAY_SPECIAL_ITEMS } = require("../api/_lib/defaultData");

async function seed() {
  if (!process.env.MONGODB_URI) {
    console.error("❌ Error: MONGODB_URI is not configured in .env");
    console.log("ℹ️  Please create a .env file with your MongoDB Atlas connection string to run the seed script.");
    process.exit(1);
  }

  console.log("Connecting to MongoDB Atlas...");
  const { db, client } = await connectToDatabase();
  console.log("Connected successfully!");

  console.log("Ensuring database indexes...");
  await ensureIndexes(db);

  console.log(`Seeding business: "${INITIAL_RESTAURANT.name}" (${INITIAL_RESTAURANT.slug})...`);
  const businessRes = await db.collection(COLLECTIONS.BUSINESSES).findOneAndUpdate(
    { slug: INITIAL_RESTAURANT.slug },
    {
      $set: {
        ...INITIAL_RESTAURANT,
        updatedAt: new Date()
      },
      $setOnInsert: {
        createdAt: new Date()
      }
    },
    { upsert: true, returnDocument: "after" }
  );

  const businessId = businessRes._id || businessRes.value?._id;
  if (!businessId) {
    throw new Error("Failed to get businessId after upsert.");
  }
  console.log(`Business ID: ${businessId}`);

  // Clear existing categories and items for clean seed
  await db.collection(COLLECTIONS.CATEGORIES).deleteMany({ businessId });
  await db.collection(COLLECTIONS.MENU_ITEMS).deleteMany({ businessId });

  let totalItems = 0;

  // Seed Today's Special Category
  const specialCatRes = await db.collection(COLLECTIONS.CATEGORIES).insertOne({
    businessId,
    name: "TODAY'S SPECIAL",
    displayOrder: -1,
    isFixed: true,
    isVisible: true,
    createdAt: new Date()
  });

  const specialItems = DEFAULT_TODAY_SPECIAL_ITEMS.map((item, itemIdx) => ({
    businessId,
    categoryId: specialCatRes.insertedId,
    name: item.name,
    description: item.description || "",
    price: item.price,
    image: "",
    isAvailable: true,
    isFeatured: itemIdx < 3,
    displayOrder: itemIdx,
    createdAt: new Date()
  }));

  if (specialItems.length > 0) {
    await db.collection(COLLECTIONS.MENU_ITEMS).insertMany(specialItems);
    totalItems += specialItems.length;
  }

  for (let catIdx = 0; catIdx < DEFAULT_15_CATEGORIES.length; catIdx++) {
    const catData = DEFAULT_15_CATEGORIES[catIdx];
    const catRes = await db.collection(COLLECTIONS.CATEGORIES).insertOne({
      businessId,
      name: catData.name,
      displayOrder: catIdx,
      isVisible: true,
      createdAt: new Date()
    });

    const categoryId = catRes.insertedId;
    const itemsToInsert = catData.items.map((item, itemIdx) => ({
      businessId,
      categoryId,
      name: item.name,
      description: "",
      price: item.price,
      image: "",
      isAvailable: true,
      isFeatured: false,
      displayOrder: itemIdx,
      createdAt: new Date()
    }));

    if (itemsToInsert.length > 0) {
      await db.collection(COLLECTIONS.MENU_ITEMS).insertMany(itemsToInsert);
      totalItems += itemsToInsert.length;
    }
  }

  console.log(`✅ Seed Complete!`);
  console.log(`- 1 Restaurant (${INITIAL_RESTAURANT.name})`);
  console.log(`- ${SEED_DATA.length} Categories`);
  console.log(`- ${totalItems} Menu Items`);

  await client.close();
  process.exit(0);
}

seed().catch(err => {
  console.error("❌ Seed failed with error:", err);
  process.exit(1);
});
