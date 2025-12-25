require('dotenv').config();
// Set timezone to Vietnam (UTC+7)
process.env.TZ = 'Asia/Ho_Chi_Minh';

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { getVietnamTimeISO } = require('./timezone');
// Auto-select database: Turso if configured, otherwise SQLite
const { dbHelpers } = require(
  process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN 
    ? './database-turso' 
    : './database'
);
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

// Helper function to parse user agent and detect device type
const parseUserAgent = (userAgent) => {
  if (!userAgent) return { deviceType: 'Unknown', browser: 'Unknown', os: 'Unknown' };
  
  const ua = userAgent.toLowerCase();
  let deviceType = 'Desktop';
  let browser = 'Unknown';
  let os = 'Unknown';
  
  // Detect device type
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone') || ua.includes('ipad')) {
    deviceType = 'Mobile';
  } else if (ua.includes('tablet') || ua.includes('ipad')) {
    deviceType = 'Tablet';
  }
  
  // Detect browser
  if (ua.includes('chrome') && !ua.includes('edg')) {
    browser = 'Chrome';
  } else if (ua.includes('firefox')) {
    browser = 'Firefox';
  } else if (ua.includes('safari') && !ua.includes('chrome')) {
    browser = 'Safari';
  } else if (ua.includes('edg')) {
    browser = 'Edge';
  } else if (ua.includes('opera') || ua.includes('opr')) {
    browser = 'Opera';
  }
  
  // Detect OS
  if (ua.includes('windows')) {
    os = 'Windows';
  } else if (ua.includes('mac')) {
    os = 'macOS';
  } else if (ua.includes('linux')) {
    os = 'Linux';
  } else if (ua.includes('android')) {
    os = 'Android';
  } else if (ua.includes('ios') || ua.includes('iphone') || ua.includes('ipad')) {
    os = 'iOS';
  }
  
  return { deviceType, browser, os };
};

// Middleware to log visits (skip for admin routes and API routes)
app.use((req, res, next) => {
  // Skip logging for admin routes, API routes, and static files
  if (req.path.startsWith('/api/') || 
      req.path.startsWith('/admin') || 
      req.path.startsWith('/static') ||
      req.path.includes('.')) {
    return next();
  }
  
  // Get client IP address
  const ipAddress = req.headers['x-forwarded-for']?.split(',')[0] || 
                    req.headers['x-real-ip'] || 
                    req.connection.remoteAddress || 
                    req.socket.remoteAddress ||
                    'Unknown';
  
  const userAgent = req.headers['user-agent'] || 'Unknown';
  const referrer = req.headers['referer'] || req.headers['referrer'] || null;
  const pagePath = req.path;
  
  const { deviceType, browser, os } = parseUserAgent(userAgent);
  
  // Log visit asynchronously (don't block the request)
  const visitData = {
    ipAddress: ipAddress.replace(/^::ffff:/, ''), // Remove IPv6 prefix
    userAgent,
    pagePath,
    referrer,
    country: null, // Can be enhanced with IP geolocation service
    city: null,
    deviceType,
    browser,
    os
  };
  
  dbHelpers.logVisit(visitData, (err) => {
    if (err) {
      console.error('Error logging visit:', err);
    }
  });
  
  next();
});

// Create uploads directory if it doesn't exist
// Support Railway Volume: set UPLOADS_DIR=/data/uploads/gallery in Railway environment variables
const uploadsDir = process.env.UPLOADS_DIR || path.join(__dirname, 'uploads', 'gallery');
if (!fs.existsSync(uploadsDir)) {
  try {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('📁 Created uploads directory:', uploadsDir);
  } catch (error) {
    console.error('❌ Error creating uploads directory:', error.message);
    if (uploadsDir.startsWith('/data')) {
      console.error('⚠️  Railway Volume chưa được mount tại /data');
      console.error('💡 Hãy đảm bảo Volume đã được mount và UPLOADS_DIR đúng');
    }
  }
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
// Support Railway Volume: if UPLOADS_DIR is set, use /data/uploads/recruitment
let recruitmentUploadsDir = process.env.RECRUITMENT_UPLOADS_DIR;
if (!recruitmentUploadsDir) {
  if (process.env.UPLOADS_DIR && process.env.UPLOADS_DIR.startsWith('/data')) {
    // For Railway Volume: use /data/uploads/recruitment
    recruitmentUploadsDir = path.join(path.dirname(process.env.UPLOADS_DIR), 'recruitment');
  } else {
    // For local: use __dirname/uploads/recruitment
    recruitmentUploadsDir = path.join(__dirname, 'uploads', 'recruitment');
  }
}
if (!fs.existsSync(recruitmentUploadsDir)) {
  try {
    fs.mkdirSync(recruitmentUploadsDir, { recursive: true });
    console.log('📁 Created recruitment uploads directory:', recruitmentUploadsDir);
  } catch (error) {
    console.error('❌ Error creating recruitment uploads directory:', error.message);
  }
}
console.log('📁 Recruitment uploads directory:', recruitmentUploadsDir);

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
// Support Railway Volume: calculate base uploads directory from UPLOADS_DIR
// If UPLOADS_DIR=/data/uploads/gallery, base dir should be /data/uploads
let baseUploadsDir = path.join(__dirname, 'uploads');
if (process.env.UPLOADS_DIR) {
  // If UPLOADS_DIR is set (e.g., /data/uploads/gallery), use parent directory for base
  const uploadsDir = process.env.UPLOADS_DIR;
  if (uploadsDir.startsWith('/data')) {
    // For Railway Volume: /data/uploads/gallery -> /data/uploads
    baseUploadsDir = path.dirname(uploadsDir);
  } else {
    // For local: use __dirname/uploads
    baseUploadsDir = path.join(__dirname, 'uploads');
  }
}
if (!fs.existsSync(baseUploadsDir)) {
  try {
    fs.mkdirSync(baseUploadsDir, { recursive: true });
    console.log('📁 Created base uploads directory:', baseUploadsDir);
  } catch (error) {
    console.error('⚠️  Could not create base uploads directory:', error.message);
  }
}
console.log('📁 Serving static files from:', baseUploadsDir);
app.use('/uploads', express.static(baseUploadsDir));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: getVietnamTimeISO() });
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
  
  console.log('Event registration request:', { eventId, name, email, phone });
  
  if (!eventId || !name || !email || !phone) {
    console.log('Missing required fields:', { eventId, name, email, phone });
    res.status(400).json({ error: 'Event ID, name, email, and phone are required' });
    return;
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.log('Invalid email format:', email);
    res.status(400).json({ error: 'Invalid email format' });
    return;
  }

  dbHelpers.registerEvent({ eventId, name, email, phone }, (err, registration) => {
    if (err) {
      console.error('Error registering event:', err);
      res.status(500).json({ error: err.message });
      return;
    }
    console.log('Event registered successfully:', registration);
    res.status(201).json({ message: 'Registered successfully', registration });
  });
});

