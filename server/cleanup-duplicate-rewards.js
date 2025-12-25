/**
 * Script to clean up duplicate rewards in the database
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
  cleanupDuplicates();
});

function cleanupDuplicates() {
  // First, check current count
  db.get('SELECT COUNT(*) as total FROM rewards', (err, row) => {
    if (err) {
      console.error('Error counting rewards:', err.message);
      process.exit(1);
    }
    console.log(`\n📊 Total rewards before cleanup: ${row.total}`);
    
    // Show duplicates
    db.all(`
      SELECT name, category, points_required, COUNT(*) as count
      FROM rewards
      GROUP BY name, category, points_required
      HAVING COUNT(*) > 1
    `, (err, duplicates) => {
      if (err) {
        console.error('Error finding duplicates:', err.message);
        process.exit(1);
      }
      
      if (duplicates.length === 0) {
        console.log('✅ No duplicates found!');
        db.close();
        process.exit(0);
      }
      
      console.log(`\n⚠️  Found ${duplicates.length} duplicate groups:`);
      duplicates.forEach((dup, index) => {
        console.log(`  ${index + 1}. "${dup.name}" (${dup.category}, ${dup.points_required} điểm) - ${dup.count} copies`);
      });
      
      // Delete duplicates, keeping only the first one (lowest id)
      db.run(`
        DELETE FROM rewards 
        WHERE id NOT IN (
          SELECT MIN(id) 
          FROM rewards 
          GROUP BY name, category, points_required
        )
      `, function(err) {
        if (err) {
          console.error('❌ Error deleting duplicates:', err.message);
          process.exit(1);
        }
        
        console.log(`\n✅ Deleted ${this.changes} duplicate rewards`);
        
        // Check final count
        db.get('SELECT COUNT(*) as total FROM rewards', (err, row) => {
          if (err) {
            console.error('Error counting rewards:', err.message);
            process.exit(1);
          }
          console.log(`📊 Total rewards after cleanup: ${row.total}`);
          
          // Show remaining rewards
          db.all('SELECT id, name, category, points_required FROM rewards ORDER BY category, points_required', (err, rewards) => {
            if (err) {
              console.error('Error fetching rewards:', err.message);
              process.exit(1);
            }
            
            console.log(`\n📋 Remaining rewards (${rewards.length}):`);
            console.log('─'.repeat(80));
            rewards.forEach((reward, index) => {
              console.log(`${index + 1}. [${reward.category}] ${reward.name} - ${reward.points_required} điểm (ID: ${reward.id})`);
            });
            console.log('─'.repeat(80));
            
            db.close((err) => {
              if (err) {
                console.error('Error closing database:', err.message);
              } else {
                console.log('\n✅ Cleanup complete!');
              }
              process.exit(0);
            });
          });
        });
      });
    });
  });
}

