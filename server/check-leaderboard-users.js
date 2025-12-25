/**
 * Script to check how many users are in the leaderboard
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = process.env.DATABASE_PATH || path.join(__dirname, 'contacts.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  }
  console.log('✅ Connected to database:', dbPath);
  checkUsers();
});

function checkUsers() {
  // Check if table exists
  db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='user_points'", (err, row) => {
    if (err) {
      console.error('Error checking table:', err.message);
      process.exit(1);
    }
    
    if (!row) {
      console.log('❌ user_points table does not exist!');
      process.exit(1);
    }
    
    console.log('✅ user_points table exists');
    
    // Count total users
    db.get('SELECT COUNT(*) as total FROM user_points', (err, row) => {
      if (err) {
        console.error('Error counting users:', err.message);
        process.exit(1);
      }
      console.log(`\n📊 Total users in database: ${row.total}`);
      
      // Get all users with details
      db.all('SELECT user_email, user_name, points, level, created_at FROM user_points ORDER BY points DESC, created_at ASC', (err, rows) => {
        if (err) {
          console.error('Error fetching users:', err.message);
          process.exit(1);
        }
        
        console.log(`\n📋 All users (${rows.length}):`);
        console.log('─'.repeat(80));
        rows.forEach((user, index) => {
          const displayName = user.user_name || user.user_email.split('@')[0];
          console.log(`${index + 1}. ${displayName.padEnd(30)} | ${String(user.points).padStart(6)} điểm | Level ${user.level} | ${user.user_email}`);
        });
        console.log('─'.repeat(80));
        
        // Close database
        db.close((err) => {
          if (err) {
            console.error('Error closing database:', err.message);
          } else {
            console.log('\n✅ Database check complete');
          }
          process.exit(0);
        });
      });
    });
  });
}

