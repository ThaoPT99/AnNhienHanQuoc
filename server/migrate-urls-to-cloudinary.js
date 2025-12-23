#!/usr/bin/env node
/**
 * Dummy migration script for Railway build compatibility
 * 
 * This file exists only to prevent Railway from failing during build.
 * The actual migration script is in scripts/migrate-urls-to-cloudinary.js
 * 
 * This script will exit successfully without doing anything.
 */

console.log('ℹ️  Migration script placeholder - no action needed during build');
process.exit(0);