// Get all event registrations (for admin)
app.get('/api/events/registrations', (req, res) => {
  const token = req.headers['x-admin-token'];
  console.log('Getting event registrations, token provided:', !!token);
  if (!token || token !== process.env.ADMIN_TOKEN) {
    console.log('Unauthorized access attempt');
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  dbHelpers.getAllEventRegistrations((err, registrations) => {
    if (err) {
      console.error('Error getting event registrations:', err);
      res.status(500).json({ error: err.message });
      return;
    }
    console.log(`Returning ${registrations.length} event registrations`);
    res.json(registrations);
  });
});

// Event Details CRUD API
// Get all events (public)
app.get('/api/events/list', (req, res) => {
  dbHelpers.getAllEvents((err, events) => {
    if (err) {
      console.error('Error getting events:', err);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(events);
  });
});

// Get event by ID (public)
app.get('/api/events/list/:id', (req, res) => {
  const eventId = parseInt(req.params.id);
  if (isNaN(eventId)) {
    res.status(400).json({ error: 'Invalid event ID' });
    return;
  }
  dbHelpers.getEventById(eventId, (err, event) => {
    if (err) {
      console.error('Error getting event:', err);
      res.status(500).json({ error: err.message });
      return;
    }
    if (!event) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }
    res.json(event);
  });
});

// Create event (admin only)
app.post('/api/events/list', (req, res) => {
  const token = req.headers['x-admin-token'];
  if (!token || token !== process.env.ADMIN_TOKEN) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const { title, description, date, time, location, type, status, image, agenda, speakers, capacity } = req.body;
  
  if (!title || !date || !time || !location) {
    res.status(400).json({ error: 'Title, date, time, and location are required' });
    return;
  }

  dbHelpers.createEvent({
    title,
    description,
    date,
    time,
    location,
    type,
    status,
    image,
    agenda,
    speakers,
    capacity
  }, (err, event) => {
    if (err) {
      console.error('Error creating event:', err);
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(201).json(event);
  });
});

// Update event (admin only)
app.put('/api/events/list/:id', (req, res) => {
  const token = req.headers['x-admin-token'];
  if (!token || token !== process.env.ADMIN_TOKEN) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const eventId = parseInt(req.params.id);
  if (isNaN(eventId)) {
    res.status(400).json({ error: 'Invalid event ID' });
    return;
  }

  const { title, description, date, time, location, type, status, image, agenda, speakers, capacity } = req.body;
  
  if (!title || !date || !time || !location) {
    res.status(400).json({ error: 'Title, date, time, and location are required' });
    return;
  }

  dbHelpers.updateEvent(eventId, {
    title,
    description,
    date,
    time,
    location,
    type,
    status,
    image,
    agenda,
    speakers,
    capacity
  }, (err, event) => {
    if (err) {
      console.error('Error updating event:', err);
      res.status(500).json({ error: err.message });
      return;
    }
    if (!event) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }
    res.json(event);
  });
});

// Delete event (admin only)
app.delete('/api/events/list/:id', (req, res) => {
  const token = req.headers['x-admin-token'];
  if (!token || token !== process.env.ADMIN_TOKEN) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const eventId = parseInt(req.params.id);
  if (isNaN(eventId)) {
    res.status(400).json({ error: 'Invalid event ID' });
    return;
  }

  dbHelpers.deleteEvent(eventId, (err, result) => {
    if (err) {
      console.error('Error deleting event:', err);
      res.status(500).json({ error: err.message });
      return;
    }
    if (!result || !result.deleted) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }
    res.json({ message: 'Event deleted successfully' });
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

// Resource file mapping - Map resource IDs to file paths
const RESOURCE_FILES = {
  1: { filename: 'checklist-ho-so-du-hoc-han-quoc.pdf', name: 'Checklist hồ sơ du học Hàn Quốc.pdf' },
  2: { filename: 'huong-dan-xin-visa-d2.pdf', name: 'Hướng dẫn xin visa D-2 chi tiết.pdf' },
  3: { filename: 'template-thu-gioi-thieu-ban-than.docx', name: 'Template thư giới thiệu bản thân.docx' },
  4: { filename: 'ke-hoach-hoc-tap-mau.docx', name: 'Kế hoạch học tập mẫu.docx' },
  5: { filename: 'danh-sach-truong-dai-hoc-han-quoc.pdf', name: 'Danh sách trường đại học Hàn Quốc.pdf' },
  6: { filename: 'huong-dan-luyen-thi-topik.pdf', name: 'Hướng dẫn luyện thi TOPIK.pdf' },
  7: { filename: 'tu-vung-tieng-han-du-hoc-sinh.pdf', name: 'Từ vựng tiếng Hàn du học sinh.pdf' },
  8: { filename: 'huong-dan-tim-nha-o-han-quoc.pdf', name: 'Hướng dẫn tìm nhà ở tại Hàn Quốc.pdf' },
  9: { filename: 'checklist-chuan-bi-len-duong.pdf', name: 'Checklist chuẩn bị lên đường.pdf' },
  10: { filename: 'huong-dan-lam-them-han-quoc.pdf', name: 'Hướng dẫn làm thêm tại Hàn Quốc.pdf' }
};

// Ensure resources directory exists
// Support Railway Volume: if UPLOADS_DIR is set, use /data/uploads/resources
let resourcesDir = process.env.RESOURCES_DIR;
if (!resourcesDir) {
  if (process.env.UPLOADS_DIR && process.env.UPLOADS_DIR.startsWith('/data')) {
    // For Railway Volume: use /data/uploads/resources
    resourcesDir = path.join(path.dirname(process.env.UPLOADS_DIR), 'resources');
  } else {
    // For local: use __dirname/uploads/resources
    resourcesDir = path.join(__dirname, 'uploads', 'resources');
  }
}
if (!fs.existsSync(resourcesDir)) {
  try {
    fs.mkdirSync(resourcesDir, { recursive: true });
    console.log('📁 Created resources directory:', resourcesDir);
  } catch (error) {
    console.error('❌ Error creating resources directory:', error.message);
  }
}
console.log('📁 Resources directory:', resourcesDir);

// GET route to serve resource files
app.get('/api/resources/file/:id', (req, res) => {
  const resourceId = parseInt(req.params.id);
  const resourceFile = RESOURCE_FILES[resourceId];
  
  if (!resourceFile) {
    res.status(404).json({ error: 'Resource not found' });
    return;
  }

  const filePath = path.join(resourcesDir, resourceFile.filename);
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    res.status(404).json({ 
      error: 'File not found',
      message: `File ${resourceFile.filename} does not exist. Please upload the file to server/uploads/resources/`
    });
    return;
  }

  // Send file with proper headers
  res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(resourceFile.name)}"`);
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(500).json({ error: 'Error sending file' });
    }
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

  // Check if resource file exists
  const resourceId = parseInt(resource_id);
  const resourceFile = RESOURCE_FILES[resourceId];
  
  if (!resourceFile) {
    res.status(404).json({ error: 'Resource not found' });
    return;
  }

  const filePath = path.join(resourcesDir, resourceFile.filename);
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    // Record download attempt even if file doesn't exist
    dbHelpers.recordResourceDownload({ email, resource_id, resource_title }, (err, download) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(404).json({ 
        error: 'File not found',
        message: `File ${resourceFile.filename} does not exist. Please upload the file to server/uploads/resources/`,
        download_id: download.id
      });
    });
    return;
  }

  // Record download
  dbHelpers.recordResourceDownload({ email, resource_id, resource_title }, (err, download) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    // Determine content type based on file extension
    const ext = path.extname(resourceFile.filename).toLowerCase();
    let contentType = 'application/octet-stream';
    if (ext === '.pdf') {
      contentType = 'application/pdf';
    } else if (ext === '.docx') {
      contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    }
    
    // Send file with proper headers
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(resourceFile.name)}"`);
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error('Error sending file:', err);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Error sending file' });
        }
      }
    });
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

