/**
 * Script to check and create missing tables (rewards, user_points, redemptions)
 * Run this if tables are missing on production
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = process.env.DATABASE_PATH || path.join(__dirname, 'contacts.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  }
  console.log('✅ Connected to database:', dbPath);
  checkAndCreateTables();
});

function checkAndCreateTables() {
  db.serialize(() => {
    // Check if rewards table exists
    db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='rewards'", (err, row) => {
      if (err) {
        console.error('Error checking rewards table:', err.message);
      } else if (!row) {
        console.log('📝 Creating rewards table...');
        createRewardsTable();
      } else {
        console.log('✅ Rewards table exists');
      }
    });

    // Check if user_points table exists
    db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='user_points'", (err, row) => {
      if (err) {
        console.error('Error checking user_points table:', err.message);
      } else if (!row) {
        console.log('📝 Creating user_points table...');
        createUserPointsTable();
      } else {
        console.log('✅ User points table exists');
      }
    });

    // Check if redemptions table exists
    db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='redemptions'", (err, row) => {
      if (err) {
        console.error('Error checking redemptions table:', err.message);
      } else if (!row) {
        console.log('📝 Creating redemptions table...');
        createRedemptionsTable();
      } else {
        console.log('✅ Redemptions table exists');
      }
    });

    // Wait a bit then close
    setTimeout(() => {
      db.close((err) => {
        if (err) {
          console.error('Error closing database:', err.message);
        } else {
          console.log('✅ Database check complete');
        }
        process.exit(0);
      });
    }, 2000);
  });
}

function createRewardsTable() {
  db.run(`CREATE TABLE IF NOT EXISTS rewards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    points_required INTEGER NOT NULL,
    type TEXT NOT NULL,
    value TEXT,
    file_path TEXT,
    access_code TEXT,
    is_active INTEGER DEFAULT 1,
    stock_quantity INTEGER,
    created_at DATETIME DEFAULT (datetime('now')),
    updated_at DATETIME DEFAULT (datetime('now'))
  )`, (err) => {
    if (err) {
      console.error('❌ Error creating rewards table:', err.message);
    } else {
      console.log('✅ Rewards table created');
      insertDefaultRewards();
    }
  });
}

function createUserPointsTable() {
  db.run(`CREATE TABLE IF NOT EXISTS user_points (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_email TEXT NOT NULL UNIQUE,
    user_name TEXT,
    points INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    last_updated DATETIME DEFAULT (datetime('now')),
    created_at DATETIME DEFAULT (datetime('now'))
  )`, (err) => {
    if (err) {
      console.error('❌ Error creating user_points table:', err.message);
    } else {
      console.log('✅ User points table created');
      // Create indexes
      db.run(`CREATE INDEX IF NOT EXISTS idx_user_points_email ON user_points(user_email)`, (err) => {
        if (err) console.error('Error creating index:', err.message);
      });
      db.run(`CREATE INDEX IF NOT EXISTS idx_user_points_points ON user_points(points DESC)`, (err) => {
        if (err) console.error('Error creating index:', err.message);
      });
    }
  });
}

function createRedemptionsTable() {
  db.run(`CREATE TABLE IF NOT EXISTS redemptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_email TEXT NOT NULL,
    reward_id INTEGER NOT NULL,
    points_used INTEGER NOT NULL,
    status TEXT DEFAULT 'pending',
    redemption_code TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT (datetime('now')),
    updated_at DATETIME DEFAULT (datetime('now')),
    FOREIGN KEY (reward_id) REFERENCES rewards(id)
  )`, (err) => {
    if (err) {
      console.error('❌ Error creating redemptions table:', err.message);
    } else {
      console.log('✅ Redemptions table created');
      // Create indexes
      db.run(`CREATE INDEX IF NOT EXISTS idx_redemptions_user_email ON redemptions(user_email)`, (err) => {
        if (err) console.error('Error creating index:', err.message);
      });
      db.run(`CREATE INDEX IF NOT EXISTS idx_redemptions_reward_id ON redemptions(reward_id)`, (err) => {
        if (err) console.error('Error creating index:', err.message);
      });
      db.run(`CREATE INDEX IF NOT EXISTS idx_redemptions_status ON redemptions(status)`, (err) => {
        if (err) console.error('Error creating index:', err.message);
      });
    }
  });
}

function insertDefaultRewards() {
  db.run(`INSERT OR IGNORE INTO rewards (name, description, category, points_required, type, value, is_active) VALUES
    ('Voucher 50k học tiếng Hàn', 'Voucher giảm giá 50.000đ cho khóa học tiếng Hàn', 'voucher', 400, 'voucher', 'VOUCHER50K', 1),
    ('Voucher 100k học tiếng Hàn', 'Voucher giảm giá 100.000đ cho khóa học tiếng Hàn', 'voucher', 600, 'voucher', 'VOUCHER100K', 1),
    ('Voucher 200k học tiếng Hàn', 'Voucher giảm giá 200.000đ cho khóa học tiếng Hàn', 'voucher', 1000, 'voucher', 'VOUCHER200K', 1),
    ('Ebook Hướng dẫn du học Hàn Quốc', 'Ebook chi tiết về quy trình du học Hàn Quốc', 'document', 300, 'document', null, 1),
    ('Template hồ sơ du học', 'Bộ template đầy đủ cho hồ sơ du học', 'document', 500, 'document', null, 1),
    ('Checklist chuẩn bị du học', 'Checklist chi tiết các bước chuẩn bị du học', 'document', 400, 'document', null, 1),
    ('Access Group Facebook VIP', 'Tham gia group Facebook độc quyền với cựu du học sinh', 'access', 800, 'access', 'FB_GROUP_VIP', 1),
    ('Access Webinar độc quyền', 'Tham gia các webinar độc quyền về du học Hàn Quốc', 'access', 1000, 'access', 'WEBINAR_VIP', 1),
    ('Access Mentorship Program', 'Tham gia chương trình mentorship với cựu du học sinh', 'access', 2000, 'access', 'MENTORSHIP', 1)
  `, (err) => {
    if (err) {
      console.error('❌ Error inserting default rewards:', err.message);
    } else {
      console.log('✅ Default rewards inserted');
    }
  });
}


