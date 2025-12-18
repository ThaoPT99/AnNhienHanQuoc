require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { dbHelpers } = require('./database');
const { 
  isCloudinaryConfigured,
  checkCloudinaryConfig,
  uploadToCloudinary, 
  uploadBufferToCloudinary,
  deleteFromCloudinary,
  extractPublicId 
} = require('./cloudinary');

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
// Support Railway Volume: set UPLOADS_DIR=/data/uploads/gallery in Railway environment variables
const uploadsDir = process.env.UPLOADS_DIR || path.join(__dirname, 'uploads', 'gallery');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Created uploads directory:', uploadsDir);
}
console.log('📁 Uploads directory:', uploadsDir);

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

const galleryUpload = multer({
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

// Configure multer for recruitment CVs
const recruitmentUploadsDir = process.env.RECRUITMENT_UPLOADS_DIR || path.join(__dirname, 'uploads', 'recruitment');
if (!fs.existsSync(recruitmentUploadsDir)) {
  fs.mkdirSync(recruitmentUploadsDir, { recursive: true });
  console.log('📁 Created recruitment uploads directory:', recruitmentUploadsDir);
}

const recruitmentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, recruitmentUploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'cv-' + uniqueSuffix + ext);
  }
});

const recruitmentUpload = multer({
  storage: recruitmentStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = /pdf|msword|application\/msword|application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document/.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, and DOCX files are allowed'));
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
    // Return the ADMIN_TOKEN from environment variable
    // This token will be used for all subsequent API calls
    const token = process.env.ADMIN_TOKEN || 'default-admin-token-change-in-production';
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

// Newsletter routes
app.post('/api/newsletter/subscribe', (req, res) => {
  const { email, name } = req.body;
  
  if (!email) {
    res.status(400).json({ error: 'Email is required' });
    return;
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ error: 'Invalid email format' });
    return;
  }

  dbHelpers.subscribeNewsletter({ email, name, source: 'website' }, (err, subscriber) => {
    if (err) {
      if (err.message === 'Email already subscribed') {
        res.status(409).json({ error: 'Email already subscribed' });
      } else {
        res.status(500).json({ error: err.message });
      }
      return;
    }
    res.status(201).json({ message: 'Subscribed successfully', subscriber });
  });
});

// Events registration routes
app.post('/api/events/register', (req, res) => {
  const { eventId, name, email, phone } = req.body;
  
  if (!eventId || !name || !email || !phone) {
    res.status(400).json({ error: 'Event ID, name, email, and phone are required' });
    return;
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ error: 'Invalid email format' });
    return;
  }

  dbHelpers.registerEvent({ eventId, name, email, phone }, (err, registration) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(201).json({ message: 'Registered successfully', registration });
  });
});

// Get all event registrations (for admin)
app.get('/api/events/registrations', (req, res) => {
  const token = req.headers['x-admin-token'];
  if (!token || token !== process.env.ADMIN_TOKEN) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  dbHelpers.getAllEventRegistrations((err, registrations) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(registrations);
  });
});

// Get all newsletter subscribers (for admin)
app.get('/api/newsletter/subscribers', (req, res) => {
  const token = req.headers['x-admin-token'];
  if (!token || token !== process.env.ADMIN_TOKEN) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  dbHelpers.getAllNewsletterSubscribers((err, subscribers) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(subscribers);
  });
});

// Recruitment routes
console.log('✅ Registering recruitment endpoint: POST /api/recruitment/apply');
app.post('/api/recruitment/apply', recruitmentUpload.single('cv'), (req, res) => {
  console.log('📥 Received recruitment application:', { name: req.body.name, email: req.body.email, position: req.body.position });
  const { name, email, phone, position, experience, message } = req.body;
  
  if (!name || !email || !phone || !position) {
    res.status(400).json({ error: 'Name, email, phone, and position are required' });
    return;
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ error: 'Invalid email format' });
    return;
  }

  let cv_file_path = null;
  let cv_file_name = null;

  if (req.file) {
    if (isCloudinaryConfigured()) {
      // Upload to Cloudinary
      uploadToCloudinary(req.file.path, 'recruitment', (err, result) => {
        if (err) {
          res.status(500).json({ error: 'Failed to upload CV' });
          return;
        }
        cv_file_path = result.secure_url;
        cv_file_name = req.file.originalname;
        
        // Delete local file after upload
        fs.unlink(req.file.path, () => {});
        
        dbHelpers.createRecruitmentApplication({
          name, email, phone, position, experience, message, cv_file_path, cv_file_name
        }, (err, application) => {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }
          res.status(201).json({ message: 'Application submitted successfully', application });
        });
      });
    } else {
      // Use local storage
      cv_file_path = req.file.path;
      cv_file_name = req.file.originalname;
      
      dbHelpers.createRecruitmentApplication({
        name, email, phone, position, experience, message, cv_file_path, cv_file_name
      }, (err, application) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.status(201).json({ message: 'Application submitted successfully', application });
      });
    }
  } else {
    // No CV file
    dbHelpers.createRecruitmentApplication({
      name, email, phone, position, experience, message, cv_file_path, cv_file_name
    }, (err, application) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({ message: 'Application submitted successfully', application });
    });
  }
});

