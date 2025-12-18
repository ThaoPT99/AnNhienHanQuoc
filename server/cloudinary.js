const fs = require('fs');
const path = require('path');

// Lazy load cloudinary only if configured
let cloudinary = null;
let isCloudinaryConfigured = false;

// Check if Cloudinary credentials are provided (without requiring the package)
// Use try-catch to prevent Railway from failing build if secrets are not available
function checkCloudinaryConfig() {
  try {
    // Use bracket notation and wrap in try-catch to prevent static analysis
    const env = process.env;
    return !!(
      env['CLOUDINARY_CLOUD_NAME'] && 
      env['CLOUDINARY_API_KEY'] && 
      env['CLOUDINARY_API_SECRET']
    );
  } catch (error) {
    // If Railway tries to resolve secrets during build, catch and return false
    return false;
  }
}

// Initialize Cloudinary only when needed
function initCloudinary() {
  if (!checkCloudinaryConfig()) {
    return false;
  }

  try {
    // Lazy require - only load when actually needed
    // Use try-catch to handle case where package might not be installed
    if (!cloudinary) {
      try {
        cloudinary = require('cloudinary').v2;
      } catch (requireError) {
        // If cloudinary package is not available, return false
        console.log('ℹ️  Cloudinary package not available');
        return false;
      }
    }

    // Use bracket notation to access env vars
    const env = process.env;
    cloudinary.config({
      cloud_name: env['CLOUDINARY_CLOUD_NAME'],
      api_key: env['CLOUDINARY_API_KEY'],
      api_secret: env['CLOUDINARY_API_SECRET'],
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

// DO NOT initialize on module load - Railway will try to resolve secrets during build
// Only initialize when actually needed (at runtime)
// This prevents Railway from trying to resolve CLOUDINARY_* secrets during build phase

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

/**
 * Upload file (PDF, DOC, etc.) to Cloudinary as raw resource
 * @param {string} filePath - Path to the file
 * @param {string} folder - Folder name in Cloudinary (optional)
 * @returns {Promise<Object>} Cloudinary upload result
 */
async function uploadFileToCloudinary(filePath, folder = 'recruitment') {
  if (!initCloudinary()) {
    throw new Error('Cloudinary is not configured');
  }

  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      resource_type: 'raw', // Use 'raw' for PDF, DOC, DOCX files
      overwrite: false,
      invalidate: true
    });

    console.log('✅ File uploaded to Cloudinary:', result.secure_url);
    return {
      url: result.secure_url,
      public_id: result.public_id,
      bytes: result.bytes,
      format: result.format
    };
  } catch (error) {
    console.error('❌ Cloudinary file upload error:', error);
    throw error;
  }
}

module.exports = {
  get isCloudinaryConfigured() {
    return getIsCloudinaryConfigured();
  },
  checkCloudinaryConfig,
  initCloudinary,
  uploadToCloudinary,
  uploadFileToCloudinary,
  uploadBufferToCloudinary,
  deleteFromCloudinary,
  extractPublicId
};

