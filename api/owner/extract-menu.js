const { ObjectId } = require("mongodb");
const { connectToDatabase } = require("../_lib/mongodb");
const { COLLECTIONS, APPROVAL_STATUS, checkAndExpireApproval } = require("../_lib/models");
const { requireAuth } = require("../_lib/auth");

/**
 * AI Menu Photo Extraction API
 * POST /api/owner/extract-menu
 * Accepts base64 images and uses Gemini 3.8 Flash Vision to extract categories and dishes.
 */
module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed. Use POST." });
  }

  const sessionUser = requireAuth(req, res);
  if (!sessionUser) return;

  const ownerId = new ObjectId(sessionUser.userId);

  try {
    const { db } = await connectToDatabase();

    let business = await db.collection(COLLECTIONS.BUSINESSES).findOne({ ownerId });
    if (!business) {
      return res.status(404).json({
        success: false,
        error: "No restaurant business found for your account."
      });
    }

    business = await checkAndExpireApproval(db, business);
    if (business.approvalStatus !== APPROVAL_STATUS.APPROVED) {
      return res.status(403).json({
        success: false,
        error: "Your restaurant application is currently pending or suspended. Menu import is disabled."
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: "GEMINI_API_KEY is not configured in environment variables."
      });
    }

    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch (e) {
        return res.status(400).json({ success: false, error: "Invalid JSON payload." });
      }
    }

    const { images } = body || {};
    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({
        success: false,
        error: "At least one menu image is required for analysis."
      });
    }

    if (images.length > 10) {
      return res.status(400).json({
        success: false,
        error: "You can upload a maximum of 10 menu photos at a time."
      });
    }

    // Build Gemini contents payload with images and prompt
    const parts = [];

    images.forEach(img => {
      let rawBase64 = img.data || img.base64 || "";
      if (rawBase64.includes(",")) {
        rawBase64 = rawBase64.split(",")[1];
      }
      const mimeType = img.mimeType || "image/jpeg";
      if (rawBase64) {
        parts.push({
          inlineData: {
            mimeType: mimeType,
            data: rawBase64
          }
        });
      }
    });

    if (parts.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No valid image data received. Please select valid photo files."
      });
    }

    const promptText = `You are an expert restaurant menu digitization assistant.
Analyze the provided restaurant menu image(s) and accurately extract all categories, dishes, prices, and descriptions.

Extraction Guidelines:
1. Identify all distinct menu categories (e.g. "STARTERS", "MAIN COURSE", "BREADS", "BEVERAGES", "DESSERTS"). Keep category names clean and in uppercase.
2. For each category, extract all food and beverage items:
   - "name": Clean official dish name (clean up any OCR typos or punctuation glitches).
   - "price": Numeric price value. Strip currency symbols (e.g. ₹, $, Rs.) and suffixes like '/-'. If multiple sizes exist (e.g. Half / Full), create separate dish entries such as "Dish Name (Half)" and "Dish Name (Full)" or record the primary price. Ensure price is a clean positive number.
   - "description": Description, ingredients, or dietary notes listed under the item (empty string if none).
3. Ignore restaurant contact details, addresses, tax notices, and general disclaimers.
4. If a dish is not explicitly under a header, group it under a logical category like "MAINS" or "SPECIALS".
5. Return strictly valid JSON adhering to the specified schema.`;

    parts.push({ text: promptText });

    const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`;

    const geminiPayload = {
      contents: [{ parts }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            categories: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  name: { type: "STRING", description: "Category name" },
                  items: {
                    type: "ARRAY",
                    items: {
                      type: "OBJECT",
                      properties: {
                        name: { type: "STRING", description: "Dish name" },
                        price: { type: "NUMBER", description: "Numeric price" },
                        description: { type: "STRING", description: "Optional dish description" }
                      },
                      required: ["name", "price"]
                    }
                  }
                },
                required: ["name", "items"]
              }
            }
          },
          required: ["categories"]
        }
      }
    };

    const aiResponse = await fetch(geminiEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(geminiPayload)
    });

    const aiData = await aiResponse.json();

    if (!aiResponse.ok) {
      console.error("[Gemini API Error]:", aiData);
      const errMsg = aiData.error?.message || "Failed to analyze menu images with AI.";
      return res.status(502).json({ success: false, error: errMsg });
    }

    const rawText = aiData.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      return res.status(500).json({
        success: false,
        error: "AI did not return any extracted text from the provided image(s)."
      });
    }

    let parsedResult;
    try {
      parsedResult = JSON.parse(rawText);
    } catch (parseErr) {
      console.error("[Gemini Parse Error]:", rawText);
      return res.status(500).json({
        success: false,
        error: "Unable to parse extracted menu data from AI response."
      });
    }

    const rawCategories = Array.isArray(parsedResult.categories) ? parsedResult.categories : [];

    // Clean and validate categories and items
    const cleanCategories = rawCategories
      .map(cat => {
        const catName = String(cat.name || "").trim().toUpperCase() || "GENERAL";
        const items = (Array.isArray(cat.items) ? cat.items : [])
          .filter(item => item && typeof item.name === "string" && item.name.trim().length > 0)
          .map(item => ({
            name: String(item.name).trim(),
            price: typeof item.price === "number" && !isNaN(item.price) ? Math.max(0, Math.round(item.price * 100) / 100) : 0,
            description: item.description ? String(item.description).trim() : "",
            selected: true
          }));

        return {
          name: catName,
          items
        };
      })
      .filter(cat => cat.items.length > 0);

    const totalDishes = cleanCategories.reduce((acc, cat) => acc + cat.items.length, 0);

    return res.status(200).json({
      success: true,
      categories: cleanCategories,
      totalDishes,
      photosCount: images.length
    });
  } catch (err) {
    console.error("[extract-menu Handler Error]:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "An unexpected error occurred while analyzing the menu."
    });
  }
};