// Consultation registration
app.post('/api/consultation/register', (req, res) => {
  const { name, phone, email, currentGrade, interestedMajor, interestedCity, budget, topikLevel, message, triggerSource } = req.body;

  if (!name || !phone || !email) {
    res.status(400).json({ error: 'Name, phone, and email are required' });
    return;
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ error: 'Invalid email format' });
    return;
  }

  dbHelpers.registerConsultation({
    name,
    phone,
    email,
    currentGrade,
    interestedMajor,
    interestedCity,
    budget,
    topikLevel,
    message,
    triggerSource
  }, (err, consultation) => {
    if (err) {
      console.error('Error registering consultation:', err);
      res.status(500).json({ error: 'Failed to register consultation' });
      return;
    }
    res.status(201).json({ success: true, consultation });
  });
});

// Get all consultations (for admin)
app.get('/api/consultation/registrations', (req, res) => {
  const token = req.headers['x-admin-token'];
  if (!token || token !== process.env.ADMIN_TOKEN) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  dbHelpers.getAllConsultations((err, consultations) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(consultations);
  });
});

// Consultation booking
app.post('/api/consultation/book', (req, res) => {
  const { name, phone, email, date, time, formattedDate, preferredMethod, notes } = req.body;

  if (!name || !phone || !email || !date || !time) {
    res.status(400).json({ error: 'Name, phone, email, date, and time are required' });
    return;
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ error: 'Invalid email format' });
    return;
  }

  dbHelpers.bookConsultation({
    name,
    phone,
    email,
    date,
    time,
    formattedDate,
    preferredMethod: preferredMethod || 'zoom',
    notes: notes || ''
  }, (err, booking) => {
    if (err) {
      console.error('Error booking consultation:', err);
      res.status(500).json({ error: 'Failed to book consultation' });
      return;
    }
    res.status(201).json({ success: true, booking });
  });
});

// Get all bookings (for admin)
app.get('/api/consultation/bookings', (req, res) => {
  const token = req.headers['x-admin-token'];
  if (!token || token !== process.env.ADMIN_TOKEN) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  dbHelpers.getAllBookings((err, bookings) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(bookings);
  });
});

// Visits tracking endpoints
// POST endpoint for client to log visits (no auth required)
app.post('/api/visits/log', (req, res) => {
  const { pagePath, referrer, userAgent, deviceType, browser, os } = req.body;
  
  // Get client IP address
  const ipAddress = req.headers['x-forwarded-for']?.split(',')[0] || 
                    req.headers['x-real-ip'] || 
                    req.connection.remoteAddress || 
                    req.socket.remoteAddress ||
                    'Unknown';

  const visitData = {
    ipAddress: ipAddress.replace(/^::ffff:/, ''),
    userAgent: userAgent || 'Unknown',
    pagePath: pagePath || '/',
    referrer: referrer || null,
    country: null,
    city: null,
    deviceType: deviceType || 'Unknown',
    browser: browser || 'Unknown',
    os: os || 'Unknown'
  };

  dbHelpers.logVisit(visitData, (err) => {
    if (err) {
      console.error('Error logging visit:', err);
      res.status(500).json({ error: 'Failed to log visit' });
      return;
    }
    res.json({ success: true });
  });
});

app.get('/api/visits', (req, res) => {
  const token = req.headers['x-admin-token'];
  if (!token || token !== process.env.ADMIN_TOKEN) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  dbHelpers.getAllVisits((err, visits) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(visits);
  });
});

app.get('/api/visits/stats', (req, res) => {
  const token = req.headers['x-admin-token'];
  if (!token || token !== process.env.ADMIN_TOKEN) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  dbHelpers.getVisitStats((err, stats) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(stats);
  });
});

// Community API endpoints
// Get all posts
app.get('/api/community/posts', (req, res) => {
  const { category, type, limit, offset, sort } = req.query;
  dbHelpers.getAllPosts({ 
    category, 
    type, 
    limit: limit ? parseInt(limit) : null,
    offset: offset ? parseInt(offset) : null,
    sort: sort || 'newest'
  }, (err, posts) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(posts);
  });
});