// Get all recruitment applications (for admin)
app.get('/api/recruitment/applications', (req, res) => {
  const token = req.headers['x-admin-token'];
  if (!token || token !== process.env.ADMIN_TOKEN) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  dbHelpers.getAllRecruitmentApplications((err, applications) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(applications);
  });
});

// Update recruitment status (for admin)
app.patch('/api/recruitment/:id/status', (req, res) => {
  const token = req.headers['x-admin-token'];
  if (!token || token !== process.env.ADMIN_TOKEN) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const id = req.params.id;
  const { status } = req.body;
  
  const validStatuses = ['pending', 'reviewing', 'accepted', 'rejected'];
  if (!status || !validStatuses.includes(status)) {
    res.status(400).json({ error: 'Invalid status. Must be one of: ' + validStatuses.join(', ') });
    return;
  }

  dbHelpers.updateRecruitmentStatus(id, status, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Status updated successfully', result });
  });
});

// Resources downloads routes
app.post('/api/resources/download', (req, res) => {
  const { email, resource_id, resource_title } = req.body;
  
  if (!email || !resource_id) {
    res.status(400).json({ error: 'Email and resource_id are required' });
    return;
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ error: 'Invalid email format' });
    return;
  }

  dbHelpers.recordResourceDownload({ email, resource_id, resource_title }, (err, download) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(201).json({ message: 'Download recorded successfully', download });
  });
});

