const { ObjectId } = require("mongodb");
const { connectToDatabase } = require("../_lib/mongodb");
const { COLLECTIONS, APPROVAL_STATUS, SUBSCRIPTION_STATUS, checkAndExpireApproval } = require("../_lib/models");
const { requireAuth } = require("../_lib/auth");
const { uploadToImageKit, deleteFromImageKit, deleteImageKitFileByUrl } = require("../_lib/imagekit");

/**
 * Slug helper: converts string into clean lowercase URL slug
 */
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Owner Business Profile & Registration API
 * GET /api/owner/business — Retrieve owner's business
 * POST /api/owner/business — First-time registration of restaurant details (starts as pending)
 * PATCH /api/owner/business — Update editable details (contact, branding)
 */
module.exports = async function handler(req, res) {
  const sessionUser = requireAuth(req, res);
  if (!sessionUser) return;

  const ownerId = new ObjectId(sessionUser.userId);

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
    // GET: Retrieve authenticated owner's business
    // -------------------------------------------------------------
    if (req.method === "GET") {
      let business = await db.collection(COLLECTIONS.BUSINESSES).findOne({ ownerId });
      if (business) {
        business = await checkAndExpireApproval(db, business);
      }
      return res.status(200).json({
        success: true,
        business: business || null
      });
    }

    // -------------------------------------------------------------
    // POST: First-time restaurant registration
    // -------------------------------------------------------------
    if (req.method === "POST") {
      // 1. Check if owner already has a registered business
      const existing = await db.collection(COLLECTIONS.BUSINESSES).findOne({ ownerId });
      if (existing) {
        return res.status(409).json({
          success: false,
          error: "You have already registered a business.",
          business: existing
        });
      }

      const { name, ownerName, slug, phone, email, address } = body;

      if (!name || typeof name !== "string" || name.trim().length < 2) {
        return res.status(400).json({
          success: false,
          error: "Please enter a valid name of business"
        });
      }

      if (!ownerName || typeof ownerName !== "string" || ownerName.trim().length < 2) {
        return res.status(400).json({
          success: false,
          error: "Please enter a valid name of owner"
        });
      }

      const cleanPhone = phone ? String(phone).trim() : "";
      if (!cleanPhone || !/^[0-9]{10}$/.test(cleanPhone)) {
        return res.status(400).json({
          success: false,
          error: "Please enter a valid phone number."
        });
      }

      // Sync owner name and phone to user profile
      try {
        await db.collection(COLLECTIONS.USERS).updateOne(
          { _id: ownerId },
          { $set: { name: ownerName.trim(), phone: cleanPhone, updatedAt: new Date() } }
        );
      } catch (e) {}

      // Generate or validate slug
      let cleanSlug = slugify(slug || name);
      if (!cleanSlug || cleanSlug.length < 2) {
        cleanSlug = "restaurant";
      }

      // Check slug uniqueness & automatically assign unique suffix if taken
      const slugConflict = await db.collection(COLLECTIONS.BUSINESSES).findOne({ slug: cleanSlug });
      if (slugConflict) {
        const escapedBase = cleanSlug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(`^${escapedBase}(-\\d+)?$`);
        const matches = await db.collection(COLLECTIONS.BUSINESSES).find(
          { slug: regex },
          { projection: { slug: 1 } }
        ).toArray();

        const takenSlugs = new Set(matches.map(m => m.slug));
        let counter = 1;
        let candidate = `${cleanSlug}-${counter}`;
        while (takenSlugs.has(candidate)) {
          counter++;
          candidate = `${cleanSlug}-${counter}`;
        }
        cleanSlug = candidate;
      }

      // 3. Strict Server-Enforced Fields:
      // - approvalStatus is ALWAYS "pending" on registration
      // - subscriptionStatus is ALWAYS "trial"
      // - isPublished is ALWAYS false
        let initialLogoUrl = (body.logoUrl || (body.branding && body.branding.logoUrl) || "").trim();
        let logoFileId = null;
        if (initialLogoUrl.startsWith("data:")) {
          try {
            const fileExtMatch = initialLogoUrl.match(/^data:image\/([a-zA-Z0-9+]+);base64,/);
            let ext = "png";
            if (fileExtMatch && fileExtMatch[1]) {
              ext = fileExtMatch[1].replace("+xml", "");
              if (ext === "jpeg") ext = "jpg";
            }
            const uploadRes = await uploadToImageKit({
              file: initialLogoUrl,
              fileName: `${cleanSlug}-logo-${Date.now()}.${ext}`,
              folder: "/Menu/OwnerLogos/"
            });
            initialLogoUrl = uploadRes.url;
            logoFileId = uploadRes.fileId;
          } catch (uploadErr) {
            console.error("[ImageKit Registration Upload Error]:", uploadErr);
          }
        }

        const newBusiness = {
          ownerId,
          ownerName: ownerName.trim(),
          name: name.trim(),
          slug: cleanSlug,
          contact: {
            phone: phone ? String(phone).trim() : "",
            email: email ? String(email).trim().toLowerCase() : sessionUser.email,
            address: address ? String(address).trim() : ""
          },
          branding: {
            accentColor: "#991e2e",
            logoUrl: initialLogoUrl,
            ...(logoFileId ? { logoFileId } : {})
          },
        approvalStatus: APPROVAL_STATUS.PENDING,
        subscriptionStatus: SUBSCRIPTION_STATUS.TRIAL,
        subscriptionExpiry: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days free trial
        enabledFeatures: ["platter"],
        isPublished: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const insertRes = await db.collection(COLLECTIONS.BUSINESSES).insertOne(newBusiness);
      newBusiness._id = insertRes.insertedId;

      return res.status(201).json({
        success: true,
        message: "Business registered successfully. Your application is now pending review by the super admin.",
        business: newBusiness
      });
    }

    // -------------------------------------------------------------
    // PATCH: Update editable business details
    // -------------------------------------------------------------
    if (req.method === "PATCH") {
      let business = await db.collection(COLLECTIONS.BUSINESSES).findOne({ ownerId });
      if (!business) {
        return res.status(404).json({ success: false, error: "No business found for your account." });
      }
      business = await checkAndExpireApproval(db, business);

      // Security: Only allow updating safe fields. Disallow modifying approvalStatus, subscription, ownerId.
      // CRITICAL: The restaurant slug is permanent and immutable for the business. It is NEVER modified upon
      // business name or branding updates so that printed QR codes and shared public links never change or break.
      const safeUpdates = { updatedAt: new Date() };

      if (body.name && typeof body.name === "string" && body.name.trim().length >= 2) {
        safeUpdates.name = body.name.trim();
      }

      if (body.ownerName && typeof body.ownerName === "string" && body.ownerName.trim().length >= 2) {
        safeUpdates.ownerName = body.ownerName.trim();
        try {
          await db.collection(COLLECTIONS.USERS).updateOne(
            { _id: ownerId },
            { $set: { name: body.ownerName.trim(), updatedAt: new Date() } }
          );
        } catch (e) {}
      }

      const phoneVal = body.phone !== undefined ? body.phone : (body.contact && body.contact.phone !== undefined ? body.contact.phone : null);
      if (phoneVal !== null) {
        const cleanPhone = String(phoneVal).trim();
        if (/^[0-9]{10}$/.test(cleanPhone)) {
          if (!safeUpdates.contact) safeUpdates.contact = { ...(business.contact || {}) };
          safeUpdates.contact.phone = cleanPhone;
          try {
            await db.collection(COLLECTIONS.USERS).updateOne(
              { _id: ownerId },
              { $set: { phone: cleanPhone, updatedAt: new Date() } }
            );
          } catch (e) {}
        }
      }

      if (body.contact && typeof body.contact === "object") {
        safeUpdates.contact = {
          ...(business.contact || {}),
          ...(safeUpdates.contact || {}),
          email: body.contact.email !== undefined ? String(body.contact.email).trim().toLowerCase() : (business.contact ? business.contact.email : ""),
          address: body.contact.address !== undefined ? String(body.contact.address).trim() : (business.contact ? business.contact.address : "")
        };
      }

      const logoVal = body.logoUrl !== undefined ? body.logoUrl : (body.branding && body.branding.logoUrl !== undefined ? body.branding.logoUrl : null);
      if (logoVal !== null || (body.branding && typeof body.branding === "object")) {
        safeUpdates.branding = {
          ...(business.branding || { accentColor: "#991e2e", logoUrl: "" }),
          ...(body.branding && typeof body.branding === "object" ? body.branding : {})
        };
        if (logoVal !== null) {
          const rawLogo = String(logoVal).trim();
          const prevLogoFileId = business.branding && business.branding.logoFileId;
          const prevLogoUrl = business.branding && business.branding.logoUrl;

          if (rawLogo.startsWith("data:")) {
            try {
              const fileExtMatch = rawLogo.match(/^data:image\/([a-zA-Z0-9+]+);base64,/);
              let ext = "png";
              if (fileExtMatch && fileExtMatch[1]) {
                ext = fileExtMatch[1].replace("+xml", "");
                if (ext === "jpeg") ext = "jpg";
              }
              const slugPart = business.slug || "owner";
              const uploadRes = await uploadToImageKit({
                file: rawLogo,
                fileName: `${slugPart}-logo-${Date.now()}.${ext}`,
                folder: "/Menu/OwnerLogos/"
              });
              safeUpdates.branding.logoUrl = uploadRes.url;
              safeUpdates.branding.logoFileId = uploadRes.fileId;

              // Auto-delete previous logo from ImageKit
              if (prevLogoFileId) {
                deleteFromImageKit(prevLogoFileId).catch(err => {
                  console.error("[ImageKit] Failed to delete previous logo by fileId:", err);
                });
              } else if (prevLogoUrl) {
                deleteImageKitFileByUrl(prevLogoUrl).catch(err => {
                  console.error("[ImageKit] Failed to delete previous logo by URL:", err);
                });
              }
            } catch (uploadErr) {
              console.error("[ImageKit Logo Upload Error]:", uploadErr);
              return res.status(500).json({
                success: false,
                error: `ImageKit logo upload failed: ${uploadErr.message}`
              });
            }
          } else if (!rawLogo) {
            // Owner removed the logo
            safeUpdates.branding.logoUrl = "";
            safeUpdates.branding.logoFileId = "";

            if (prevLogoFileId) {
              deleteFromImageKit(prevLogoFileId).catch(err => {
                console.error("[ImageKit] Failed to delete removed logo by fileId:", err);
              });
            } else if (prevLogoUrl) {
              deleteImageKitFileByUrl(prevLogoUrl).catch(err => {
                console.error("[ImageKit] Failed to delete removed logo by URL:", err);
              });
            }
          } else {
            safeUpdates.branding.logoUrl = rawLogo;
            if (prevLogoUrl && rawLogo !== prevLogoUrl) {
              if (prevLogoFileId) {
                deleteFromImageKit(prevLogoFileId).catch(err => {
                  console.error("[ImageKit] Failed to delete replaced logo by fileId:", err);
                });
              } else {
                deleteImageKitFileByUrl(prevLogoUrl).catch(err => {
                  console.error("[ImageKit] Failed to delete replaced logo by URL:", err);
                });
              }
            }
          }
        }
      }

      // Can only toggle isPublished if approved and subscription active
      if (typeof body.isPublished === "boolean") {
        if (business.approvalStatus !== APPROVAL_STATUS.APPROVED) {
          return res.status(403).json({
            success: false,
            error: "You cannot publish your menu until your business application is approved."
          });
        }
        safeUpdates.isPublished = body.isPublished;
      }

      await db.collection(COLLECTIONS.BUSINESSES).updateOne(
        { _id: business._id },
        { $set: safeUpdates }
      );

      const updated = await db.collection(COLLECTIONS.BUSINESSES).findOne({ _id: business._id });
      return res.status(200).json({
        success: true,
        message: "Business details updated.",
        business: updated
      });
    }

    return res.status(405).json({ success: false, error: "Method not allowed." });
  } catch (error) {
    console.error("[Owner /business] Error:", error);
    return res.status(500).json({
      success: false,
      error: "An internal server error occurred."
    });
  }
};