// Get single post with comments
app.get('/api/community/posts/:id', (req, res) => {
  const postId = parseInt(req.params.id);
  
  dbHelpers.getPostById(postId, (err, post) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }
    
    // Update views
    dbHelpers.updatePostViews(postId, () => {});
    
    // Get comments
    dbHelpers.getCommentsByPostId(postId, (err, comments) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ ...post, comments: comments || [] });
    });
  });
});

// Create new post
app.post('/api/community/posts', (req, res) => {
  const { author_name, author_email, title, content, category, tags, type } = req.body;
  
  if (!author_name || !title || !content) {
    res.status(400).json({ error: 'Author name, title and content are required' });
    return;
  }
  
  // Validate lengths
  if (title.length > 200) {
    res.status(400).json({ error: 'Title cannot exceed 200 characters' });
    return;
  }
  
  if (content.length > 5000) {
    res.status(400).json({ error: 'Content cannot exceed 5000 characters' });
    return;
  }
  
  if (title.trim().length === 0 || content.trim().length === 0) {
    res.status(400).json({ error: 'Title and content cannot be empty' });
    return;
  }
  
  dbHelpers.createPost({
    author_name,
    author_email,
    title: title.trim(),
    content: content.trim(),
    category: category || 'Tất cả',
    tags: tags || [],
    type: type || 'discussion'
  }, (err, post) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(201).json(post);
  });
});

// Add comment to post
app.post('/api/community/posts/:id/comments', (req, res) => {
  const postId = parseInt(req.params.id);
  const { author_name, author_email, content } = req.body;
  
  if (!author_name || !content) {
    res.status(400).json({ error: 'Author name and content are required' });
    return;
  }
  
  // Validate comment length
  if (content.length > 1000) {
    res.status(400).json({ error: 'Comment cannot exceed 1000 characters' });
    return;
  }
  
  if (content.trim().length === 0) {
    res.status(400).json({ error: 'Comment cannot be empty' });
    return;
  }
  
  dbHelpers.addComment({
    post_id: postId,
    author_name,
    author_email,
    content: content.trim()
  }, (err, comment) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(201).json(comment);
  });
});

// Toggle like (post or comment)
app.post('/api/community/likes', (req, res) => {
  const { post_id, comment_id, user_email } = req.body;
  
  if (!user_email || (!post_id && !comment_id)) {
    res.status(400).json({ error: 'User email and post_id or comment_id are required' });
    return;
  }
  
  dbHelpers.toggleLike({
    post_id: post_id ? parseInt(post_id) : null,
    comment_id: comment_id ? parseInt(comment_id) : null,
    user_email
  }, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(result);
  });
});

// Check if user liked
app.get('/api/community/likes/check', (req, res) => {
  const { post_id, comment_id, user_email } = req.query;
  
  if (!user_email) {
    res.status(400).json({ error: 'User email is required' });
    return;
  }
  
  dbHelpers.checkUserLiked(
    post_id ? parseInt(post_id) : null,
    comment_id ? parseInt(comment_id) : null,
    user_email,
    (err, like) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ liked: !!like });
    }
  );
});

// Delete post (user can delete their own, admin can delete any)
app.delete('/api/community/posts/:id', (req, res) => {
  const token = req.headers['x-admin-token'];
  const { user_email } = req.body;
  const postId = parseInt(req.params.id);
  
  // Check if admin
  const isAdmin = token && token === process.env.ADMIN_TOKEN;
  
  if (!isAdmin) {
    // User can only delete their own posts
    if (!user_email) {
      res.status(400).json({ error: 'User email is required' });
      return;
    }
    
    // Check if post belongs to user
    dbHelpers.getPostById(postId, (err, post) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (!post) {
        res.status(404).json({ error: 'Post not found' });
        return;
      }
      if (post.author_email !== user_email) {
        res.status(403).json({ error: 'You can only delete your own posts' });
        return;
      }
      
      dbHelpers.deletePost(postId, (deleteErr, result) => {
        if (deleteErr) {
          res.status(500).json({ error: deleteErr.message });
          return;
        }
        if (!result.deleted) {
          res.status(404).json({ error: 'Post not found' });
          return;
        }
        res.json({ success: true, message: 'Post deleted successfully' });
      });
    });
  } else {
    // Admin can delete any post
    dbHelpers.deletePost(postId, (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (!result.deleted) {
        res.status(404).json({ error: 'Post not found' });
        return;
      }
      res.json({ success: true, message: 'Post deleted successfully' });
    });
  }
});

// Update post (user can update their own posts)
app.put('/api/community/posts/:id', (req, res) => {
  const { title, content, category, tags, user_email } = req.body;
  const postId = parseInt(req.params.id);
  
  if (!user_email) {
    res.status(400).json({ error: 'User email is required' });
    return;
  }
  
  if (!title || !content) {
    res.status(400).json({ error: 'Title and content are required' });
    return;
  }
  
  // Check if post belongs to user
  dbHelpers.getPostById(postId, (err, post) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }
    if (post.author_email !== user_email) {
      res.status(403).json({ error: 'You can only edit your own posts' });
      return;
    }
    
    const tagsStr = Array.isArray(tags) ? tags.join(',') : (tags || '');
    db.run(
      'UPDATE community_posts SET title = ?, content = ?, category = ?, tags = ?, updated_at = datetime(\'now\') WHERE id = ?',
      [title, content, category || 'Tất cả', tagsStr, postId],
      function(updateErr) {
        if (updateErr) {
          res.status(500).json({ error: updateErr.message });
          return;
        }
        dbHelpers.getPostById(postId, (getErr, updatedPost) => {
          if (getErr) {
            res.status(500).json({ error: getErr.message });
            return;
          }
          res.json(updatedPost);
        });
      }
    );
  });
});

// Admin: Toggle featured post
app.patch('/api/community/posts/:id/featured', (req, res) => {
  const token = req.headers['x-admin-token'];
  if (!token || token !== process.env.ADMIN_TOKEN) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  
  const postId = parseInt(req.params.id);
  dbHelpers.toggleFeaturedPost(postId, (err, post) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(post);
  });
});

// Admin: Get all posts (for admin panel)
app.get('/api/community/posts/admin/all', (req, res) => {
  const token = req.headers['x-admin-token'];
  if (!token || token !== process.env.ADMIN_TOKEN) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  
  dbHelpers.getAllPosts({}, (err, posts) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(posts);
  });
});

