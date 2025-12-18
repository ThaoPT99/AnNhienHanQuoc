const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Database configuration
const dbPath = process.env.DATABASE_PATH || path.join(__dirname, 'contacts.db');

// Ensure database directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
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
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
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
        db.run(`ALTER TABLE contacts ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP`, (alterErr) => {
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
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
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
      subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
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

    // Create events table
    db.run(`CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      registered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      status TEXT DEFAULT 'pending'
    )`, (err) => {
      if (err) {
        console.error('Error creating events table:', err.message);
      } else {
        console.log('✅ Events table ready');
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
      applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
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
      downloaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
      if (err) {
        console.error('Error creating resources_downloads table:', err.message);
      } else {
        console.log('✅ Resources downloads table ready');
      }
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
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
      if (err) {
        console.error('Error creating admins table:', err.message);
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
      'UPDATE contacts SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
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
    
    updates.push('updated_at = CURRENT_TIMESTAMP');
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
      'UPDATE newsletter SET status = ?, unsubscribed_at = CURRENT_TIMESTAMP WHERE email = ?',
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
    db.run(
      'INSERT INTO events (event_id, name, email, phone) VALUES (?, ?, ?, ?)',
      [eventId, name, email, phone],
      function(err) {
        if (err) {
          callback(err, null);
        } else {
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

