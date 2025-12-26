const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Database configuration
const dbPath = process.env.DATABASE_PATH || path.join(__dirname, 'contacts.db');

// Ensure database directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  try {
    fs.mkdirSync(dbDir, { recursive: true });
    console.log('📁 Created database directory:', dbDir);
  } catch (error) {
    console.error('❌ Error creating database directory:', error.message);
    // If /data doesn't exist and we're trying to use it, it means Volume not mounted
    if (dbPath.startsWith('/data')) {
      console.error('⚠️  Railway Volume chưa được mount tại /data');
      console.error('💡 Hãy tạo Volume trên Railway Dashboard với mount path: /data');
    }
  }
}

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('✅ Connected to SQLite database:', dbPath);
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  db.serialize(() => {
    // Create contacts table
    db.run(`CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      message TEXT,
      status TEXT DEFAULT 'new',
      created_at DATETIME DEFAULT (datetime('now')),
      updated_at DATETIME DEFAULT (datetime('now'))
    )`, (err) => {
      if (err) {
        console.error('Error creating contacts table:', err.message);
      } else {
        console.log('✅ Contacts table ready');
        
        // Migration: Add status column if it doesn't exist (for existing databases)
        db.run(`ALTER TABLE contacts ADD COLUMN status TEXT DEFAULT 'new'`, (alterErr) => {
          // Ignore error if column already exists
        });
        
        // Migration: Add updated_at column if it doesn't exist
        db.run(`ALTER TABLE contacts ADD COLUMN updated_at DATETIME DEFAULT datetime('now')`, (alterErr) => {
          // Ignore error if column already exists
        });
      }
    });

    // Create index for faster queries
    db.run(`CREATE INDEX IF NOT EXISTS idx_created_at ON contacts(created_at)`, (err) => {
      if (err) {
        console.error('Error creating index:', err.message);
      }
    });

    // Only create status index if status column exists
    db.all("PRAGMA table_info(contacts)", (err, rows) => {
      if (!err && rows && Array.isArray(rows)) {
        const hasStatus = rows.some(col => col.name === 'status');
        if (hasStatus) {
          db.run(`CREATE INDEX IF NOT EXISTS idx_status ON contacts(status)`, (indexErr) => {
            if (indexErr) {
              console.error('Error creating status index:', indexErr.message);
            }
          });
        }
      }
    });

    // Create gallery table
    db.run(`CREATE TABLE IF NOT EXISTS gallery (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      url TEXT NOT NULL,
      category TEXT DEFAULT 'Khác',
      description TEXT,
      file_path TEXT,
      file_size INTEGER,
      mime_type TEXT,
      created_at DATETIME DEFAULT (datetime('now')),
      updated_at DATETIME DEFAULT (datetime('now'))
    )`, (err) => {
      if (err) {
        console.error('Error creating gallery table:', err.message);
      } else {
        console.log('✅ Gallery table ready');
      }
    });

    // Create index for gallery
    db.run(`CREATE INDEX IF NOT EXISTS idx_gallery_category ON gallery(category)`, (err) => {
      if (err) {
        console.error('Error creating gallery index:', err.message);
      }
    });

    // Create newsletter table
    db.run(`CREATE TABLE IF NOT EXISTS newsletter (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      name TEXT,
      status TEXT DEFAULT 'active',
      subscribed_at DATETIME DEFAULT (datetime('now')),
      unsubscribed_at DATETIME,
      source TEXT DEFAULT 'website'
    )`, (err) => {
      if (err) {
        console.error('Error creating newsletter table:', err.message);
      } else {
        console.log('✅ Newsletter table ready');
      }
    });

    // Create index for newsletter
    db.run(`CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter(email)`, (err) => {
      if (err) {
        console.error('Error creating newsletter index:', err.message);
      }
    });

    // Create events table (for registrations)
    db.run(`CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      registered_at DATETIME DEFAULT (datetime('now')),
      status TEXT DEFAULT 'pending'
    )`, (err) => {
      if (err) {
        console.error('Error creating events table:', err.message);
      } else {
        console.log('✅ Events table ready');
      }
    });

    // Create event_details table (for event information)
    db.run(`CREATE TABLE IF NOT EXISTS event_details (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      location TEXT NOT NULL,
      type TEXT DEFAULT 'Hội thảo',
      status TEXT DEFAULT 'upcoming',
      image TEXT,
      agenda TEXT,
      speakers TEXT,
      capacity INTEGER DEFAULT 50,
      created_at DATETIME DEFAULT (datetime('now')),
      updated_at DATETIME DEFAULT (datetime('now'))
    )`, (err) => {
      if (err) {
        console.error('Error creating event_details table:', err.message);
      } else {
        console.log('✅ Event details table ready');
      }
    });

    // Create recruitment applications table
    db.run(`CREATE TABLE IF NOT EXISTS recruitment (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      position TEXT NOT NULL,
      experience TEXT,
      message TEXT,
      cv_file_path TEXT,
      cv_file_name TEXT,
      applied_at DATETIME DEFAULT (datetime('now')),
      status TEXT DEFAULT 'pending'
    )`, (err) => {
      if (err) {
        console.error('Error creating recruitment table:', err.message);
      } else {
        console.log('✅ Recruitment table ready');
      }
    });

    // Create resources downloads table
    db.run(`CREATE TABLE IF NOT EXISTS resources_downloads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL,
      resource_id INTEGER NOT NULL,
      resource_title TEXT,
      downloaded_at DATETIME DEFAULT (datetime('now'))
    )`, (err) => {
      if (err) {
        console.error('Error creating resources_downloads table:', err.message);
      } else {
        console.log('✅ Resources downloads table ready');
      }
    });

    // Create consultation table
    db.run(`CREATE TABLE IF NOT EXISTS consultation (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL,
      current_grade TEXT,
      interested_major TEXT,
      interested_city TEXT,
      budget TEXT,
      topik_level TEXT,
      message TEXT,
      trigger_source TEXT DEFAULT 'general',
      submitted_at DATETIME DEFAULT (datetime('now')),
      status TEXT DEFAULT 'new'
    )`, (err) => {
      if (err) {
        console.error('Error creating consultation table:', err.message);
      } else {
        console.log('✅ Consultation table ready');
      }
    });

    // Create consultation_booking table
    db.run(`CREATE TABLE IF NOT EXISTS consultation_booking (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      formatted_date TEXT,
      preferred_method TEXT DEFAULT 'zoom',
      notes TEXT,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT (datetime('now'))
    )`, (err) => {
      if (err) {
        console.error('Error creating consultation_booking table:', err.message);
      } else {
        console.log('✅ Consultation booking table ready');
      }
    });

    // Create visits table for tracking website visitors
    db.run(`CREATE TABLE IF NOT EXISTS visits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ip_address TEXT,
      user_agent TEXT,
      page_path TEXT,
      referrer TEXT,
      country TEXT,
      city TEXT,
      device_type TEXT,
      browser TEXT,
      os TEXT,
      visited_at DATETIME DEFAULT (datetime('now'))
    )`, (err) => {
      if (err) {
        console.error('Error creating visits table:', err.message);
      } else {
        console.log('✅ Visits table ready');
      }
    });

    // Create indexes for visits
    db.run(`CREATE INDEX IF NOT EXISTS idx_visits_visited_at ON visits(visited_at)`, (err) => {
      if (err) console.error('Error creating visits index:', err.message);
    });
    
    db.run(`CREATE INDEX IF NOT EXISTS idx_visits_ip_address ON visits(ip_address)`, (err) => {
      if (err) console.error('Error creating visits ip index:', err.message);
    });

    // Create indexes
    db.run(`CREATE INDEX IF NOT EXISTS idx_recruitment_status ON recruitment(status)`, (err) => {
      if (err) console.error('Error creating recruitment index:', err.message);
    });

    db.run(`CREATE INDEX IF NOT EXISTS idx_resources_email ON resources_downloads(email)`, (err) => {
      if (err) console.error('Error creating resources index:', err.message);
    });

    db.run(`CREATE INDEX IF NOT EXISTS idx_gallery_created_at ON gallery(created_at)`, (err) => {
      if (err) {
        console.error('Error creating gallery index:', err.message);
      }
    });

    // Create admin table (for future use, currently using env vars)
    db.run(`CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT (datetime('now'))
    )`, (err) => {
      if (err) {
        console.error('Error creating admins table:', err.message);
      }
    });

    // Create community_posts table
    db.run(`CREATE TABLE IF NOT EXISTS community_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      author_name TEXT NOT NULL,
      author_email TEXT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      category TEXT DEFAULT 'Tất cả',
      tags TEXT,
      type TEXT DEFAULT 'discussion',
      likes_count INTEGER DEFAULT 0,
      comments_count INTEGER DEFAULT 0,
      views_count INTEGER DEFAULT 0,
      is_featured INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT (datetime('now')),
      updated_at DATETIME DEFAULT (datetime('now'))
    )`, (err) => {
      if (err) {
        console.error('Error creating community_posts table:', err.message);
      } else {
        console.log('✅ Community posts table ready');
      }
    });

    // Create community_comments table
    db.run(`CREATE TABLE IF NOT EXISTS community_comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      post_id INTEGER NOT NULL,
      author_name TEXT NOT NULL,
      author_email TEXT,
      content TEXT NOT NULL,
      likes_count INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT (datetime('now')),
      FOREIGN KEY (post_id) REFERENCES community_posts(id) ON DELETE CASCADE
    )`, (err) => {
      if (err) {
        console.error('Error creating community_comments table:', err.message);
      } else {
        console.log('✅ Community comments table ready');
      }
    });

    // Create community_likes table
    db.run(`CREATE TABLE IF NOT EXISTS community_likes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      post_id INTEGER,
      comment_id INTEGER,
      user_email TEXT NOT NULL,
      created_at DATETIME DEFAULT (datetime('now')),
      FOREIGN KEY (post_id) REFERENCES community_posts(id) ON DELETE CASCADE,
      FOREIGN KEY (comment_id) REFERENCES community_comments(id) ON DELETE CASCADE,
      UNIQUE(post_id, comment_id, user_email)
    )`, (err) => {
      if (err) {
        console.error('Error creating community_likes table:', err.message);
      } else {
        console.log('✅ Community likes table ready');
      }
    });

    // Create indexes for community
    db.run(`CREATE INDEX IF NOT EXISTS idx_community_posts_category ON community_posts(category)`, (err) => {
      if (err) console.error('Error creating community posts index:', err.message);
    });
    
    db.run(`CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON community_posts(created_at)`, (err) => {
      if (err) console.error('Error creating community posts date index:', err.message);
    });
    
    db.run(`CREATE INDEX IF NOT EXISTS idx_community_comments_post_id ON community_comments(post_id)`, (err) => {
      if (err) console.error('Error creating community comments index:', err.message);
    });

    // Create user_follows table for follow system
    db.run(`CREATE TABLE IF NOT EXISTS user_follows (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      follower_email TEXT NOT NULL,
      following_email TEXT NOT NULL,
      created_at DATETIME DEFAULT (datetime('now')),
      UNIQUE(follower_email, following_email),
      CHECK(follower_email != following_email)
    )`, (err) => {
      if (err) {
        console.error('Error creating user_follows table:', err.message);
      } else {
        console.log('✅ User follows table ready');
      }
    });

    // Create user_profiles table
    db.run(`CREATE TABLE IF NOT EXISTS user_profiles (
      email TEXT PRIMARY KEY,
      display_name TEXT,
      bio TEXT,
      avatar_url TEXT,
      location TEXT,
      interests TEXT,
      social_links TEXT,
      created_at DATETIME DEFAULT (datetime('now')),
      updated_at DATETIME DEFAULT (datetime('now'))
    )`, (err) => {
      if (err) {
        console.error('Error creating user_profiles table:', err.message);
      } else {
        console.log('✅ User profiles table ready');
      }
    });

    // Create community_reactions table (extended from likes with emoji support)
    db.run(`CREATE TABLE IF NOT EXISTS community_reactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      post_id INTEGER,
      comment_id INTEGER,
      user_email TEXT NOT NULL,
      reaction_type TEXT DEFAULT 'like',
      created_at DATETIME DEFAULT (datetime('now')),
      FOREIGN KEY (post_id) REFERENCES community_posts(id) ON DELETE CASCADE,
      FOREIGN KEY (comment_id) REFERENCES community_comments(id) ON DELETE CASCADE,
      UNIQUE(post_id, comment_id, user_email, reaction_type)
    )`, (err) => {
      if (err) {
        console.error('Error creating community_reactions table:', err.message);
      } else {
        console.log('✅ Community reactions table ready');
      }
    });

    // Create community_mentions table
    db.run(`CREATE TABLE IF NOT EXISTS community_mentions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      post_id INTEGER,
      comment_id INTEGER,
      mentioned_email TEXT NOT NULL,
      mentioned_by_email TEXT NOT NULL,
      created_at DATETIME DEFAULT (datetime('now')),
      read INTEGER DEFAULT 0,
      FOREIGN KEY (post_id) REFERENCES community_posts(id) ON DELETE CASCADE,
      FOREIGN KEY (comment_id) REFERENCES community_comments(id) ON DELETE CASCADE
    )`, (err) => {
      if (err) {
        console.error('Error creating community_mentions table:', err.message);
      } else {
        console.log('✅ Community mentions table ready');
      }
    });

    // Create indexes for social features
    db.run(`CREATE INDEX IF NOT EXISTS idx_user_follows_follower ON user_follows(follower_email)`, (err) => {
      if (err) console.error('Error creating user_follows index:', err.message);
    });
    
    db.run(`CREATE INDEX IF NOT EXISTS idx_user_follows_following ON user_follows(following_email)`, (err) => {
      if (err) console.error('Error creating user_follows following index:', err.message);
    });

    db.run(`CREATE INDEX IF NOT EXISTS idx_community_reactions_post ON community_reactions(post_id)`, (err) => {
      if (err) console.error('Error creating community_reactions index:', err.message);
    });

    db.run(`CREATE INDEX IF NOT EXISTS idx_community_mentions_email ON community_mentions(mentioned_email)`, (err) => {
      if (err) console.error('Error creating community_mentions index:', err.message);
    });

    // Create matching_questionnaires table for AI-Powered Matching
    db.run(`CREATE TABLE IF NOT EXISTS matching_questionnaires (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_email TEXT NOT NULL UNIQUE,
      major TEXT,
      budget_range TEXT,
      location_preference TEXT,
      language_level TEXT,
      scholarship_priority INTEGER DEFAULT 0,
      university_type TEXT,
      duration_preference TEXT,
      accommodation_preference TEXT,
      career_goals TEXT,
      created_at DATETIME DEFAULT (datetime('now')),
      updated_at DATETIME DEFAULT (datetime('now'))
    )`, (err) => {
      if (err) {
        console.error('Error creating matching_questionnaires table:', err.message);
      } else {
        console.log('✅ Matching questionnaires table ready');
        // Add UNIQUE constraint if table already exists without it
        db.run(`CREATE UNIQUE INDEX IF NOT EXISTS idx_matching_questionnaires_email_unique ON matching_questionnaires(user_email)`, (err) => {
          if (err) console.error('Error creating unique index:', err.message);
        });
      }
    });

    // Create matching_results table
    db.run(`CREATE TABLE IF NOT EXISTS matching_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_email TEXT NOT NULL,
      school_name TEXT NOT NULL,
      match_score REAL NOT NULL,
      match_reasons TEXT,
      created_at DATETIME DEFAULT (datetime('now'))
    )`, (err) => {
      if (err) {
        console.error('Error creating matching_results table:', err.message);
      } else {
        console.log('✅ Matching results table ready');
      }
    });

    // Create users table for authentication
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      display_name TEXT,
      email_verified INTEGER DEFAULT 0,
      verification_token TEXT,
      last_login DATETIME,
      created_at DATETIME DEFAULT (datetime('now')),
      updated_at DATETIME DEFAULT (datetime('now'))
    )`, (err) => {
      if (err) {
        console.error('Error creating users table:', err.message);
      } else {
        console.log('✅ Users table ready');
        // Create index for users
        db.run(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`, (err) => {
          if (err) console.error('Error creating users email index:', err.message);
        });
      }
    });

    // Create video_call_bookings table for Video Call Integration
    db.run(`CREATE TABLE IF NOT EXISTS video_call_bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_email TEXT NOT NULL,
      user_name TEXT,
      call_type TEXT DEFAULT 'consultation',
      platform TEXT DEFAULT 'zoom',
      meeting_url TEXT,
      meeting_id TEXT,
      meeting_password TEXT,
      scheduled_time DATETIME NOT NULL,
      duration INTEGER DEFAULT 30,
      timezone TEXT DEFAULT 'Asia/Ho_Chi_Minh',
      status TEXT DEFAULT 'scheduled',
      notes TEXT,
      created_at DATETIME DEFAULT (datetime('now')),
      updated_at DATETIME DEFAULT (datetime('now'))
    )`, (err) => {
      if (err) {
        console.error('Error creating video_call_bookings table:', err.message);
      } else {
        console.log('✅ Video call bookings table ready');
      }
    });

    // Create indexes for new tables
    db.run(`CREATE INDEX IF NOT EXISTS idx_matching_questionnaires_email ON matching_questionnaires(user_email)`, (err) => {
      if (err) console.error('Error creating matching_questionnaires index:', err.message);
    });

    db.run(`CREATE INDEX IF NOT EXISTS idx_matching_results_email ON matching_results(user_email)`, (err) => {
      if (err) console.error('Error creating matching_results index:', err.message);
    });

    db.run(`CREATE INDEX IF NOT EXISTS idx_video_call_bookings_email ON video_call_bookings(user_email)`, (err) => {
      if (err) console.error('Error creating video_call_bookings index:', err.message);
    });

    db.run(`CREATE INDEX IF NOT EXISTS idx_video_call_bookings_time ON video_call_bookings(scheduled_time)`, (err) => {
      if (err) console.error('Error creating video_call_bookings time index:', err.message);
    });

    // Create rewards table
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
      updated_at DATETIME DEFAULT (datetime('now')),
      UNIQUE(name, category, points_required)
    )`, (err) => {
      if (err) {
        console.error('Error creating rewards table:', err.message);
      } else {
        console.log('✅ Rewards table ready');
        // Clean up duplicates after table creation
        cleanupDuplicateRewards();
      }
    });

    // Create user_points table for leaderboard
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
        console.error('Error creating user_points table:', err.message);
      } else {
        console.log('✅ User points table ready');
      }
    });

    // Create redemptions table
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
        console.error('Error creating redemptions table:', err.message);
      } else {
        console.log('✅ Redemptions table ready');
      }
    });

    // Create indexes for redemptions
    db.run(`CREATE INDEX IF NOT EXISTS idx_redemptions_user_email ON redemptions(user_email)`, (err) => {
      if (err) console.error('Error creating index:', err.message);
    });

    db.run(`CREATE INDEX IF NOT EXISTS idx_redemptions_reward_id ON redemptions(reward_id)`, (err) => {
      if (err) console.error('Error creating index:', err.message);
    });

    db.run(`CREATE INDEX IF NOT EXISTS idx_redemptions_status ON redemptions(status)`, (err) => {
      if (err) console.error('Error creating index:', err.message);
    });

    // Create indexes for user_points
    db.run(`CREATE INDEX IF NOT EXISTS idx_user_points_email ON user_points(user_email)`, (err) => {
      if (err) console.error('Error creating index:', err.message);
    });

    db.run(`CREATE INDEX IF NOT EXISTS idx_user_points_points ON user_points(points DESC)`, (err) => {
      if (err) console.error('Error creating index:', err.message);
    });

    // Create service_redemptions table for Phase 2 (dịch vụ)
    db.run(`CREATE TABLE IF NOT EXISTS service_redemptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      redemption_id INTEGER NOT NULL,
      user_email TEXT NOT NULL,
      service_type TEXT NOT NULL,
      preferred_date TEXT,
      preferred_time TEXT,
      preferred_method TEXT DEFAULT 'zoom',
      notes TEXT,
      status TEXT DEFAULT 'pending',
      admin_notes TEXT,
      created_at DATETIME DEFAULT (datetime('now')),
      updated_at DATETIME DEFAULT (datetime('now')),
      FOREIGN KEY (redemption_id) REFERENCES redemptions(id)
    )`, (err) => {
      if (err) {
        console.error('Error creating service_redemptions table:', err.message);
      } else {
        console.log('✅ Service redemptions table ready');
      }
    });

    // Create document_reviews table for Phase 2 (review hồ sơ)
    db.run(`CREATE TABLE IF NOT EXISTS document_reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      redemption_id INTEGER NOT NULL,
      user_email TEXT NOT NULL,
      review_type TEXT NOT NULL,
      document_url TEXT,
      document_name TEXT,
      user_notes TEXT,
      admin_review TEXT,
      admin_feedback TEXT,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT (datetime('now')),
      updated_at DATETIME DEFAULT (datetime('now')),
      FOREIGN KEY (redemption_id) REFERENCES redemptions(id)
    )`, (err) => {
      if (err) {
        console.error('Error creating document_reviews table:', err.message);
      } else {
        console.log('✅ Document reviews table ready');
      }
    });

    // Create visa_support table for Phase 2 (hỗ trợ visa)
    db.run(`CREATE TABLE IF NOT EXISTS visa_support (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      redemption_id INTEGER NOT NULL,
      user_email TEXT NOT NULL,
      support_type TEXT NOT NULL,
      current_status TEXT,
      questions TEXT,
      documents_uploaded TEXT,
      admin_response TEXT,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT (datetime('now')),
      updated_at DATETIME DEFAULT (datetime('now')),
      FOREIGN KEY (redemption_id) REFERENCES redemptions(id)
    )`, (err) => {
      if (err) {
        console.error('Error creating visa_support table:', err.message);
      } else {
        console.log('✅ Visa support table ready');
      }
    });

    // Create indexes for Phase 2 tables
    db.run(`CREATE INDEX IF NOT EXISTS idx_service_redemptions_redemption_id ON service_redemptions(redemption_id)`, (err) => {
      if (err) console.error('Error creating index:', err.message);
    });

    db.run(`CREATE INDEX IF NOT EXISTS idx_document_reviews_redemption_id ON document_reviews(redemption_id)`, (err) => {
      if (err) console.error('Error creating index:', err.message);
    });

    db.run(`CREATE INDEX IF NOT EXISTS idx_visa_support_redemption_id ON visa_support(redemption_id)`, (err) => {
      if (err) console.error('Error creating index:', err.message);
    });

    // Clean up duplicate rewards function
    const cleanupDuplicateRewards = () => {
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
          console.error('Error cleaning up duplicate rewards:', err.message);
        } else if (this.changes > 0) {
          console.log(`✅ Cleaned up ${this.changes} duplicate rewards`);
        }
      });
    };

    // Clean up duplicates on startup
    cleanupDuplicateRewards();

    // Insert default rewards (Phase 1)
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
        console.error('Error inserting default rewards:', err.message);
      } else {
        console.log('✅ Default rewards inserted');
      }
    });

    // Insert Phase 2 rewards (Dịch vụ, Review hồ sơ, Hỗ trợ visa)
    db.run(`INSERT OR IGNORE INTO rewards (name, description, category, points_required, type, value, is_active) VALUES
      ('Tư vấn 1-1 (30 phút)', 'Buổi tư vấn trực tiếp 1-1 với chuyên gia du học (30 phút)', 'service', 1000, 'service', 'CONSULTATION_30', 1),
      ('Tư vấn 1-1 (60 phút)', 'Buổi tư vấn trực tiếp 1-1 với chuyên gia du học (60 phút)', 'service', 2000, 'service', 'CONSULTATION_60', 1),
      ('Gói tư vấn 3 buổi', 'Gói tư vấn 3 buổi với chuyên gia du học', 'service', 3000, 'service', 'CONSULTATION_PACKAGE', 1),
      ('Review hồ sơ cơ bản', 'Review và đánh giá hồ sơ du học cơ bản', 'service', 500, 'service', 'REVIEW_BASIC', 1),
      ('Review hồ sơ chi tiết', 'Review hồ sơ chi tiết + gợi ý cải thiện', 'service', 1000, 'service', 'REVIEW_DETAILED', 1),
      ('Review hồ sơ + chỉnh sửa', 'Review hồ sơ + chỉnh sửa và tối ưu hóa', 'service', 1500, 'service', 'REVIEW_EDIT', 1),
      ('Checklist chuẩn bị visa', 'Checklist chi tiết các bước chuẩn bị visa', 'service', 800, 'service', 'VISA_CHECKLIST', 1),
      ('Hướng dẫn xin visa', 'Hướng dẫn chi tiết quy trình xin visa du học Hàn Quốc', 'service', 1500, 'service', 'VISA_GUIDE', 1),
      ('Hỗ trợ điền form visa', 'Hỗ trợ điền form và chuẩn bị hồ sơ visa', 'service', 2500, 'service', 'VISA_FORM_SUPPORT', 1)
    `, (err) => {
      if (err) {
        console.error('Error inserting Phase 2 rewards:', err.message);
      } else {
        console.log('✅ Phase 2 rewards inserted');
      }
    });
  });
}

// Database helper functions
const dbHelpers = {
  // Get all contacts
  getAllContacts: (callback) => {
    db.all('SELECT * FROM contacts ORDER BY created_at DESC', callback);
  },

  // Get contact by ID
  getContactById: (id, callback) => {
    db.get('SELECT * FROM contacts WHERE id = ?', [id], callback);
  },

  // Create new contact
  createContact: (contact, callback) => {
    const { name, email, phone, message } = contact;
    db.run(
      'INSERT INTO contacts (name, email, phone, message) VALUES (?, ?, ?, ?)',
      [name, email, phone, message || ''],
      function(err) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, { id: this.lastID, ...contact });
        }
      }
    );
  },

  // Update contact status
  updateContactStatus: (id, status, callback) => {
    db.run(
      'UPDATE contacts SET status = ?, updated_at = datetime(\'now\') WHERE id = ?',
      [status, id],
      function(err) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, { id, status, changes: this.changes });
        }
      }
    );
  },

  // Delete contact
  deleteContact: (id, callback) => {
    db.run('DELETE FROM contacts WHERE id = ?', [id], function(err) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, { id, deleted: this.changes > 0 });
      }
    });
  },

  // Get statistics
  getStats: (callback) => {
    db.get(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) as new_count,
        SUM(CASE WHEN status = 'read' THEN 1 ELSE 0 END) as read_count,
        SUM(CASE WHEN status = 'replied' THEN 1 ELSE 0 END) as replied_count
      FROM contacts
    `, callback);
  },

  // Gallery functions
  getAllGalleryImages: (callback) => {
    db.all('SELECT * FROM gallery ORDER BY created_at DESC', callback);
  },

  getGalleryImageById: (id, callback) => {
    db.get('SELECT * FROM gallery WHERE id = ?', [id], callback);
  },

  createGalleryImage: (image, callback) => {
    const { title, url, category, description, file_path, file_size, mime_type } = image;
    db.run(
      'INSERT INTO gallery (title, url, category, description, file_path, file_size, mime_type) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title || null, url, category || 'Khác', description || null, file_path || null, file_size || null, mime_type || null],
      function(err) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, { id: this.lastID, ...image });
        }
      }
    );
  },

  updateGalleryImage: (id, image, callback) => {
    const { title, category, description, url, file_path, file_size, mime_type } = image;
    
    // Build dynamic update query based on provided fields
    const updates = [];
    const values = [];
    
    if (title !== undefined) {
      updates.push('title = ?');
      values.push(title);
    }
    if (category !== undefined) {
      updates.push('category = ?');
      values.push(category);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      values.push(description);
    }
    if (url !== undefined) {
      updates.push('url = ?');
      values.push(url);
    }
    if (file_path !== undefined) {
      updates.push('file_path = ?');
      values.push(file_path);
    }
    if (file_size !== undefined) {
      updates.push('file_size = ?');
      values.push(file_size);
    }
    if (mime_type !== undefined) {
      updates.push('mime_type = ?');
      values.push(mime_type);
    }
    
    if (updates.length === 0) {
      callback(new Error('No fields to update'), null);
      return;
    }
    
    updates.push('updated_at = datetime(\'now\')');
    values.push(id);
    
    db.run(
      `UPDATE gallery SET ${updates.join(', ')} WHERE id = ?`,
      values,
      function(err) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, { id, changes: this.changes });
        }
      }
    );
  },

  deleteGalleryImage: (id, callback) => {
    db.get('SELECT file_path FROM gallery WHERE id = ?', [id], (err, row) => {
      if (err) {
        callback(err, null);
        return;
      }
      
      db.run('DELETE FROM gallery WHERE id = ?', [id], function(deleteErr) {
        if (deleteErr) {
          callback(deleteErr, null);
        } else {
          callback(null, { id, deleted: this.changes > 0, file_path: row ? row.file_path : null });
        }
      });
    });
  },

  // Newsletter functions
  subscribeNewsletter: (subscriber, callback) => {
    const { email, name, source } = subscriber;
    db.run(
      'INSERT OR IGNORE INTO newsletter (email, name, source) VALUES (?, ?, ?)',
      [email, name || null, source || 'website'],
      function(err) {
        if (err) {
          callback(err, null);
        } else if (this.changes === 0) {
          // Email already exists
          callback(new Error('Email already subscribed'), null);
        } else {
          callback(null, { id: this.lastID, email, name, subscribed: true });
        }
      }
    );
  },

  unsubscribeNewsletter: (email, callback) => {
    db.run(
      'UPDATE newsletter SET status = ?, unsubscribed_at = datetime(\'now\') WHERE email = ?',
      ['unsubscribed', email],
      function(err) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, { email, unsubscribed: this.changes > 0 });
        }
      }
    );
  },

  getAllNewsletterSubscribers: (callback) => {
    db.all('SELECT * FROM newsletter WHERE status = ? ORDER BY subscribed_at DESC', ['active'], callback);
  },

  // Events registration functions
  registerEvent: (registration, callback) => {
    const { eventId, name, email, phone } = registration;
    console.log('registerEvent called with:', { eventId, name, email, phone });
    db.run(
      'INSERT INTO events (event_id, name, email, phone) VALUES (?, ?, ?, ?)',
      [eventId, name, email, phone],
      function(err) {
        if (err) {
          console.error('Database error in registerEvent:', err);
          callback(err, null);
        } else {
          console.log('Event registration inserted with ID:', this.lastID);
          callback(null, { id: this.lastID, eventId, name, email, phone });
        }
      }
    );
  },

  getEventRegistrations: (eventId, callback) => {
    db.all('SELECT * FROM events WHERE event_id = ? ORDER BY registered_at DESC', [eventId], callback);
  },

  getAllEventRegistrations: (callback) => {
    db.all('SELECT * FROM events ORDER BY registered_at DESC', callback);
  },

  // Event details functions (CRUD)
  createEvent: (eventData, callback) => {
    const { title, description, date, time, location, type, status, image, agenda, speakers, capacity } = eventData;
    const agendaJson = Array.isArray(agenda) ? JSON.stringify(agenda) : agenda || '[]';
    const speakersJson = Array.isArray(speakers) ? JSON.stringify(speakers) : speakers || '[]';
    
    db.run(
      `INSERT INTO event_details (title, description, date, time, location, type, status, image, agenda, speakers, capacity) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, date, time, location, type || 'Hội thảo', status || 'upcoming', image, agendaJson, speakersJson, capacity || 50],
      function(err) {
        if (err) {
          callback(err, null);
        } else {
          const eventId = this.lastID;
          db.get('SELECT * FROM event_details WHERE id = ?', [eventId], (err, event) => {
            if (err) {
              callback(err, null);
            } else {
              // Parse JSON fields
              if (event.agenda) {
                try {
                  event.agenda = JSON.parse(event.agenda);
                } catch (e) {
                  event.agenda = [];
                }
              } else {
                event.agenda = [];
              }
              if (event.speakers) {
                try {
                  event.speakers = JSON.parse(event.speakers);
                } catch (e) {
                  event.speakers = [];
                }
              } else {
                event.speakers = [];
              }
              // Get registered count
              db.get('SELECT COUNT(*) as count FROM events WHERE event_id = ?', [eventId], (err, result) => {
                if (!err && result) event.registered = result.count || 0;
                else event.registered = 0;
                callback(null, event);
              });
            }
          });
        }
      }
    );
  },

  getAllEvents: (callback) => {
    db.all('SELECT * FROM event_details ORDER BY date DESC, created_at DESC', (err, events) => {
      if (err) {
        callback(err, null);
        return;
      }
      
      if (!events || events.length === 0) {
        callback(null, []);
        return;
      }

      // Parse JSON fields and get registered count for each event
      const processedEvents = events.map((event) => {
        if (event.agenda) {
          try {
            event.agenda = JSON.parse(event.agenda);
          } catch (e) {
            event.agenda = [];
          }
        } else {
          event.agenda = [];
        }
        if (event.speakers) {
          try {
            event.speakers = JSON.parse(event.speakers);
          } catch (e) {
            event.speakers = [];
          }
        } else {
          event.speakers = [];
        }
        return event;
      });

      // Get registered count for all events
      const promises = processedEvents.map((event) => {
        return new Promise((resolve) => {
          db.get('SELECT COUNT(*) as count FROM events WHERE event_id = ?', [event.id], (err, result) => {
            if (!err && result) {
              event.registered = result.count || 0;
            } else {
              event.registered = 0;
            }
            resolve(event);
          });
        });
      });

      Promise.all(promises).then(processed => {
        callback(null, processed);
      }).catch(err => {
        callback(err, null);
      });
    });
  },

  getEventById: (id, callback) => {
    db.get('SELECT * FROM event_details WHERE id = ?', [id], (err, event) => {
      if (err) {
        callback(err, null);
      } else if (!event) {
        callback(new Error('Event not found'), null);
      } else {
        // Parse JSON fields
        if (event.agenda) {
          try {
            event.agenda = JSON.parse(event.agenda);
          } catch (e) {
            event.agenda = [];
          }
        } else {
          event.agenda = [];
        }
        if (event.speakers) {
          try {
            event.speakers = JSON.parse(event.speakers);
          } catch (e) {
            event.speakers = [];
          }
        } else {
          event.speakers = [];
        }
        
        // Get registered count
        db.get('SELECT COUNT(*) as count FROM events WHERE event_id = ?', [id], (err, result) => {
          if (!err) event.registered = result ? (result.count || 0) : 0;
          callback(null, event);
        });
      }
    });
  },

  updateEvent: (id, eventData, callback) => {
    const { title, description, date, time, location, type, status, image, agenda, speakers, capacity } = eventData;
    const agendaJson = Array.isArray(agenda) ? JSON.stringify(agenda) : agenda || '[]';
    const speakersJson = Array.isArray(speakers) ? JSON.stringify(speakers) : speakers || '[]';
    
    db.run(
      `UPDATE event_details 
       SET title = ?, description = ?, date = ?, time = ?, location = ?, type = ?, status = ?, image = ?, agenda = ?, speakers = ?, capacity = ?, updated_at = datetime(\'now\')
       WHERE id = ?`,
      [title, description, date, time, location, type, status, image, agendaJson, speakersJson, capacity, id],
      function(err) {
        if (err) {
          callback(err, null);
        } else {
          dbHelpers.getEventById(id, callback);
        }
      }
    );
  },

  deleteEvent: (id, callback) => {
    db.run('DELETE FROM event_details WHERE id = ?', [id], function(err) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, { deleted: this.changes > 0 });
      }
    });
  },

  // Recruitment application functions
  createRecruitmentApplication: (application, callback) => {
    const { name, email, phone, position, experience, message, cv_file_path, cv_file_name } = application;
    db.run(
      'INSERT INTO recruitment (name, email, phone, position, experience, message, cv_file_path, cv_file_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, email, phone, position, experience || null, message || null, cv_file_path || null, cv_file_name || null],
      function(err) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, { id: this.lastID, ...application });
        }
      }
    );
  },

  getAllRecruitmentApplications: (callback) => {
    db.all('SELECT * FROM recruitment ORDER BY applied_at DESC', callback);
  },

  getRecruitmentApplicationById: (id, callback) => {
    db.get('SELECT * FROM recruitment WHERE id = ?', [id], callback);
  },

  updateRecruitmentStatus: (id, status, callback) => {
    db.run(
      'UPDATE recruitment SET status = ? WHERE id = ?',
      [status, id],
      function(err) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, { id, status, changes: this.changes });
        }
      }
    );
  },

  // Resource download functions
  recordResourceDownload: (download, callback) => {
    const { email, resource_id, resource_title } = download;
    db.run(
      'INSERT INTO resources_downloads (email, resource_id, resource_title) VALUES (?, ?, ?)',
      [email, resource_id, resource_title || null],
      function(err) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, { id: this.lastID, ...download });
        }
      }
    );
  },

  getResourceDownloads: (callback) => {
    db.all('SELECT * FROM resources_downloads ORDER BY downloaded_at DESC', callback);
  },

  // Consultation functions
  registerConsultation: (consultation, callback) => {
    const { name, phone, email, currentGrade, interestedMajor, interestedCity, budget, topikLevel, message, triggerSource } = consultation;
    db.run(
      'INSERT INTO consultation (name, phone, email, current_grade, interested_major, interested_city, budget, topik_level, message, trigger_source) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, phone, email, currentGrade || null, interestedMajor || null, interestedCity || null, budget || null, topikLevel || null, message || null, triggerSource || 'general'],
      function(err) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, { id: this.lastID, ...consultation });
        }
      }
    );
  },

  getAllConsultations: (callback) => {
    db.all('SELECT * FROM consultation ORDER BY submitted_at DESC', callback);
  },

  // Consultation booking functions
  bookConsultation: (booking, callback) => {
    const { name, phone, email, date, time, formattedDate, preferredMethod, notes } = booking;
    db.run(
      'INSERT INTO consultation_booking (name, phone, email, date, time, formatted_date, preferred_method, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, phone, email, date, time, formattedDate, preferredMethod || 'zoom', notes || ''],
      function(err) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, { id: this.lastID, ...booking });
        }
      }
    );
  },

  getAllBookings: (callback) => {
    db.all('SELECT * FROM consultation_booking ORDER BY date DESC, time DESC', callback);
  },

  // Visits tracking functions
  logVisit: (visit, callback) => {
    const { ipAddress, userAgent, pagePath, referrer, country, city, deviceType, browser, os } = visit;
    db.run(
      // Use datetime('now') to get UTC time instead of server local time
      'INSERT INTO visits (ip_address, user_agent, page_path, referrer, country, city, device_type, browser, os, visited_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime("now"))',
      [ipAddress || null, userAgent || null, pagePath || null, referrer || null, country || null, city || null, deviceType || null, browser || null, os || null],
      function(err) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, { id: this.lastID, ...visit });
        }
      }
    );
  },

  getAllVisits: (callback) => {
    db.all('SELECT * FROM visits ORDER BY visited_at DESC LIMIT 1000', callback);
  },

  getVisitsByDate: (startDate, endDate, callback) => {
    db.all(
      'SELECT * FROM visits WHERE visited_at >= ? AND visited_at <= ? ORDER BY visited_at DESC',
      [startDate, endDate],
      callback
    );
  },

  getVisitStats: (callback) => {
    db.all(`
      SELECT 
        COUNT(*) as total_visits,
        COUNT(DISTINCT ip_address) as unique_visitors,
        COUNT(DISTINCT DATE(visited_at)) as unique_days,
        page_path,
        COUNT(*) as page_views
      FROM visits
      WHERE visited_at >= datetime('now', '-30 days')
      GROUP BY page_path
      ORDER BY page_views DESC
      LIMIT 20
    `, callback);
  },

  // Community functions
  createPost: (post, callback) => {
    const { author_name, author_email, title, content, category, tags, type } = post;
    const tagsStr = Array.isArray(tags) ? tags.join(',') : tags || '';
    db.run(
      'INSERT INTO community_posts (author_name, author_email, title, content, category, tags, type) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [author_name, author_email || null, title, content, category || 'Tất cả', tagsStr, type || 'discussion'],
      function(err) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, { id: this.lastID, ...post, tags: tagsStr });
        }
      }
    );
  },

  getAllPosts: (filters, callback) => {
    let query = 'SELECT * FROM community_posts WHERE 1=1';
    const params = [];
    
    if (filters?.author_email) {
      query += ' AND author_email = ?';
      params.push(filters.author_email);
    }
    
    if (filters?.category && filters.category !== 'Tất cả') {
      query += ' AND category = ?';
      params.push(filters.category);
    }
    
    if (filters?.type) {
      query += ' AND type = ?';
      params.push(filters.type);
    }
    
    // Sorting
    if (filters?.sort === 'likes') {
      query += ' ORDER BY likes_count DESC, created_at DESC';
    } else if (filters?.sort === 'comments') {
      query += ' ORDER BY comments_count DESC, created_at DESC';
    } else if (filters?.sort === 'views') {
      query += ' ORDER BY views_count DESC, created_at DESC';
    } else {
      query += ' ORDER BY created_at DESC';
    }
    
    if (filters?.limit) {
      query += ' LIMIT ?';
      params.push(filters.limit);
      
      if (filters?.offset) {
        query += ' OFFSET ?';
        params.push(filters.offset);
      }
    }
    
    db.all(query, params, callback);
  },

  getPostById: (id, callback) => {
    db.get('SELECT * FROM community_posts WHERE id = ?', [id], callback);
  },

  updatePostViews: (id, callback) => {
    db.run('UPDATE community_posts SET views_count = views_count + 1 WHERE id = ?', [id], function(err) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, { id, changes: this.changes });
      }
    });
  },

  addComment: (comment, callback) => {
    const { post_id, author_name, author_email, content } = comment;
    db.run(
      'INSERT INTO community_comments (post_id, author_name, author_email, content) VALUES (?, ?, ?, ?)',
      [post_id, author_name, author_email || null, content],
      function(err) {
        if (err) {
          callback(err, null);
        } else {
          // Update comments count
          db.run('UPDATE community_posts SET comments_count = comments_count + 1 WHERE id = ?', [post_id]);
          callback(null, { id: this.lastID, ...comment });
        }
      }
    );
  },

  getCommentsByPostId: (post_id, callback) => {
    db.all('SELECT * FROM community_comments WHERE post_id = ? ORDER BY created_at ASC', [post_id], callback);
  },

  toggleLike: (like, callback) => {
    const { post_id, comment_id, user_email } = like;
    
    // Check if like exists
    db.get(
      'SELECT * FROM community_likes WHERE post_id = ? AND comment_id = ? AND user_email = ?',
      [post_id || null, comment_id || null, user_email],
      (err, existing) => {
        if (err) {
          callback(err, null);
          return;
        }
        
        if (existing) {
          // Unlike
          db.run(
            'DELETE FROM community_likes WHERE id = ?',
            [existing.id],
            function(deleteErr) {
              if (deleteErr) {
                callback(deleteErr, null);
              } else {
                // Update likes count
                if (post_id) {
                  db.run('UPDATE community_posts SET likes_count = likes_count - 1 WHERE id = ?', [post_id]);
                } else if (comment_id) {
                  db.run('UPDATE community_comments SET likes_count = likes_count - 1 WHERE id = ?', [comment_id]);
                }
                callback(null, { liked: false, id: existing.id });
              }
            }
          );
        } else {
          // Like
          db.run(
            'INSERT INTO community_likes (post_id, comment_id, user_email) VALUES (?, ?, ?)',
            [post_id || null, comment_id || null, user_email],
            function(insertErr) {
              if (insertErr) {
                callback(insertErr, null);
              } else {
                // Update likes count
                if (post_id) {
                  db.run('UPDATE community_posts SET likes_count = likes_count + 1 WHERE id = ?', [post_id]);
                } else if (comment_id) {
                  db.run('UPDATE community_comments SET likes_count = likes_count + 1 WHERE id = ?', [comment_id]);
                }
                callback(null, { liked: true, id: this.lastID });
              }
            }
          );
        }
      }
    );
  },

  checkUserLiked: (post_id, comment_id, user_email, callback) => {
    db.get(
      'SELECT * FROM community_likes WHERE post_id = ? AND comment_id = ? AND user_email = ?',
      [post_id || null, comment_id || null, user_email],
      callback
    );
  },

  // Admin functions
  deletePost: (id, callback) => {
    db.run('DELETE FROM community_posts WHERE id = ?', [id], function(err) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, { id, deleted: this.changes > 0 });
      }
    });
  },

  toggleFeaturedPost: (id, callback) => {
    db.run(
      'UPDATE community_posts SET is_featured = CASE WHEN is_featured = 1 THEN 0 ELSE 1 END WHERE id = ?',
      [id],
      function(err) {
        if (err) {
          callback(err, null);
        } else {
          db.get('SELECT * FROM community_posts WHERE id = ?', [id], (err, post) => {
            if (err) {
              callback(err, null);
            } else {
              callback(null, post);
            }
          });
        }
      }
    );
  },

  // Rewards functions
  getAllRewards: (callback) => {
    db.all('SELECT * FROM rewards WHERE is_active = 1 ORDER BY points_required ASC', callback);
  },

  getRewardById: (id, callback) => {
    db.get('SELECT * FROM rewards WHERE id = ? AND is_active = 1', [id], callback);
  },

  createRedemption: (redemption, callback) => {
    const { user_email, reward_id, points_used, redemption_code } = redemption;
    db.run(
      'INSERT INTO redemptions (user_email, reward_id, points_used, redemption_code, status) VALUES (?, ?, ?, ?, ?)',
      [user_email, reward_id, points_used, redemption_code || null, 'pending'],
      function(err) {
        if (err) {
          callback(err, null);
        } else {
          db.get('SELECT * FROM redemptions WHERE id = ?', [this.lastID], (err, redemption) => {
            if (err) {
              callback(err, null);
            } else {
              callback(null, redemption);
            }
          });
        }
      }
    );
  },

  getUserRedemptions: (user_email, callback) => {
    db.all(
      `SELECT r.*, 
              COALESCE(rw.name, 'Unknown Reward') as reward_name, 
              rw.description as reward_description, 
              rw.category, 
              rw.type
       FROM redemptions r
       LEFT JOIN rewards rw ON r.reward_id = rw.id
       WHERE r.user_email = ?
       ORDER BY r.created_at DESC`,
      [user_email],
      (err, rows) => {
        if (err) {
          callback(err, null);
        } else {
          callback(null, rows || []);
        }
      }
    );
  },

  updateRedemptionStatus: (id, status, callback) => {
    db.run(
      'UPDATE redemptions SET status = ?, updated_at = datetime(\'now\') WHERE id = ?',
      [status, id],
      function(err) {
        if (err) {
          callback(err, null);
        } else {
          db.get('SELECT * FROM redemptions WHERE id = ?', [id], callback);
        }
      }
    );
  },

  // User points functions for leaderboard
  upsertUserPoints: (userData, callback) => {
    const { user_email, user_name, points, level } = userData;
    db.run(
      `INSERT INTO user_points (user_email, user_name, points, level, last_updated)
       VALUES (?, ?, ?, ?, datetime('now'))
       ON CONFLICT(user_email) DO UPDATE SET
         points = ?,
         level = ?,
         last_updated = datetime('now'),
         user_name = COALESCE(?, user_name)`,
      [user_email, user_name || null, points, level, points, level, user_name || null],
      function(err) {
        if (err) {
          callback(err, null);
        } else {
          db.get('SELECT * FROM user_points WHERE user_email = ?', [user_email], callback);
        }
      }
    );
  },

  getUserPoints: (user_email, callback) => {
    db.get('SELECT * FROM user_points WHERE user_email = ?', [user_email], callback);
  },

  syncUserPoints: (user_email, user_name, points, level, callback) => {
    db.run(
      `INSERT INTO user_points (user_email, user_name, points, level, last_updated)
       VALUES (?, ?, ?, ?, datetime('now'))
       ON CONFLICT(user_email) DO UPDATE SET
         points = ?,
         level = ?,
         last_updated = datetime('now'),
         user_name = COALESCE(?, user_name)`,
      [user_email, user_name || null, points, level, points, level, user_name || null],
      function(err) {
        if (err) {
          callback(err, null);
        } else {
          db.get('SELECT * FROM user_points WHERE user_email = ?', [user_email], callback);
        }
      }
    );
  },

  getLeaderboard: (limit = 10, callback) => {
    // SQLite doesn't support ROW_NUMBER() in older versions, use subquery instead
    // Show all users, even with 0 points
    // Fixed ranking: rank = number of users with higher points + 1
    db.all(
      `SELECT 
        user_email,
        COALESCE(user_name, SUBSTR(user_email, 1, INSTR(user_email, '@') - 1)) as display_name,
        points,
        level,
        (SELECT COUNT(*) 
         FROM user_points up2 
         WHERE up2.points > up1.points 
         OR (up2.points = up1.points AND up2.created_at < up1.created_at)) + 1 as rank
       FROM user_points up1
       ORDER BY points DESC, created_at ASC
       LIMIT ?`,
      [limit],
      (err, rows) => {
        if (err) {
          console.error('Error in getLeaderboard:', err);
          callback(err, null);
        } else {
          console.log(`📊 getLeaderboard returned ${rows?.length || 0} users`);
          callback(null, rows);
        }
      }
    );
  },

  getUserRank: (user_email, callback) => {
    db.get(
      `SELECT 
        (SELECT COUNT(*) + 1 
         FROM user_points up2 
         WHERE up2.points > up1.points 
         OR (up2.points = up1.points AND up2.created_at < up1.created_at)) as rank,
        (SELECT COUNT(*) FROM user_points) as total_users
       FROM user_points up1
       WHERE up1.user_email = ?`,
      [user_email],
      callback
    );
  },

  // Admin functions for user management
  getAllUsers: (callback) => {
    // Get all users from user_points table (for gamification)
    db.all(
      `SELECT 
        user_email,
        user_name,
        points,
        level,
        created_at,
        last_updated,
        (SELECT COUNT(*) 
         FROM user_points up2 
         WHERE up2.points > up1.points 
         OR (up2.points = up1.points AND up2.created_at < up1.created_at)) + 1 as rank
       FROM user_points up1
       ORDER BY points DESC, created_at ASC`,
      (err, userPointsRows) => {
        if (err) {
          callback(err, null);
          return;
        }
        
        // Also get all registered users from users table (authentication)
        db.all(
          `SELECT 
            email,
            display_name,
            email_verified,
            created_at as registered_at,
            last_login
           FROM users
           ORDER BY created_at DESC`,
          (err2, authUsersRows) => {
            if (err2) {
              console.error('Error fetching auth users:', err2);
              // Return user_points data even if auth users query fails
              callback(null, userPointsRows || []);
              return;
            }
            
            // Merge data: combine user_points with auth users info
            const usersMap = new Map();
            
            // Add users from user_points
            (userPointsRows || []).forEach(user => {
              usersMap.set(user.user_email, {
                user_email: user.user_email,
                user_name: user.user_name,
                display_name: user.user_name,
                points: user.points || 0,
                level: user.level || 1,
                rank: user.rank,
                created_at: user.created_at,
                last_updated: user.last_updated,
                email_verified: null,
                registered_at: user.created_at,
                last_login: null
              });
            });
            
            // Add/update with auth users info
            (authUsersRows || []).forEach(authUser => {
              const existing = usersMap.get(authUser.email);
              if (existing) {
                // Update existing user
                existing.display_name = authUser.display_name || existing.display_name;
                existing.email_verified = authUser.email_verified === 1;
                existing.registered_at = authUser.registered_at || existing.registered_at;
                existing.last_login = authUser.last_login;
              } else {
                // New user from auth table (not in user_points yet)
                usersMap.set(authUser.email, {
                  user_email: authUser.email,
                  user_name: authUser.display_name || authUser.email.split('@')[0],
                  display_name: authUser.display_name || authUser.email.split('@')[0],
                  points: 0,
                  level: 1,
                  rank: null,
                  created_at: authUser.registered_at,
                  last_updated: authUser.registered_at,
                  email_verified: authUser.email_verified === 1,
                  registered_at: authUser.registered_at,
                  last_login: authUser.last_login
                });
              }
            });
            
            // Convert map to array and sort by registered_at (newest first)
            const allUsers = Array.from(usersMap.values()).sort((a, b) => {
              const dateA = new Date(a.registered_at || a.created_at || 0);
              const dateB = new Date(b.registered_at || b.created_at || 0);
              return dateB - dateA;
            });
            
            callback(null, allUsers);
          }
        );
      }
    );
  },

  updateUserPoints: (user_email, points, level, callback) => {
    db.run(
      `UPDATE user_points 
       SET points = ?, level = ?, last_updated = datetime('now')
       WHERE user_email = ?`,
      [points, level, user_email],
      function(err) {
        if (err) {
          callback(err, null);
        } else {
          // Get updated user with rank
          db.get(
            `SELECT 
              user_email,
              user_name,
              points,
              level,
              created_at,
              last_updated,
              (SELECT COUNT(*) 
               FROM user_points up2 
               WHERE up2.points > up1.points 
               OR (up2.points = up1.points AND up2.created_at < up1.created_at)) + 1 as rank
             FROM user_points up1
             WHERE up1.user_email = ?`,
            [user_email],
            callback
          );
        }
      }
    );
  },

  deleteUser: (user_email, callback) => {
    db.run('DELETE FROM user_points WHERE user_email = ?', [user_email], function(err) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, { deleted: this.changes > 0 });
      }
    });
  },

  // Social Features: Follow system
  followUser: (followerEmail, followingEmail, callback) => {
    db.run(
      `INSERT OR IGNORE INTO user_follows (follower_email, following_email) VALUES (?, ?)`,
      [followerEmail, followingEmail],
      function(err) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, { success: true, changes: this.changes });
        }
      }
    );
  },

  unfollowUser: (followerEmail, followingEmail, callback) => {
    db.run(
      `DELETE FROM user_follows WHERE follower_email = ? AND following_email = ?`,
      [followerEmail, followingEmail],
      function(err) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, { success: true, changes: this.changes });
        }
      }
    );
  },

  getFollowers: (userEmail, callback) => {
    db.all(
      `SELECT 
        uf.follower_email as email, 
        uf.created_at,
        COALESCE(up.display_name, u.display_name, NULL) as name
      FROM user_follows uf
      LEFT JOIN user_profiles up ON uf.follower_email = up.email
      LEFT JOIN users u ON uf.follower_email = u.email
      WHERE uf.following_email = ? 
      ORDER BY uf.created_at DESC`,
      [userEmail],
      callback
    );
  },

  getFollowing: (userEmail, callback) => {
    db.all(
      `SELECT 
        uf.following_email as email, 
        uf.created_at,
        COALESCE(up.display_name, u.display_name, NULL) as name
      FROM user_follows uf
      LEFT JOIN user_profiles up ON uf.following_email = up.email
      LEFT JOIN users u ON uf.following_email = u.email
      WHERE uf.follower_email = ? 
      ORDER BY uf.created_at DESC`,
      [userEmail],
      callback
    );
  },

  checkFollowStatus: (followerEmail, followingEmail, callback) => {
    db.get(
      `SELECT * FROM user_follows WHERE follower_email = ? AND following_email = ?`,
      [followerEmail, followingEmail],
      callback
    );
  },

  getFollowCounts: (userEmail, callback) => {
    db.get(
      `SELECT 
        (SELECT COUNT(*) FROM user_follows WHERE following_email = ?) as followers_count,
        (SELECT COUNT(*) FROM user_follows WHERE follower_email = ?) as following_count`,
      [userEmail, userEmail],
      callback
    );
  },

  // Social Features: User Profiles
  upsertUserProfile: (profileData, callback) => {
    const { email, display_name, bio, avatar_url, location, interests, social_links } = profileData;
    db.run(
      `INSERT INTO user_profiles (email, display_name, bio, avatar_url, location, interests, social_links, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
       ON CONFLICT(email) DO UPDATE SET
         display_name = COALESCE(?, display_name),
         bio = COALESCE(?, bio),
         avatar_url = COALESCE(?, avatar_url),
         location = COALESCE(?, location),
         interests = COALESCE(?, interests),
         social_links = COALESCE(?, social_links),
         updated_at = datetime('now')`,
      [email, display_name, bio, avatar_url, location, interests, social_links,
       display_name, bio, avatar_url, location, interests, social_links],
      function(err) {
        if (err) {
          callback(err, null);
        } else {
          db.get('SELECT * FROM user_profiles WHERE email = ?', [email], callback);
        }
      }
    );
  },

  getUserProfile: (email, callback) => {
    db.get('SELECT * FROM user_profiles WHERE email = ?', [email], callback);
  },

  // Social Features: Reactions (extended from likes)
  addReaction: (reactionData, callback) => {
    const { post_id, comment_id, user_email, reaction_type } = reactionData;
    db.run(
      `INSERT OR REPLACE INTO community_reactions (post_id, comment_id, user_email, reaction_type)
       VALUES (?, ?, ?, ?)`,
      [post_id || null, comment_id || null, user_email, reaction_type || 'like'],
      function(err) {
        if (err) {
          callback(err, null);
        } else {
          // Update reaction counts
          if (post_id) {
            db.run(`UPDATE community_posts SET likes_count = (
              SELECT COUNT(*) FROM community_reactions WHERE post_id = ? AND reaction_type = 'like'
            ) WHERE id = ?`, [post_id, post_id]);
          }
          if (comment_id) {
            db.run(`UPDATE community_comments SET likes_count = (
              SELECT COUNT(*) FROM community_reactions WHERE comment_id = ? AND reaction_type = 'like'
            ) WHERE id = ?`, [comment_id, comment_id]);
          }
          callback(null, { success: true, id: this.lastID });
        }
      }
    );
  },

  removeReaction: (reactionData, callback) => {
    const { post_id, comment_id, user_email, reaction_type } = reactionData;
    db.run(
      `DELETE FROM community_reactions 
       WHERE post_id = ? AND comment_id = ? AND user_email = ? AND reaction_type = ?`,
      [post_id || null, comment_id || null, user_email, reaction_type || 'like'],
      function(err) {
        if (err) {
          callback(err, null);
        } else {
          // Update reaction counts
          if (post_id) {
            db.run(`UPDATE community_posts SET likes_count = (
              SELECT COUNT(*) FROM community_reactions WHERE post_id = ? AND reaction_type = 'like'
            ) WHERE id = ?`, [post_id, post_id]);
          }
          if (comment_id) {
            db.run(`UPDATE community_comments SET likes_count = (
              SELECT COUNT(*) FROM community_reactions WHERE comment_id = ? AND reaction_type = 'like'
            ) WHERE id = ?`, [comment_id, comment_id]);
          }
          callback(null, { success: true, changes: this.changes });
        }
      }
    );
  },

  getReactions: (post_id, comment_id, callback) => {
    const query = post_id 
      ? `SELECT reaction_type, COUNT(*) as count FROM community_reactions WHERE post_id = ? GROUP BY reaction_type`
      : `SELECT reaction_type, COUNT(*) as count FROM community_reactions WHERE comment_id = ? GROUP BY reaction_type`;
    db.all(query, [post_id || comment_id], callback);
  },

  getUserReaction: (post_id, comment_id, user_email, callback) => {
    db.get(
      `SELECT * FROM community_reactions 
       WHERE post_id = ? AND comment_id = ? AND user_email = ?`,
      [post_id || null, comment_id || null, user_email],
      callback
    );
  },

  // Social Features: Mentions
  addMention: (mentionData, callback) => {
    const { post_id, comment_id, mentioned_email, mentioned_by_email } = mentionData;
    db.run(
      `INSERT INTO community_mentions (post_id, comment_id, mentioned_email, mentioned_by_email)
       VALUES (?, ?, ?, ?)`,
      [post_id || null, comment_id || null, mentioned_email, mentioned_by_email],
      function(err) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, { success: true, id: this.lastID });
        }
      }
    );
  },

  getMentions: (userEmail, callback) => {
    db.all(
      `SELECT m.*, 
              p.title as post_title,
              c.content as comment_content,
              p.id as post_id
       FROM community_mentions m
       LEFT JOIN community_posts p ON m.post_id = p.id
       LEFT JOIN community_comments c ON m.comment_id = c.id
       WHERE m.mentioned_email = ?
       ORDER BY m.created_at DESC
       LIMIT 50`,
      [userEmail],
      callback
    );
  },

  markMentionAsRead: (mentionId, callback) => {
    db.run(
      `UPDATE community_mentions SET read = 1 WHERE id = ?`,
      [mentionId],
      function(err) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, { success: true, changes: this.changes });
        }
      }
    );
  },

  getUnreadMentionsCount: (userEmail, callback) => {
    db.get(
      `SELECT COUNT(*) as count FROM community_mentions WHERE mentioned_email = ? AND read = 0`,
      [userEmail],
      callback
    );
  },

  // AI-Powered Matching: Questionnaires
  upsertQuestionnaire: (questionnaireData, callback) => {
    const { user_email, major, budget_range, location_preference, language_level, 
            scholarship_priority, university_type, duration_preference, 
            accommodation_preference, career_goals } = questionnaireData;
    
    db.run(
      `INSERT INTO matching_questionnaires 
       (user_email, major, budget_range, location_preference, language_level, 
        scholarship_priority, university_type, duration_preference, 
        accommodation_preference, career_goals, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
       ON CONFLICT(user_email) DO UPDATE SET
         major = COALESCE(?, major),
         budget_range = COALESCE(?, budget_range),
         location_preference = COALESCE(?, location_preference),
         language_level = COALESCE(?, language_level),
         scholarship_priority = COALESCE(?, scholarship_priority),
         university_type = COALESCE(?, university_type),
         duration_preference = COALESCE(?, duration_preference),
         accommodation_preference = COALESCE(?, accommodation_preference),
         career_goals = COALESCE(?, career_goals),
         updated_at = datetime('now')`,
      [user_email, major, budget_range, location_preference, language_level,
       scholarship_priority, university_type, duration_preference,
       accommodation_preference, career_goals,
       major, budget_range, location_preference, language_level,
       scholarship_priority, university_type, duration_preference,
       accommodation_preference, career_goals],
      function(err) {
        if (err) {
          callback(err, null);
        } else {
          db.get('SELECT * FROM matching_questionnaires WHERE user_email = ?', [user_email], callback);
        }
      }
    );
  },

  getQuestionnaire: (userEmail, callback) => {
    db.get('SELECT * FROM matching_questionnaires WHERE user_email = ?', [userEmail], callback);
  },

  saveMatchingResults: (results, callback) => {
    const { user_email, school_name, match_score, match_reasons } = results;
    db.run(
      `INSERT INTO matching_results (user_email, school_name, match_score, match_reasons)
       VALUES (?, ?, ?, ?)`,
      [user_email, school_name, match_score, match_reasons],
      function(err) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, { success: true, id: this.lastID });
        }
      }
    );
  },

  getMatchingResults: (userEmail, limit = 10, callback) => {
    db.all(
      `SELECT * FROM matching_results 
       WHERE user_email = ? 
       ORDER BY match_score DESC, created_at DESC 
       LIMIT ?`,
      [userEmail, limit],
      callback
    );
  },

  // Video Call Integration: Bookings
  createVideoCallBooking: (bookingData, callback) => {
    const { user_email, user_name, call_type, platform, meeting_url, meeting_id,
            meeting_password, scheduled_time, duration, timezone, notes } = bookingData;
    
    db.run(
      `INSERT INTO video_call_bookings 
       (user_email, user_name, call_type, platform, meeting_url, meeting_id,
        meeting_password, scheduled_time, duration, timezone, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [user_email, user_name, call_type, platform, meeting_url, meeting_id,
       meeting_password, scheduled_time, duration, timezone, notes],
      function(err) {
        if (err) {
          callback(err, null);
        } else {
          db.get('SELECT * FROM video_call_bookings WHERE id = ?', [this.lastID], callback);
        }
      }
    );
  },

  getVideoCallBookings: (userEmail, callback) => {
    db.all(
      `SELECT * FROM video_call_bookings 
       WHERE user_email = ? 
       ORDER BY scheduled_time DESC`,
      [userEmail],
      callback
    );
  },

  updateVideoCallBooking: (bookingId, updates, callback) => {
    const allowedFields = ['status', 'meeting_url', 'meeting_id', 'meeting_password', 'notes', 'scheduled_time'];
    const updatesList = [];
    const values = [];
    
    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        updatesList.push(`${key} = ?`);
        values.push(value);
      }
    }
    
    if (updatesList.length === 0) {
      callback(new Error('No valid fields to update'), null);
      return;
    }
    
    updatesList.push('updated_at = datetime(\'now\')');
    values.push(bookingId);
    
    db.run(
      `UPDATE video_call_bookings SET ${updatesList.join(', ')} WHERE id = ?`,
      values,
      function(err) {
        if (err) {
          callback(err, null);
        } else {
          db.get('SELECT * FROM video_call_bookings WHERE id = ?', [bookingId], callback);
        }
      }
    );
  },

  getUpcomingVideoCalls: (callback) => {
    db.all(
      `SELECT * FROM video_call_bookings 
       WHERE status = 'scheduled' 
       AND scheduled_time > datetime('now')
       ORDER BY scheduled_time ASC
       LIMIT 50`,
      callback
    );
  },

  // User authentication helpers
  getUserByEmail: (email, callback) => {
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, row);
      }
    });
  },

  createUser: (email, passwordHash, verificationToken, callback) => {
    db.run(
      'INSERT INTO users (email, password_hash, verification_token) VALUES (?, ?, ?)',
      [email, passwordHash, verificationToken],
      function(err) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, this.lastID);
        }
      }
    );
  },

  verifyUserEmail: (email, callback) => {
    db.run(
      'UPDATE users SET email_verified = 1, verification_token = NULL WHERE email = ?',
      [email],
      (err) => {
        if (err) {
          callback(err);
        } else {
          callback(null);
        }
      }
    );
  },

  updateUserLastLogin: (email, callback) => {
    db.run(
      'UPDATE users SET last_login = datetime(\'now\') WHERE email = ?',
      [email],
      (err) => {
        if (err) {
          callback(err);
        } else {
          callback(null);
        }
      }
    );
  },

  updateUserDisplayName: (email, displayName, callback) => {
    db.run(
      'UPDATE users SET display_name = ?, updated_at = datetime(\'now\') WHERE email = ?',
      [displayName, email],
      (err) => {
        if (err) {
          callback(err);
        } else {
          callback(null);
        }
      }
    );
  },

  updateUserVerificationStatus: (email, callback) => {
    db.run(
      'UPDATE users SET email_verified = 1, verification_token = NULL, updated_at = datetime(\'now\') WHERE email = ?',
      [email],
      (err) => {
        if (err) {
          callback(err);
        } else {
          callback(null);
        }
      }
    );
  },

  updateUserVerificationToken: (email, token, callback) => {
    db.run(
      'UPDATE users SET verification_token = ?, updated_at = datetime(\'now\') WHERE email = ?',
      [token, email],
      (err) => {
        if (err) {
          callback(err);
        } else {
          callback(null);
        }
      }
    );
  }
};

// Close database connection
const closeDatabase = () => {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err.message);
        reject(err);
      } else {
        console.log('Database connection closed');
        resolve();
      }
    });
  });
};

// Handle process termination
process.on('SIGINT', () => {
  closeDatabase().then(() => {
    process.exit(0);
  });
});

module.exports = { db, dbHelpers, closeDatabase };

