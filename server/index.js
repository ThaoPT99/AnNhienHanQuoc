require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS: allow deployed frontend + local dev
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://an-nhien-han-quoc.vercel.app',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (e.g. mobile apps, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('CORS not allowed for this origin'));
  },
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Simple admin auth config (set these in environment variables in production)
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'anhien123'; // nên đổi trong env
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'simple-admin-token-change-in-env';

// Admin login route
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    return res.json({ token: ADMIN_TOKEN });
  }

  return res.status(401).json({ error: 'Tài khoản hoặc mật khẩu không đúng' });
});

// Middleware bảo vệ routes admin
const requireAdmin = (req, res, next) => {
  const token = req.headers['x-admin-token'];
  if (!token || token !== ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Không có quyền truy cập' });
  }
  next();
};

// Database setup
const dbPath = path.join(__dirname, 'contacts.db');
const db = new sqlite3.Database(dbPath);

// Initialize database
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS gallery (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    category TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

// Routes
// Get all contacts (for admin)
app.get('/api/contacts', requireAdmin, (req, res) => {
  db.all('SELECT * FROM contacts ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Create new contact
app.post('/api/contacts', (req, res) => {
  const { name, email, phone, message } = req.body;
  
  if (!name || !email || !phone) {
    res.status(400).json({ error: 'Name, email, and phone are required' });
    return;
  }

  db.run(
    'INSERT INTO contacts (name, email, phone, message) VALUES (?, ?, ?, ?)',
    [name, email, phone, message || ''],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, message: 'Contact saved successfully' });
    }
  );
});

// Delete contact
app.delete('/api/contacts/:id', requireAdmin, (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM contacts WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Contact deleted successfully' });
  });
});

// Gallery routes
app.get('/api/gallery', (req, res) => {
  db.all('SELECT * FROM gallery ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/api/gallery', requireAdmin, (req, res) => {
  const { title, url, category } = req.body;
  if (!title || !url || !category) {
    return res.status(400).json({ error: 'Thiếu title, url hoặc category' });
  }

  db.run(
    'INSERT INTO gallery (title, url, category) VALUES (?, ?, ?)',
    [title, url, category],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, title, url, category });
    }
  );
});

app.put('/api/gallery/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const { title, url, category } = req.body;
  if (!title || !url || !category) {
    return res.status(400).json({ error: 'Thiếu title, url hoặc category' });
  }

  db.run(
    'UPDATE gallery SET title = ?, url = ?, category = ? WHERE id = ?',
    [title, url, category, id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id, title, url, category });
    }
  );
});

app.delete('/api/gallery/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM gallery WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Xóa ảnh thành công' });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