// ========== SOCIAL FEATURES API ==========

// Follow System
app.post('/api/social/follow', (req, res) => {
  const { follower_email, following_email } = req.body;
  if (!follower_email || !following_email) {
    res.status(400).json({ error: 'Missing follower_email or following_email' });
    return;
  }
  if (follower_email === following_email) {
    res.status(400).json({ error: 'Cannot follow yourself' });
    return;
  }
  
  dbHelpers.followUser(follower_email, following_email, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(result);
  });
});

app.post('/api/social/unfollow', (req, res) => {
  const { follower_email, following_email } = req.body;
  if (!follower_email || !following_email) {
    res.status(400).json({ error: 'Missing follower_email or following_email' });
    return;
  }
  
  dbHelpers.unfollowUser(follower_email, following_email, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(result);
  });
});

app.get('/api/social/followers/:email', (req, res) => {
  const email = decodeURIComponent(req.params.email);
  dbHelpers.getFollowers(email, (err, followers) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(followers);
  });
});

app.get('/api/social/following/:email', (req, res) => {
  const email = decodeURIComponent(req.params.email);
  dbHelpers.getFollowing(email, (err, following) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(following);
  });
});

app.get('/api/social/follow-status/:follower/:following', (req, res) => {
  const follower = decodeURIComponent(req.params.follower);
  const following = decodeURIComponent(req.params.following);
  dbHelpers.checkFollowStatus(follower, following, (err, status) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ isFollowing: !!status });
  });
});

app.get('/api/social/follow-counts/:email', (req, res) => {
  const email = decodeURIComponent(req.params.email);
  dbHelpers.getFollowCounts(email, (err, counts) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(counts);
  });
});

// User Profiles
app.post('/api/social/profile', (req, res) => {
  const profileData = req.body;
  if (!profileData.email) {
    res.status(400).json({ error: 'Missing email' });
    return;
  }
  
  dbHelpers.upsertUserProfile(profileData, (err, profile) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(profile);
  });
});

app.get('/api/social/profile/:email', (req, res) => {
  const email = decodeURIComponent(req.params.email);
  dbHelpers.getUserProfile(email, (err, profile) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!profile) {
      res.status(404).json({ error: 'Profile not found' });
      return;
    }
    res.json(profile);
  });
});

// Reactions
app.post('/api/social/reactions', (req, res) => {
  const { post_id, comment_id, user_email, reaction_type } = req.body;
  if (!user_email || (!post_id && !comment_id)) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }
  
  dbHelpers.addReaction({ post_id, comment_id, user_email, reaction_type }, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(result);
  });
});

app.delete('/api/social/reactions', (req, res) => {
  const { post_id, comment_id, user_email, reaction_type } = req.body;
  if (!user_email || (!post_id && !comment_id)) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }
  
  dbHelpers.removeReaction({ post_id, comment_id, user_email, reaction_type }, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(result);
  });
});

app.get('/api/social/reactions/:postId?/:commentId?', (req, res) => {
  const post_id = req.params.postId ? parseInt(req.params.postId) : null;
  const comment_id = req.params.commentId ? parseInt(req.params.commentId) : null;
  
  if (!post_id && !comment_id) {
    res.status(400).json({ error: 'Must provide post_id or comment_id' });
    return;
  }
  
  dbHelpers.getReactions(post_id, comment_id, (err, reactions) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(reactions);
  });
});

app.get('/api/social/reactions/user/:postId?/:commentId?/:userEmail', (req, res) => {
  const post_id = req.params.postId ? parseInt(req.params.postId) : null;
  const comment_id = req.params.commentId ? parseInt(req.params.commentId) : null;
  const user_email = decodeURIComponent(req.params.userEmail);
  
  dbHelpers.getUserReaction(post_id, comment_id, user_email, (err, reaction) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ reaction: reaction || null });
  });
});

// Mentions
app.post('/api/social/mentions', (req, res) => {
  const { post_id, comment_id, mentioned_email, mentioned_by_email } = req.body;
  if (!mentioned_email || !mentioned_by_email) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }
  
  dbHelpers.addMention({ post_id, comment_id, mentioned_email, mentioned_by_email }, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(result);
  });
});

app.get('/api/social/mentions/:email', (req, res) => {
  const email = decodeURIComponent(req.params.email);
  dbHelpers.getMentions(email, (err, mentions) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(mentions);
  });
});

app.put('/api/social/mentions/:id/read', (req, res) => {
  const id = parseInt(req.params.id);
  dbHelpers.markMentionAsRead(id, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(result);
  });
});

app.get('/api/social/mentions/:email/unread-count', (req, res) => {
  const email = decodeURIComponent(req.params.email);
  dbHelpers.getUnreadMentionsCount(email, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ count: result?.count || 0 });
  });
});

// ========== AI-POWERED MATCHING API ==========

app.post('/api/matching/questionnaire', (req, res) => {
  const questionnaireData = req.body;
  if (!questionnaireData.user_email) {
    res.status(400).json({ error: 'Missing user_email' });
    return;
  }
  
  dbHelpers.upsertQuestionnaire(questionnaireData, (err, questionnaire) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(questionnaire);
  });
});

app.get('/api/matching/questionnaire/:email', (req, res) => {
  const email = decodeURIComponent(req.params.email);
  dbHelpers.getQuestionnaire(email, (err, questionnaire) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(questionnaire || {});
  });
});

