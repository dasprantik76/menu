/**
 * ImageKit Integration Helper
 * Uploads media files directly to ImageKit CDN inside /Menu/OwnerLogos/
 */

const OWNER_LOGOS_FOLDER = "/Menu/OwnerLogos/";

/**
 * Upload a file (base64 Data URI, binary string, or URL) to ImageKit
 * @param {Object} options
 * @param {string} options.file - Base64 Data URI, binary, or URL
 * @param {string} options.fileName - File name with extension
 * @param {string} [options.folder] - Target folder in ImageKit (default: /Menu/OwnerLogos/)
 * @returns {Promise<{fileId: string, name: string, url: string, thumbnailUrl: string}>}
 */
async function uploadToImageKit({ file, fileName, folder = OWNER_LOGOS_FOLDER }) {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("IMAGEKIT_PRIVATE_KEY is not configured in environment variables.");
  }

  const authHeader = "Basic " + Buffer.from(privateKey + ":").toString("base64");

  const formData = new FormData();
  formData.append("file", file);
  formData.append("fileName", fileName || `logo-${Date.now()}.png`);
  formData.append("folder", folder);
  formData.append("useUniqueFileName", "true");

  const response = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
    method: "POST",
    headers: {
      "Authorization": authHeader
    },
    body: formData
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMsg = data && (data.message || data.error)
      ? (data.message || data.error)
      : "Failed to upload file to ImageKit.";
    throw new Error(errorMsg);
  }

  return {
    fileId: data.fileId,
    name: data.name,
    url: data.url,
    thumbnailUrl: data.thumbnailUrl
  };
}

/**
 * Delete a file from ImageKit by fileId
 * @param {string} fileId
 * @returns {Promise<boolean>}
 */
async function deleteFromImageKit(fileId) {
  if (!fileId) return false;
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  if (!privateKey) {
    console.warn("[ImageKit] Cannot delete, IMAGEKIT_PRIVATE_KEY is not configured.");
    return false;
  }

  const authHeader = "Basic " + Buffer.from(privateKey + ":").toString("base64");
  try {
    const response = await fetch(`https://api.imagekit.io/v1/files/${fileId}`, {
      method: "DELETE",
      headers: {
        Authorization: authHeader
      }
    });

    if (response.status === 204 || response.status === 200 || response.status === 404) {
      return true;
    }
    const errText = await response.text();
    console.warn(`[ImageKit] Delete fileId ${fileId} responded with status ${response.status}:`, errText);
    return false;
  } catch (err) {
    console.error(`[ImageKit] Error deleting fileId ${fileId}:`, err);
    return false;
  }
}

/**
 * Delete an ImageKit file given its URL (searches file by name and path in folder)
 * @param {string} fileUrl
 * @param {string} [folder]
 * @returns {Promise<boolean>}
 */
async function deleteImageKitFileByUrl(fileUrl, folder = OWNER_LOGOS_FOLDER) {
  if (!fileUrl || typeof fileUrl !== "string") return false;
  if (!fileUrl.includes("imagekit.io")) return false;

  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  if (!privateKey) return false;

  const authHeader = "Basic " + Buffer.from(privateKey + ":").toString("base64");

  try {
    const cleanUrl = fileUrl.split("?")[0];
    const fileName = cleanUrl.split("/").pop();
    if (!fileName) return false;

    const cleanFolder = folder.replace(/\/$/, "");
    const searchUrl = `https://api.imagekit.io/v1/files?name=${encodeURIComponent(fileName)}&path=${encodeURIComponent(cleanFolder)}`;

    const searchRes = await fetch(searchUrl, {
      headers: { Authorization: authHeader }
    });

    if (!searchRes.ok) return false;
    const files = await searchRes.json();
    if (Array.isArray(files) && files.length > 0) {
      for (const item of files) {
        if (item.fileId) {
          await deleteFromImageKit(item.fileId);
        }
      }
      return true;
    }
    return false;
  } catch (err) {
    console.error("[ImageKit] Error deleting file by URL:", err);
    return false;
  }
}

module.exports = {
  uploadToImageKit,
  deleteFromImageKit,
  deleteImageKitFileByUrl,
  OWNER_LOGOS_FOLDER
};
