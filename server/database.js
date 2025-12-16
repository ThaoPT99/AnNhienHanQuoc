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

    db.run(`CREATE INDEX IF NOT EXISTS idx_gallery_created_at ON gallery(created_at)`, (err) => {
      if (err) {
        console.error('Error creating gallery index:', err.message);
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
    const { title, category, description } = image;
    db.run(
      'UPDATE gallery SET title = ?, category = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [title, category, description, id],
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

