const fs = require('fs');
const path = require('path');

// Lazy load cloudinary only if configured
let cloudinary = null;
let isCloudinaryConfigured = false;

// Check if Cloudinary credentials are provided (without requiring the package)
function checkCloudinaryConfig() {
  return !!(
    process.env.CLOUDINARY_CLOUD_NAME && 
    process.env.CLOUDINARY_API_KEY && 
    process.env.CLOUDINARY_API_SECRET
  );
}

// Initialize Cloudinary only when needed
function initCloudinary() {
  if (!checkCloudinaryConfig()) {
    return false;
  }

  try {
    // Lazy require - only load when actually needed
    if (!cloudinary) {
      cloudinary = require('cloudinary').v2;
    }

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true
    });

    isCloudinaryConfigured = true;
    console.log('✅ Cloudinary configured successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize Cloudinary:', error.message);
    isCloudinaryConfigured = false;
    return false;
  }
}

// Initialize on module load if config is available
if (checkCloudinaryConfig()) {
  initCloudinary();
} else {
  console.log('ℹ️  Cloudinary not configured, using local storage');
}

/**
 * Upload image to Cloudinary
 * @param {string} filePath - Path to the local file
 * @param {string} folder - Folder name in Cloudinary (optional)
 * @returns {Promise<Object>} Cloudinary upload result
 */
async function uploadToCloudinary(filePath, folder = 'gallery') {
  if (!initCloudinary()) {
    throw new Error('Cloudinary is not configured');
  }

  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      resource_type: 'image',
      transformation: [
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ],
      overwrite: false,
      invalidate: true
    });

    console.log('✅ Image uploaded to Cloudinary:', result.secure_url);
    return {
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes
    };
  } catch (error) {
    console.error('❌ Cloudinary upload error:', error);
    throw error;
  }
}

/**
 * Upload image from buffer (for direct uploads)
 * @param {Buffer} buffer - Image buffer
 * @param {string} filename - Original filename
 * @param {string} folder - Folder name in Cloudinary (optional)
 * @returns {Promise<Object>} Cloudinary upload result
 */
async function uploadBufferToCloudinary(buffer, filename, folder = 'gallery') {
  if (!initCloudinary()) {
    throw new Error('Cloudinary is not configured');
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: 'image',
        transformation: [
          { quality: 'auto' },
          { fetch_format: 'auto' }
        ],
        public_id: path.parse(filename).name,
        overwrite: false,
        invalidate: true
      },
      (error, result) => {
        if (error) {
          console.error('❌ Cloudinary upload error:', error);
          reject(error);
        } else {
          console.log('✅ Image uploaded to Cloudinary:', result.secure_url);
          resolve({
            url: result.secure_url,
            public_id: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format,
            bytes: result.bytes
          });
        }
      }
    );

    uploadStream.end(buffer);
  });
}

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Cloudinary public_id
 * @returns {Promise<Object>} Deletion result
 */
async function deleteFromCloudinary(publicId) {
  if (!initCloudinary()) {
    throw new Error('Cloudinary is not configured');
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log('✅ Image deleted from Cloudinary:', publicId);
    return result;
  } catch (error) {
    console.error('❌ Cloudinary delete error:', error);
    throw error;
  }
}

/**
 * Extract public_id from Cloudinary URL
 * @param {string} url - Cloudinary URL
 * @returns {string|null} Public ID or null
 */
function extractPublicId(url) {
  if (!url || !url.includes('cloudinary.com')) {
    return null;
  }

  try {
    // Extract public_id from URL like:
    // https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/filename.jpg
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);
    return match ? match[1] : null;
  } catch (error) {
    console.error('Error extracting public_id:', error);
    return null;
  }
}

// Export getter function to check if configured
function getIsCloudinaryConfigured() {
  return isCloudinaryConfigured || checkCloudinaryConfig();
}

module.exports = {
  get isCloudinaryConfigured() {
    return getIsCloudinaryConfigured();
  },
  checkCloudinaryConfig,
  initCloudinary,
  uploadToCloudinary,
  uploadBufferToCloudinary,
  deleteFromCloudinary,
  extractPublicId
};

