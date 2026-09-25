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

module.exports = {
  uploadToImageKit,
  OWNER_LOGOS_FOLDER
};