app.post('/api/matching/calculate', (req, res) => {
  const { user_email } = req.body;
  if (!user_email) {
    res.status(400).json({ error: 'Missing user_email' });
    return;
  }
  
  // Get user questionnaire
  dbHelpers.getQuestionnaire(user_email, (err, questionnaire) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (!questionnaire) {
      res.status(404).json({ error: 'Questionnaire not found. Please complete the questionnaire first.' });
      return;
    }
    
    // Simple matching algorithm (can be enhanced with ML)
    const schools = [
      { name: 'Seoul National University', location: 'Seoul', type: 'public', scholarship: 'high' },
      { name: 'Yonsei University', location: 'Seoul', type: 'private', scholarship: 'medium' },
      { name: 'Korea University', location: 'Seoul', type: 'private', scholarship: 'medium' },
      { name: 'Pusan National University', location: 'Busan', type: 'public', scholarship: 'high' },
      { name: 'Kyung Hee University', location: 'Seoul', type: 'private', scholarship: 'medium' },
      { name: 'Hanyang University', location: 'Seoul', type: 'private', scholarship: 'medium' },
      { name: 'Sungkyunkwan University', location: 'Seoul', type: 'private', scholarship: 'high' },
      { name: 'Ewha Womans University', location: 'Seoul', type: 'private', scholarship: 'high' }
    ];
    
    const results = schools.map(school => {
      let score = 50;
      const reasons = [];
      
      if (questionnaire.location_preference && school.location === questionnaire.location_preference) {
        score += 20;
        reasons.push('Location matches your preference');
      }
      
      if (questionnaire.university_type && school.type === questionnaire.university_type) {
        score += 15;
        reasons.push('University type matches your preference');
      }
      
      if (questionnaire.scholarship_priority > 0) {
        if (school.scholarship === 'high') {
          score += 15;
          reasons.push('High scholarship opportunities');
        } else if (school.scholarship === 'medium') {
          score += 10;
          reasons.push('Good scholarship opportunities');
        }
      }
      
      if (questionnaire.budget_range === 'low' && school.type === 'public') {
        score += 10;
        reasons.push('Public university fits your budget');
      }
      
      return {
        school_name: school.name,
        match_score: Math.min(100, score),
        match_reasons: reasons.join('; ')
      };
    }).sort((a, b) => b.match_score - a.match_score);
    
    // Save results
    const savePromises = results.map(result => {
      return new Promise((resolve, reject) => {
        dbHelpers.saveMatchingResults({
          user_email,
          school_name: result.school_name,
          match_score: result.match_score,
          match_reasons: result.match_reasons
        }, (err, saved) => {
          if (err) reject(err);
          else resolve(saved);
        });
      });
    });
    
    Promise.all(savePromises).then(() => {
      res.json({ results: results.slice(0, 5) });
    }).catch(err => {
      console.error('Error saving matching results:', err);
      res.json({ results: results.slice(0, 5) });
    });
  });
});

app.get('/api/matching/results/:email', (req, res) => {
  const email = decodeURIComponent(req.params.email);
  const limit = parseInt(req.query.limit) || 10;
  
  dbHelpers.getMatchingResults(email, limit, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

// ========== VIDEO CALL INTEGRATION API ==========

app.post('/api/video-call/bookings', (req, res) => {
  const bookingData = req.body;
  if (!bookingData.user_email || !bookingData.scheduled_time) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }
  
  const meetingId = `meeting_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const meetingUrl = bookingData.platform === 'zoom' 
    ? `https://zoom.us/j/${meetingId}`
    : `https://meet.google.com/${meetingId}`;
  
  bookingData.meeting_id = meetingId;
  bookingData.meeting_url = meetingUrl;
  bookingData.meeting_password = bookingData.meeting_password || Math.random().toString(36).substr(2, 8);
  
  dbHelpers.createVideoCallBooking(bookingData, (err, booking) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(booking);
  });
});

app.get('/api/video-call/bookings/:email', (req, res) => {
  const email = decodeURIComponent(req.params.email);
  dbHelpers.getVideoCallBookings(email, (err, bookings) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(bookings);
  });
});

app.put('/api/video-call/bookings/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const updates = req.body;
  
  dbHelpers.updateVideoCallBooking(id, updates, (err, booking) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(booking);
  });
});

app.get('/api/video-call/upcoming', (req, res) => {
  const token = req.headers['x-admin-token'];
  if (!token || token !== process.env.ADMIN_TOKEN) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  
  dbHelpers.getUpcomingVideoCalls((err, bookings) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(bookings);
  });
});

