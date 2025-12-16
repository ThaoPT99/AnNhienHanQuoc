require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { dbHelpers } = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware - CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'https://duhocannhien.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean); // Remove undefined values

// Log allowed origins on startup
console.log('🌐 Allowed CORS origins:', allowedOrigins);

// CORS middleware with proper preflight handling
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, Postman, etc.)
    if (!origin) {
      console.log('✅ CORS: Allowing request with no origin');
      return callback(null, true);
    }
    
    // Check if origin is in allowed list
    if (allowedOrigins.indexOf(origin) !== -1) {
      console.log('✅ CORS: Allowing origin:', origin);
      callback(null, true);
    } else {
      // Log for debugging
      console.log('❌ CORS blocked origin:', origin);
      console.log('📋 Allowed origins:', allowedOrigins);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-token', 'X-Requested-With'],
  exposedHeaders: ['Content-Type'],
  maxAge: 86400 // 24 hours
}));

// Handle preflight requests explicitly for all routes
app.options('*', (req, res) => {
  const origin = req.headers.origin;
  if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
    res.header('Access-Control-Allow-Origin', origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-token, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.sendStatus(200);
  } else {
    res.sendStatus(403);
  }
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads', 'gallery');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'gallery-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận file ảnh (jpeg, jpg, png, gif, webp)'));
    }
  }
});

// Serve static files (images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Admin authentication
// Simple admin login (using environment variables for credentials)
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;

  // Get admin credentials from environment variables or use defaults
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  if (!username || !password) {
    res.status(400).json({ error: 'Username and password are required' });
    return;
  }

  // Simple authentication (in production, use proper password hashing)
  if (username === adminUsername && password === adminPassword) {
    // Generate a simple token (in production, use JWT)
    const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');
    res.json({ 
      token,
      message: 'Login successful',
      username: username
    });
  } else {
    res.status(401).json({ error: 'Invalid username or password' });
  }
});

// Middleware to verify admin token (simple check)
const verifyAdminToken = (req, res, next) => {
  const token = req.headers['x-admin-token'];
  
  if (!token) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }

  // Simple token verification (in production, use JWT)
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [username] = decoded.split(':');
    
    // Verify username matches admin
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    if (username === adminUsername) {
      next();
    } else {
      res.status(401).json({ error: 'Invalid token' });
    }
  } catch (err) {
    res.status(401).json({ error: 'Invalid token format' });
  }
};

// Routes
// Get all contacts (for admin)
app.get('/api/contacts', (req, res) => {
  dbHelpers.getAllContacts((err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get contact by ID
app.get('/api/contacts/:id', (req, res) => {
  const id = req.params.id;
  dbHelpers.getContactById(id, (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Contact not found' });
      return;
    }
    res.json(row);
  });
});

// Get statistics
app.get('/api/contacts/stats/summary', (req, res) => {
  dbHelpers.getStats((err, stats) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(stats);
  });
});

// Create new contact
app.post('/api/contacts', (req, res) => {
  const { name, email, phone, message } = req.body;
  
  if (!name || !email || !phone) {
    res.status(400).json({ error: 'Name, email, and phone are required' });
    return;
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ error: 'Invalid email format' });
    return;
  }

  dbHelpers.createContact({ name, email, phone, message }, (err, contact) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(201).json({ id: contact.id, message: 'Contact saved successfully' });
  });
});

// Update contact status
app.patch('/api/contacts/:id/status', (req, res) => {
  const id = req.params.id;
  const { status } = req.body;
  
  const validStatuses = ['new', 'read', 'replied', 'archived'];
  if (!status || !validStatuses.includes(status)) {
    res.status(400).json({ error: 'Invalid status. Must be one of: ' + validStatuses.join(', ') });
    return;
  }

  dbHelpers.updateContactStatus(id, status, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (result.changes === 0) {
      res.status(404).json({ error: 'Contact not found' });
      return;
    }
    res.json({ message: 'Contact status updated successfully', ...result });
  });
});

// Delete contact
app.delete('/api/contacts/:id', (req, res) => {
  const id = req.params.id;
  dbHelpers.deleteContact(id, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!result.deleted) {
      res.status(404).json({ error: 'Contact not found' });
      return;
    }
    res.json({ message: 'Contact deleted successfully' });
  });
});

// Gallery Routes
// Get all gallery images
app.get('/api/gallery', (req, res) => {
  dbHelpers.getAllGalleryImages((err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows || []);
  });
});

// Get gallery image by ID
app.get('/api/gallery/:id', (req, res) => {
  const id = req.params.id;
  dbHelpers.getGalleryImageById(id, (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Image not found' });
      return;
    }
    res.json(row);
  });
});

// Upload new gallery image (supports both file upload and URL)
app.post('/api/gallery', upload.optional('image'), (req, res) => {
  const { title, category, description, url } = req.body;

  // Check if file is uploaded or URL is provided
  if (!req.file && !url) {
    res.status(400).json({ error: 'Either image file or URL must be provided' });
    return;
  }

  let imageData;

  if (req.file) {
    // Handle file upload
    const filePath = `/uploads/gallery/${req.file.filename}`;
    const fullUrl = `${req.protocol}://${req.get('host')}${filePath}`;

    imageData = {
      title: title || null,
      url: fullUrl,
      category: category || 'Khác',
      description: description || null,
      file_path: req.file.path,
      file_size: req.file.size,
      mime_type: req.file.mimetype
    };
  } else {
    // Handle URL input
    imageData = {
      title: title || null,
      url: url,
      category: category || 'Khác',
      description: description || null,
      file_path: null,
      file_size: null,
      mime_type: null
    };
  }

  dbHelpers.createGalleryImage(imageData, (err, image) => {
    if (err) {
      // Delete uploaded file if database insert fails
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(201).json({ 
      id: image.id, 
      message: req.file ? 'Image uploaded successfully' : 'Image added successfully',
      url: imageData.url
    });
  });
});

// Update gallery image (metadata only, not the file)
app.patch('/api/gallery/:id', (req, res) => {
  const id = req.params.id;
  const { title, category, description } = req.body;

  if (!title && !category && !description) {
    res.status(400).json({ error: 'At least one field (title, category, description) is required' });
    return;
  }

  dbHelpers.updateGalleryImage(id, { title, category, description }, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (result.changes === 0) {
      res.status(404).json({ error: 'Image not found' });
      return;
    }
    res.json({ message: 'Image updated successfully', ...result });
  });
});

// Delete gallery image
app.delete('/api/gallery/:id', (req, res) => {
  const id = req.params.id;
  dbHelpers.deleteGalleryImage(id, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!result.deleted) {
      res.status(404).json({ error: 'Image not found' });
      return;
    }

    // Delete the physical file
    if (result.file_path && fs.existsSync(result.file_path)) {
      fs.unlinkSync(result.file_path);
    }

    res.json({ message: 'Image deleted successfully' });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Uploads directory: ${uploadsDir}`);
});

