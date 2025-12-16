/**
 * Migration script to upload existing local images to Cloudinary
 * 
 * Usage:
 *   node migrate-to-cloudinary.js
 * 
 * This script will:
 * 1. Find all gallery images in the database with local file paths
 * 2. Upload them to Cloudinary
 * 3. Update the database with new Cloudinary URLs
 * 4. Keep local files as backup (optional)
 */

require('dotenv').config();
const { dbHelpers } = require('./database');
const { uploadToCloudinary, isCloudinaryConfigured } = require('./cloudinary');
const fs = require('fs');
const path = require('path');

async function migrateImages() {
  if (!isCloudinaryConfigured) {
    console.error('❌ Cloudinary is not configured!');
    console.error('Please set the following environment variables:');
    console.error('  - CLOUDINARY_CLOUD_NAME');
    console.error('  - CLOUDINARY_API_KEY');
    console.error('  - CLOUDINARY_API_SECRET');
    process.exit(1);
  }

  console.log('🚀 Starting migration to Cloudinary...\n');

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

    console.log(`📊 Found ${images.length} images to migrate\n`);

    // Filter images that have local file paths
    const localImages = images.filter(img => {
      if (!img.file_path) return false;
      // Check if it's a local path (contains / or \)
      return img.file_path.includes('/') || img.file_path.includes('\\');
    });

    if (localImages.length === 0) {
      console.log('ℹ️  No local images to migrate (all images are already on Cloudinary or URLs)');
      process.exit(0);
    }

    console.log(`📁 Found ${localImages.length} local images to migrate\n`);

    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;

    // Process images one by one
    const processNext = async (index) => {
      if (index >= localImages.length) {
        // Migration complete
        console.log('\n✅ Migration complete!');
        console.log(`   Success: ${successCount}`);
        console.log(`   Errors: ${errorCount}`);
        console.log(`   Skipped: ${skippedCount}`);
        process.exit(0);
      }

      const image = localImages[index];
      console.log(`[${index + 1}/${localImages.length}] Processing: ${image.title || image.id}`);

      // Check if file exists
      if (!fs.existsSync(image.file_path)) {
        console.log(`   ⚠️  File not found: ${image.file_path}`);
        console.log(`   ℹ️  Skipping...\n`);
        skippedCount++;
        processNext(index + 1);
        return;
      }

      try {
        // Upload to Cloudinary
        console.log(`   📤 Uploading to Cloudinary...`);
        const cloudinaryResult = await uploadToCloudinary(image.file_path, 'gallery');

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
          console.log(`   🔗 New URL: ${cloudinaryResult.url}\n`);
          successCount++;

          // Optionally delete local file (commented out for safety)
          // Uncomment if you want to delete local files after migration
          /*
          try {
            fs.unlinkSync(image.file_path);
            console.log(`   🗑️  Deleted local file`);
          } catch (deleteErr) {
            console.error(`   ⚠️  Failed to delete local file: ${deleteErr.message}`);
          }
          */

          processNext(index + 1);
        });
      } catch (uploadError) {
        console.error(`   ❌ Upload failed: ${uploadError.message}`);
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