// Dynamic Sitemap
app.get('/sitemap.xml', (req, res) => {
  const baseUrl = 'https://duhocannhien.vercel.app';
  const { getVietnamTimeISO } = require('./timezone');
  const today = getVietnamTimeISO().split('T')[0];
  
  const pages = [
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/about', priority: '0.9', changefreq: 'monthly' },
    { url: '/services', priority: '0.9', changefreq: 'weekly' },
    { url: '/gallery', priority: '0.8', changefreq: 'weekly' },
    { url: '/contact', priority: '0.8', changefreq: 'monthly' },
    { url: '/blog', priority: '0.9', changefreq: 'weekly' },
    { url: '/faq', priority: '0.8', changefreq: 'monthly' },
    { url: '/testimonials', priority: '0.7', changefreq: 'monthly' },
    { url: '/calculator', priority: '0.9', changefreq: 'monthly' },
    { url: '/school-comparison', priority: '0.9', changefreq: 'weekly' },
    { url: '/quiz', priority: '0.7', changefreq: 'monthly' },
    { url: '/resources', priority: '0.8', changefreq: 'weekly' },
    { url: '/events', priority: '0.8', changefreq: 'weekly' },
    { url: '/videos', priority: '0.7', changefreq: 'weekly' },
    { url: '/recruitment', priority: '0.7', changefreq: 'monthly' },
    { url: '/ai-recommendation', priority: '0.8', changefreq: 'monthly' },
    { url: '/virtual-tour', priority: '0.7', changefreq: 'monthly' },
    { url: '/language-learning', priority: '0.7', changefreq: 'monthly' },
    { url: '/scholarship-matcher', priority: '0.8', changefreq: 'monthly' },
    { url: '/cost-comparison', priority: '0.8', changefreq: 'monthly' },
    { url: '/gallery', priority: '0.7', changefreq: 'weekly' },
    { url: '/contact', priority: '0.8', changefreq: 'monthly' },
    { url: '/blog', priority: '0.9', changefreq: 'weekly' },
    { url: '/recruitment', priority: '0.7', changefreq: 'monthly' },
    { url: '/faq', priority: '0.9', changefreq: 'weekly' },
    { url: '/testimonials', priority: '0.8', changefreq: 'weekly' },
    { url: '/calculator', priority: '0.8', changefreq: 'monthly' },
    { url: '/school-comparison', priority: '0.9', changefreq: 'monthly' },
    { url: '/quiz', priority: '0.8', changefreq: 'monthly' },
    { url: '/resources', priority: '0.8', changefreq: 'weekly' },
    { url: '/events', priority: '0.8', changefreq: 'weekly' },
    { url: '/videos', priority: '0.8', changefreq: 'weekly' },
  ];

  const blogPosts = [
    '/blog/huong-dan-du-hoc-han-quoc-2025',
    '/blog/chi-phi-du-hoc-han-quoc',
    '/blog/hoc-bong-du-hoc-han-quoc',
    '/blog/kinh-nghiem-xin-visa-han-quoc',
    '/blog/cuoc-song-du-hoc-sinh-han-quoc',
    '/blog/chon-truong-du-hoc-han-quoc',
    '/blog/top-1-cong-ty-tu-van-du-hoc-han-quoc-uy-tin-nhat-hien-nay',
    '/blog/di-du-hoc-han-quoc-co-de-khong-xu-huong-du-hoc-moi-cho-2k8',
    '/blog/8-dieu-can-biet-ve-du-hoc-han-quoc-he-visa-d2-tai-du-hoc-an-nhien',
    '/blog/dieu-kien-du-hoc-han-quoc-la-gi-chi-phi-bao-nhieu-va-nen-hoc-nganh-nao',
    '/blog/top-8-ung-dung-can-thiet-danh-cho-du-hoc-sinh-tai-han-quoc',
  ];

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
`;

  // Add main pages
  pages.forEach(page => {
    sitemap += `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
  });

  // Add blog posts
  blogPosts.forEach(post => {
    sitemap += `  <url>
    <loc>${baseUrl}${post}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
`;
  });

  sitemap += `</urlset>`;

  // Set proper headers for sitemap
  res.set({
    'Content-Type': 'application/xml; charset=utf-8',
    'Cache-Control': 'public, max-age=3600'
  });
  res.send(sitemap);
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
  const { migrateImages } = require('./scripts/migrate-urls-to-cloudinary');
  
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
  console.log(`   - GET /api/leaderboard`);
  console.log(`   - POST /api/leaderboard/sync`);
  console.log(`   - GET /api/rewards`);
  console.log(`   - POST /api/rewards/redeem`);
  
  // Initialize Cloudinary check at runtime (not during build)
  // This prevents Railway from trying to resolve secrets during build phase
  const { checkCloudinaryConfig, initCloudinary } = require('./cloudinary');
  if (checkCloudinaryConfig()) {
    initCloudinary();
  } else {
    console.log('ℹ️  Cloudinary not configured, using local storage');
  }

  // Verify tables exist (for debugging)
  setTimeout(() => {
    const { db } = require('./database');
    db.all("SELECT name FROM sqlite_master WHERE type='table' AND name IN ('rewards', 'user_points', 'redemptions')", (err, rows) => {
      if (err) {
        console.error('Error checking tables:', err.message);
      } else {
        const tableNames = rows.map(r => r.name);
        console.log('📊 Tables check:', {
          rewards: tableNames.includes('rewards') ? '✅' : '❌',
          user_points: tableNames.includes('user_points') ? '✅' : '❌',
          redemptions: tableNames.includes('redemptions') ? '✅' : '❌'
        });
        if (!tableNames.includes('rewards') || !tableNames.includes('user_points') || !tableNames.includes('redemptions')) {
          console.error('⚠️  Some tables are missing! Please restart server or run: node check-and-create-tables.js');
        }
      }
    });
  }, 2000);
});

// ==================== REWARDS API ====================

// Get all active rewards
app.get('/api/rewards', (req, res) => {
  dbHelpers.getAllRewards((err, rewards) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rewards);
  });
});

// Get reward by ID
app.get('/api/rewards/:id', (req, res) => {
  const rewardId = parseInt(req.params.id);
  dbHelpers.getRewardById(rewardId, (err, reward) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!reward) {
      res.status(404).json({ error: 'Reward not found' });
      return;
    }
    res.json(reward);
  });
});

