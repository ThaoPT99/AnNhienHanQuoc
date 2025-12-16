#!/usr/bin/env node

/**
 * Database Backup Script
 * Tạo backup cho SQLite database
 * 
 * Usage:
 *   node backup-db.js
 *   node backup-db.js --auto (tự động xóa backup cũ)
 */

const fs = require('fs');
const path = require('path');

const dbPath = process.env.DATABASE_PATH || path.join(__dirname, 'contacts.db');
const backupDir = path.join(__dirname, 'backups');
const autoClean = process.argv.includes('--auto');

// Kiểm tra database có tồn tại không
if (!fs.existsSync(dbPath)) {
  console.error('❌ Database file not found:', dbPath);
  process.exit(1);
}

// Tạo thư mục backups nếu chưa có
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
  console.log('✅ Created backup directory:', backupDir);
}

// Tạo tên file backup
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
const backupPath = path.join(backupDir, `contacts_${timestamp}.db`);

try {
  // Copy database
  fs.copyFileSync(dbPath, backupPath);
  
  // Lấy thông tin file
  const stats = fs.statSync(backupPath);
  const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
  
  console.log('✅ Backup created successfully!');
  console.log('   Location:', backupPath);
  console.log('   Size:', fileSizeMB, 'MB');
  console.log('   Timestamp:', new Date().toLocaleString('vi-VN'));
  
  // Tự động xóa backup cũ hơn 30 ngày
  if (autoClean) {
    const files = fs.readdirSync(backupDir);
    const now = Date.now();
    const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 ngày
    
    let deletedCount = 0;
    files.forEach(file => {
      if (file.startsWith('contacts_') && file.endsWith('.db')) {
        const filePath = path.join(backupDir, file);
        const fileStats = fs.statSync(filePath);
        const fileAge = now - fileStats.mtimeMs;
        
        if (fileAge > maxAge) {
          fs.unlinkSync(filePath);
          deletedCount++;
          console.log('   🗑️  Deleted old backup:', file);
        }
      }
    });
    
    if (deletedCount > 0) {
      console.log(`   ✅ Cleaned up ${deletedCount} old backup(s)`);
    }
  }
  
} catch (error) {
  console.error('❌ Backup failed:', error.message);
  process.exit(1);
}

