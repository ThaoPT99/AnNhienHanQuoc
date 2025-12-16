/**
 * Migration script to upload images from URLs to Cloudinary
 * 
 * This script will:
 * 1. Find all gallery images with URLs (not already on Cloudinary)
 * 2. Download images from URLs
 * 3. Upload them to Cloudinary
 * 4. Update the database with new Cloudinary URLs
 * 
 * Usage:
 *   node migrate-urls-to-cloudinary.js
 */

require('dotenv').config();
const { dbHelpers } = require('./database');
const { uploadBufferToCloudinary, isCloudinaryConfigured: getIsCloudinaryConfigured, initCloudinary } = require('./cloudinary');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

async function downloadImage(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    protocol.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }

      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => {
        const buffer = Buffer.concat(chunks);
        const contentType = response.headers['content-type'] || 'image/jpeg';
        resolve({ buffer, contentType });
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function migrateImages() {
  const isCloudinaryConfigured = getIsCloudinaryConfigured;
  if (!isCloudinaryConfigured) {
    console.error('❌ Cloudinary is not configured!');
    console.error('Please set the following environment variables:');
    console.error('  - CLOUDINARY_CLOUD_NAME');
    console.error('  - CLOUDINARY_API_KEY');
    console.error('  - CLOUDINARY_API_SECRET');
    process.exit(1);
  }

  // Initialize Cloudinary
  if (!initCloudinary()) {
    console.error('❌ Failed to initialize Cloudinary');
    process.exit(1);
  }

  console.log('🚀 Starting migration of URLs to Cloudinary...\n');

  // Get all gallery images
  dbHelpers.getAllGalleryImages((err, images) => {
    if (err) {
      console.error('❌ Error fetching images:', err);
      process.exit(1);
    }

    if (!images || images.length === 0) {
      console.log('ℹ️  No images found in database');
      process.exit(0);
    }

    console.log(`📊 Found ${images.length} images in database\n`);

    // Filter images that are NOT on Cloudinary
    const imagesToMigrate = images.filter(img => {
      if (!img.url) return false;
      
      // Skip if already on Cloudinary
      if (img.url.includes('cloudinary.com')) {
        return false;
      }
      
      // Include all other URLs (local Railway URLs, external URLs, etc.)
      return true;
    });

    if (imagesToMigrate.length === 0) {
      console.log('ℹ️  No images to migrate (all images are already on Cloudinary)');
      process.exit(0);
    }

    console.log(`📁 Found ${imagesToMigrate.length} images to migrate to Cloudinary\n`);

    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;

    // Process images one by one
    const processNext = async (index) => {
      if (index >= imagesToMigrate.length) {
        // Migration complete
        console.log('\n✅ Migration complete!');
        console.log(`   ✅ Success: ${successCount}`);
        console.log(`   ❌ Errors: ${errorCount}`);
        console.log(`   ⏭️  Skipped: ${skippedCount}`);
        process.exit(0);
      }

      const image = imagesToMigrate[index];
      console.log(`[${index + 1}/${imagesToMigrate.length}] Processing: ${image.title || `Image #${image.id}`}`);
      console.log(`   📍 Current URL: ${image.url}`);

      try {
        // Download image from URL
        console.log(`   ⬇️  Downloading image...`);
        const { buffer, contentType } = await downloadImage(image.url);
        console.log(`   ✅ Downloaded ${(buffer.length / 1024).toFixed(2)} KB`);

        // Determine file extension from content type or URL
        let ext = 'jpg';
        if (contentType.includes('png')) ext = 'png';
        else if (contentType.includes('gif')) ext = 'gif';
        else if (contentType.includes('webp')) ext = 'webp';
        else {
          const urlExt = path.extname(new URL(image.url).pathname).toLowerCase().replace('.', '');
          if (urlExt) ext = urlExt;
        }

        const filename = `gallery-${image.id || Date.now()}.${ext}`;

        // Upload to Cloudinary
        console.log(`   📤 Uploading to Cloudinary...`);
        const cloudinaryResult = await uploadBufferToCloudinary(buffer, filename, 'gallery');

        // Update database
        const updateData = {
          url: cloudinaryResult.url,
          file_path: cloudinaryResult.public_id, // Store public_id
          file_size: cloudinaryResult.bytes,
          mime_type: `image/${cloudinaryResult.format}`
        };

        dbHelpers.updateGalleryImage(image.id, updateData, (updateErr, result) => {
          if (updateErr) {
            console.error(`   ❌ Database update failed: ${updateErr.message}`);
            errorCount++;
            processNext(index + 1);
            return;
          }

          console.log(`   ✅ Migrated successfully!`);
          console.log(`   🔗 New Cloudinary URL: ${cloudinaryResult.url}\n`);
          successCount++;

          processNext(index + 1);
        });
      } catch (error) {
        console.error(`   ❌ Migration failed: ${error.message}`);
        console.log(`   ⏭️  Skipping this image...\n`);
        errorCount++;
        processNext(index + 1);
      }
    };

    // Start processing
    processNext(0);
  });
}

// Run migration
migrateImages().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});