// Redeem a reward
app.post('/api/rewards/redeem', (req, res) => {
  const { user_email, reward_id, service_data, review_data, visa_data } = req.body;

  if (!user_email || !reward_id) {
    res.status(400).json({ error: 'user_email and reward_id are required' });
    return;
  }

  // Get reward details
  dbHelpers.getRewardById(reward_id, (err, reward) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!reward) {
      res.status(404).json({ error: 'Reward not found' });
      return;
    }
    if (!reward.is_active) {
      res.status(400).json({ error: 'Reward is not available' });
      return;
    }

    // Check if user has enough points
    dbHelpers.getUserPoints(user_email, (err, userPoints) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      const currentPoints = userPoints ? userPoints.points : 0;
      if (currentPoints < reward.points_required) {
        res.status(400).json({ error: 'Not enough points to redeem this reward' });
        return;
      }

      // Generate redemption code
      const redemptionCode = `${reward.type.toUpperCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // Create redemption record
      dbHelpers.createRedemption({
        user_email,
        reward_id,
        points_used: reward.points_required,
        redemption_code: redemptionCode
      }, (err, redemption) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }

        // Handle Phase 2 rewards
        if (reward.category === 'service' && reward.type === 'service') {
          // Determine service type based on reward value
          let serviceType = 'consultation';
          if (reward.value && reward.value.includes('REVIEW')) {
            serviceType = 'review';
          } else if (reward.value && reward.value.includes('VISA')) {
            serviceType = 'visa';
          }

          if (serviceType === 'consultation' && service_data) {
            // Create service redemption
            dbHelpers.createServiceRedemption({
              redemption_id: redemption.id,
              user_email,
              service_type: reward.value,
              preferred_date: service_data.preferred_date,
              preferred_time: service_data.preferred_time,
              preferred_method: service_data.preferred_method || 'zoom',
              notes: service_data.notes
            }, (err, serviceRedemption) => {
              if (err) {
                console.error('Error creating service redemption:', err);
              }
              // Deduct points
              const newPoints = currentPoints - reward.points_required;
              const newLevel = Math.floor(newPoints / 500) + 1;
              dbHelpers.syncUserPoints(user_email, null, newPoints, newLevel, (err) => {
                if (err) console.error('Error deducting points:', err);
                res.json({
                  success: true,
                  redemption,
                  reward,
                  service_redemption: serviceRedemption,
                  message: 'Dịch vụ đã được đăng ký thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.'
                });
              });
            });
            return;
          } else if (serviceType === 'review' && review_data) {
            // Create document review
            dbHelpers.createDocumentReview({
              redemption_id: redemption.id,
              user_email,
              review_type: reward.value,
              document_url: review_data.document_url,
              document_name: review_data.document_name,
              user_notes: review_data.user_notes
            }, (err, documentReview) => {
              if (err) {
                console.error('Error creating document review:', err);
              }
              // Deduct points
              const newPoints = currentPoints - reward.points_required;
              const newLevel = Math.floor(newPoints / 500) + 1;
              dbHelpers.syncUserPoints(user_email, null, newPoints, newLevel, (err) => {
                if (err) console.error('Error deducting points:', err);
                res.json({
                  success: true,
                  redemption,
                  reward,
                  document_review: documentReview,
                  message: 'Hồ sơ đã được gửi review! Chúng tôi sẽ xem xét và phản hồi sớm nhất.'
                });
              });
            });
            return;
          } else if (serviceType === 'visa' && visa_data) {
            // Create visa support
            dbHelpers.createVisaSupport({
              redemption_id: redemption.id,
              user_email,
              support_type: reward.value,
              current_status: visa_data.current_status,
              questions: visa_data.questions,
              documents_uploaded: visa_data.documents_uploaded
            }, (err, visaSupport) => {
              if (err) {
                console.error('Error creating visa support:', err);
              }
              // Deduct points
              const newPoints = currentPoints - reward.points_required;
              const newLevel = Math.floor(newPoints / 500) + 1;
              dbHelpers.syncUserPoints(user_email, null, newPoints, newLevel, (err) => {
                if (err) console.error('Error deducting points:', err);
                res.json({
                  success: true,
                  redemption,
                  reward,
                  visa_support: visaSupport,
                  message: 'Yêu cầu hỗ trợ visa đã được gửi! Chúng tôi sẽ liên hệ với bạn sớm nhất.'
                });
              });
            });
            return;
          }
        }

        // For Phase 1 rewards (voucher, document, access)
        // Deduct points
        const newPoints = currentPoints - reward.points_required;
        const newLevel = Math.floor(newPoints / 500) + 1;
        dbHelpers.syncUserPoints(user_email, null, newPoints, newLevel, (err) => {
          if (err) console.error('Error deducting points:', err);
          res.json({
            success: true,
            redemption,
            reward,
            message: 'Reward redeemed successfully! Check your email for details.'
          });
        });
      });
    });
  });
});

// Get user's redemption history
app.get('/api/rewards/redemptions/:email', (req, res) => {
  const user_email = decodeURIComponent(req.params.email);
  if (!user_email || !user_email.includes('@')) {
    res.status(400).json({ error: 'Invalid email address' });
    return;
  }
  dbHelpers.getUserRedemptions(user_email, (err, redemptions) => {
    if (err) {
      console.error('Error getting user redemptions:', err);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(redemptions || []);
  });
});

// Update redemption status (admin only)
app.put('/api/rewards/redemptions/:id/status', (req, res) => {
  const token = req.headers['x-admin-token'];
  if (!token || token !== process.env.ADMIN_TOKEN) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const { status } = req.body;
  const redemptionId = parseInt(req.params.id);

  if (!status || !['pending', 'completed', 'cancelled'].includes(status)) {
    res.status(400).json({ error: 'Invalid status. Must be: pending, completed, or cancelled' });
    return;
  }

  dbHelpers.updateRedemptionStatus(redemptionId, status, (err, redemption) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ success: true, redemption });
  });
});

// ==================== LEADERBOARD API ====================

// Sync user points to database
app.post('/api/leaderboard/sync', (req, res) => {
  const { user_email, user_name, points, level } = req.body;

  if (!user_email || points === undefined) {
    res.status(400).json({ error: 'user_email and points are required' });
    return;
  }

  dbHelpers.upsertUserPoints({
    user_email,
    user_name: user_name || null,
    points: parseInt(points),
    level: parseInt(level) || 1
  }, (err, userPoints) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ success: true, userPoints });
  });
});

// Get leaderboard
app.get('/api/leaderboard', (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  console.log(`📊 Fetching leaderboard with limit: ${limit}`);
  dbHelpers.getLeaderboard(limit, (err, leaderboard) => {
    if (err) {
      console.error('❌ Error fetching leaderboard:', err);
      res.status(500).json({ error: err.message });
      return;
    }
    console.log(`✅ Leaderboard returned ${leaderboard?.length || 0} users`);
    res.json(leaderboard || []);
  });
});

// Get user rank
app.get('/api/leaderboard/rank/:email', (req, res) => {
  const user_email = decodeURIComponent(req.params.email);
  if (!user_email || !user_email.includes('@')) {
    res.status(400).json({ error: 'Invalid email address' });
    return;
  }
  dbHelpers.getUserRank(user_email, (err, rankData) => {
    if (err) {
      console.error('Error getting user rank:', err);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rankData || { rank: null, total_users: 0 });
  });
});

// ==================== ADMIN USER MANAGEMENT API ====================
// Get all users (admin only)
app.get('/api/admin/users', (req, res) => {
  const token = req.headers['x-admin-token'];
  if (!token || token !== process.env.ADMIN_TOKEN) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  dbHelpers.getAllUsers((err, users) => {
    if (err) {
      console.error('Error fetching users:', err);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(users || []);
  });
});

// Update user points (admin only)
app.put('/api/admin/users/:email/points', (req, res) => {
  const token = req.headers['x-admin-token'];
  if (!token || token !== process.env.ADMIN_TOKEN) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const user_email = decodeURIComponent(req.params.email);
  const { points, level } = req.body;

  if (points === undefined || level === undefined) {
    res.status(400).json({ error: 'Points and level are required' });
    return;
  }

  dbHelpers.updateUserPoints(user_email, parseInt(points), parseInt(level), (err, user) => {
    if (err) {
      console.error('Error updating user points:', err);
      res.status(500).json({ error: err.message });
      return;
    }
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json(user);
  });
});

// Delete user (admin only)
app.delete('/api/admin/users/:email', (req, res) => {
  const token = req.headers['x-admin-token'];
  if (!token || token !== process.env.ADMIN_TOKEN) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const user_email = decodeURIComponent(req.params.email);
  dbHelpers.deleteUser(user_email, (err, result) => {
    if (err) {
      console.error('Error deleting user:', err);
      res.status(500).json({ error: err.message });
      return;
    }
    if (!result || !result.deleted) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json({ success: true, message: 'User deleted successfully' });
  });
});