// Get all resource downloads (for admin)
app.get('/api/resources/downloads', (req, res) => {
  const token = req.headers['x-admin-token'];
  if (!token || token !== process.env.ADMIN_TOKEN) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  dbHelpers.getResourceDownloads((err, downloads) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(downloads);
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
// Use single() but handle case when no file is provided
app.post('/api/gallery', async (req, res, next) => {
  // Check if request has file upload
  if (req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data')) {
    // Use multer middleware for file upload
    galleryUpload.single('image')(req, res, next);
  } else {
    // Skip multer for JSON requests (URL only)
    next();
  }
}, async (req, res) => {
  const { title, category, description, url } = req.body;

  // Check if file is uploaded or URL is provided
  if (!req.file && !url) {
    res.status(400).json({ error: 'Either image file or URL must be provided' });
    return;
  }

  let imageData;

  // Handle file upload with Cloudinary or local storage
  if (req.file) {
    // Read file buffer for Cloudinary upload
    const fileBuffer = fs.readFileSync(req.file.path);
    
    // Try to upload to Cloudinary first, fallback to local
    if (checkCloudinaryConfig()) {
      try {
        const cloudinaryResult = await uploadBufferToCloudinary(
          fileBuffer, 
          req.file.filename,
          'gallery'
        );

        // Delete local file after successful Cloudinary upload
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }

        imageData = {
          title: title || null,
          url: cloudinaryResult.url,
          category: category || 'Khác',
          description: description || null,
          file_path: cloudinaryResult.public_id, // Store public_id instead of local path
          file_size: cloudinaryResult.bytes,
          mime_type: `image/${cloudinaryResult.format}`
        };
      } catch (cloudinaryError) {
        console.error('Cloudinary upload failed, using local storage:', cloudinaryError);
        // Fallback to local storage
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
      }
    } else {
      // Use local storage
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
    }
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

  dbHelpers.createGalleryImage(imageData, async (err, image) => {
    if (err) {
      // Delete uploaded file if database insert fails
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      // If Cloudinary upload succeeded but DB failed, try to delete from Cloudinary
      if (checkCloudinaryConfig() && imageData.file_path && !imageData.file_path.includes('/') && !imageData.file_path.includes('\\')) {
        try {
          await deleteFromCloudinary(imageData.file_path);
        } catch (deleteError) {
          console.error('Failed to delete from Cloudinary:', deleteError);
        }
      }
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(201).json({ 
      id: image.id, 
      message: req.file ? 'Image uploaded successfully' : 'Image added successfully',
      url: imageData.url,
      storage: checkCloudinaryConfig() && req.file ? 'cloudinary' : 'local'
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

// Migration endpoint - Check and migrate images to Cloudinary
app.post('/api/gallery/migrate', verifyAdminToken, async (req, res) => {
  const { migrateUrls } = require('./migrate-urls-to-cloudinary');
  
  if (!checkCloudinaryConfig()) {
    res.status(400).json({ 
      error: 'Cloudinary is not configured',
      message: 'Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET environment variables'
    });
    return;
  }

  if (!initCloudinary()) {
    res.status(500).json({ error: 'Failed to initialize Cloudinary' });
    return;
  }

  // Get all gallery images
  dbHelpers.getAllGalleryImages(async (err, images) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (!images || images.length === 0) {
      res.json({ message: 'No images found', migrated: 0 });
      return;
    }

    // Filter images that are NOT on Cloudinary
    const imagesToMigrate = images.filter(img => {
      if (!img.url) return false;
      return !img.url.includes('cloudinary.com');
    });

    if (imagesToMigrate.length === 0) {
      res.json({ 
        message: 'All images are already on Cloudinary', 
        migrated: 0,
        total: images.length 
      });
      return;
    }

    res.json({ 
      message: `Found ${imagesToMigrate.length} images to migrate`,
      total: images.length,
      toMigrate: imagesToMigrate.length,
      note: 'Migration will be processed in background. Check server logs for progress.'
    });

    // Start migration in background (non-blocking)
    setTimeout(async () => {
      const https = require('https');
      const http = require('http');
      
      let successCount = 0;
      let errorCount = 0;

      for (const image of imagesToMigrate) {
        try {
          // Download image
          const protocol = image.url.startsWith('https') ? https : http;
          const buffer = await new Promise((resolve, reject) => {
            protocol.get(image.url, (response) => {
              if (response.statusCode !== 200) {
                reject(new Error(`Failed to download: ${response.statusCode}`));
                return;
              }
              const chunks = [];
              response.on('data', chunk => chunks.push(chunk));
              response.on('end', () => resolve(Buffer.concat(chunks)));
            }).on('error', reject);
          });

          // Upload to Cloudinary
          const cloudinaryResult = await uploadBufferToCloudinary(
            buffer,
            `gallery-${image.id}.jpg`,
            'gallery'
          );

          // Update database
          await new Promise((resolve, reject) => {
            dbHelpers.updateGalleryImage(image.id, {
              url: cloudinaryResult.url,
              file_path: cloudinaryResult.public_id,
              file_size: cloudinaryResult.bytes,
              mime_type: `image/${cloudinaryResult.format}`
            }, (err) => {
              if (err) reject(err);
              else resolve();
            });
          });

          console.log(`✅ Migrated image ${image.id} to Cloudinary`);
          successCount++;
        } catch (error) {
          console.error(`❌ Failed to migrate image ${image.id}:`, error.message);
          errorCount++;
        }
      }

      console.log(`\n✅ Migration complete: ${successCount} success, ${errorCount} errors`);
    }, 1000);
  });
});

// Delete gallery image
app.delete('/api/gallery/:id', async (req, res) => {
  const id = req.params.id;
  dbHelpers.deleteGalleryImage(id, async (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!result.deleted) {
      res.status(404).json({ error: 'Image not found' });
      return;
    }

    // Delete from Cloudinary if it's a Cloudinary image
    if (checkCloudinaryConfig() && result.file_path) {
      // Check if file_path is a Cloudinary public_id (doesn't contain path separators)
      if (!result.file_path.includes('/') && !result.file_path.includes('\\')) {
        try {
          await deleteFromCloudinary(result.file_path);
        } catch (cloudinaryError) {
          console.error('Failed to delete from Cloudinary:', cloudinaryError);
          // Continue even if Cloudinary delete fails
        }
      } else {
        // Try to extract public_id from URL
        const publicId = extractPublicId(result.url || '');
        if (publicId) {
          try {
            await deleteFromCloudinary(publicId);
          } catch (cloudinaryError) {
            console.error('Failed to delete from Cloudinary:', cloudinaryError);
          }
        }
      }
    }

    // Delete local file if it exists
    if (result.file_path && fs.existsSync(result.file_path)) {
      try {
        fs.unlinkSync(result.file_path);
      } catch (fileError) {
        console.error('Failed to delete local file:', fileError);
      }
    }

    res.json({ message: 'Image deleted successfully' });
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📁 Uploads directory: ${uploadsDir}`);
  console.log(`✅ Available endpoints:`);
  console.log(`   - POST /api/recruitment/apply`);
  console.log(`   - POST /api/events/register`);
  console.log(`   - POST /api/newsletter/subscribe`);
  console.log(`   - POST /api/resources/download`);
  
  // Initialize Cloudinary check at runtime (not during build)
  // This prevents Railway from trying to resolve secrets during build phase
  const { checkCloudinaryConfig, initCloudinary } = require('./cloudinary');
  if (checkCloudinaryConfig()) {
    initCloudinary();
  } else {
    console.log('ℹ️  Cloudinary not configured, using local storage');
  }
});

