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
const dbModule = require(
  process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN 
    ? './database-turso' 
    : './database'
);
const { dbHelpers } = dbModule;
// Get db instance if available (for direct queries)
const db = dbModule.db || null;
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

// ==================== USER AUTHENTICATION SETUP ====================
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const emailService = require('./email-service');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_change_in_production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Middleware to verify user JWT token
const verifyUserToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1]; // Expects "Bearer TOKEN"
  if (!token) {
    return res.status(401).json({ error: 'Token format is "Bearer <token>"' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('JWT verification error:', err.message);
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    
    // Check if user still exists in database (user may have been deleted)
    dbHelpers.getUserByEmail(decoded.email, (dbErr, user) => {
      if (dbErr) {
        console.error('Error checking user existence:', dbErr);
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (!user) {
        console.log(`🚫 User ${decoded.email} has been deleted, rejecting token`);
        return res.status(403).json({ 
          error: 'User account has been deleted',
          account_deleted: true
        });
      }
      
      req.user = decoded; // Attach decoded user info (e.g., email) to request
      req.userEmail = decoded.email; // For convenience
      next();
    });
  });
};

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
      console.log('⚠️ CORS: Unknown origin:', origin);
      console.log('📋 Allowed origins:', allowedOrigins);
      // Allow anyway for now to prevent CORS issues
      console.log('✅ CORS: Allowing anyway');
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-token', 'x-user-token', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Type'],
  maxAge: 86400 // 24 hours
}));

// Handle preflight requests explicitly for all routes
app.options('*', (req, res) => {
  const origin = req.headers.origin;
  console.log('🔍 Preflight request from origin:', origin);
  if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
    res.header('Access-Control-Allow-Origin', origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-token, x-user-token, X-Requested-With, Accept');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Max-Age', '86400');
    console.log('✅ Preflight allowed for:', origin);
    res.sendStatus(200);
  } else {
    // Allow anyway for debugging
    console.log('⚠️ Preflight: Allowing anyway for debugging');
    res.header('Access-Control-Allow-Origin', origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-token, x-user-token, X-Requested-With, Accept');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.sendStatus(200);
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

// ==================== USER AUTHENTICATION ENDPOINTS ====================
// User Registration
app.post('/api/auth/register', async (req, res) => {
  const { email, password, name } = req.body;

  console.log('📝 Registration attempt:', { email, hasPassword: !!password, passwordLength: password?.length, name });

  if (!email || !password) {
    console.log('❌ Missing email or password');
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.log('❌ Invalid email format:', email);
    return res.status(400).json({ error: 'Invalid email format' });
  }

  if (password.length < 6) {
    console.log('❌ Password too short:', password.length);
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  // Check if user already exists
  dbHelpers.getUserByEmail(email, async (err, existingUser) => {
    if (err) {
      console.error('Error checking existing user:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (existingUser) {
      console.log('❌ Email already registered:', email, 'Verified:', existingUser.email_verified);
      
      // If email is not verified, allow resending verification
      if (!existingUser.email_verified) {
        return res.status(400).json({ 
          error: 'Email already registered but not verified',
          email_verified: false,
          can_resend: true,
          message: 'Email này đã được đăng ký nhưng chưa được xác thực. Vui lòng kiểm tra email hoặc yêu cầu gửi lại email xác thực.'
        });
      }
      
      return res.status(400).json({ 
        error: 'Email already registered',
        email_verified: true,
        message: 'Email này đã được đăng ký. Vui lòng đăng nhập thay vì đăng ký mới.'
      });
    }

    console.log('✅ Email available, proceeding with registration');

    // Hash password
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, (err, passwordHash) => {
      if (err) {
        console.error('Error hashing password:', err);
        return res.status(500).json({ error: 'Error creating account' });
      }

      // Generate verification token
      const verificationToken = crypto.randomBytes(32).toString('hex');

      // Create user
      dbHelpers.createUser(email, passwordHash, verificationToken, async (err, userId) => {
        if (err) {
          console.error('Error creating user:', err);
          return res.status(500).json({ error: 'Error creating account' });
        }

        // Update display name if provided
        if (name) {
          dbHelpers.updateUserDisplayName(email, name, (err) => {
            if (err) console.error('Error updating display name:', err);
          });
        }

        // Send verification email
        const frontendUrl = process.env.FRONTEND_URL || 'https://duhocannhien.vercel.app';
        const verificationLink = `${frontendUrl}/verify-email?token=${verificationToken}&email=${encodeURIComponent(email)}`;

        const emailResult = await emailService.sendEmail(
          email,
          'Xác thực email - Du học An Nhiên',
          `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <h2 style="color: #667eea;">Xác thực email của bạn</h2>
              <p>Xin chào ${name || email},</p>
              <p>Cảm ơn bạn đã đăng ký tài khoản tại Du học An Nhiên!</p>
              <p>Vui lòng click vào nút bên dưới để xác thực email của bạn:</p>
              <p style="text-align: center; margin: 20px 0;">
                <a href="${verificationLink}" style="background-color: #667eea; color: white; padding: 12px 25px; border-radius: 5px; text-decoration: none; font-weight: bold;">
                  Xác thực email
                </a>
              </p>
              <p>Hoặc copy link này vào trình duyệt:</p>
              <p><a href="${verificationLink}">${verificationLink}</a></p>
              <p>Link này sẽ hết hạn sau 24 giờ.</p>
              <p>Nếu bạn không đăng ký tài khoản này, vui lòng bỏ qua email này.</p>
              <p>Trân trọng,<br/>Đội ngũ Du học An Nhiên</p>
            </div>
          `,
          `Xác thực email của bạn\n\nVui lòng truy cập link sau để xác thực:\n${verificationLink}`
        );

        // Registration successful regardless of email status
        if (!emailResult.success) {
          console.warn('⚠️ Failed to send verification email:', emailResult.error);
          console.warn('⚠️ User account created successfully. Email can be resent later.');
          
          res.status(201).json({
            success: true,
            message: 'Đăng ký thành công! Tuy nhiên, email xác thực chưa được gửi. Bạn có thể yêu cầu gửi lại email xác thực sau.',
            email_sent: false,
            can_resend: true,
            user: {
              email,
              email_verified: false
            }
          });
        } else {
          console.log('✅ Verification email sent successfully');
          res.status(201).json({
            success: true,
            message: 'Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.',
            email_sent: true,
            user: {
              email,
              email_verified: false
            }
          });
        }
      });
    });
  });
});

// User Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // Get user from database
  dbHelpers.getUserByEmail(email, (err, user) => {
    if (err) {
      console.error('Error getting user:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify password
    bcrypt.compare(password, user.password_hash, (err, isMatch) => {
      if (err) {
        console.error('Error comparing password:', err);
        return res.status(500).json({ error: 'Error verifying password' });
      }

      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Check if email is verified (can be disabled via env var for testing)
      // Default: allow login without verification (for testing when email service is down)
      const requireEmailVerification = process.env.REQUIRE_EMAIL_VERIFICATION === 'true';
      
      if (!user.email_verified && requireEmailVerification) {
        console.log('⚠️ Login blocked: Email not verified for', email);
        return res.status(403).json({ 
          error: 'Email chưa được xác thực. Vui lòng kiểm tra email và click vào link xác thực.',
          email_verified: false
        });
      }
      
      if (!user.email_verified && !requireEmailVerification) {
        console.log('⚠️ Login allowed without email verification (email service may be unavailable)');
      }

      // Update last login
      dbHelpers.updateUserLastLogin(email, (err) => {
        if (err) console.error('Error updating last login:', err);
      });

      // Generate JWT token
      const token = jwt.sign(
        { email: user.email, userId: user.id },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      res.json({
        success: true,
        token,
        user: {
          email: user.email,
          display_name: user.display_name,
          email_verified: user.email_verified,
          userId: user.id
        }
      });
    });
  });
});

// Email Verification
app.get('/api/auth/verify', (req, res) => {
  const { token, email } = req.query;

  if (!token || !email) {
    return res.status(400).json({ error: 'Token and email are required' });
  }

  // Get user from database
  dbHelpers.getUserByEmail(email, (err, user) => {
    if (err) {
      console.error('Error getting user:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if already verified
    if (user.email_verified) {
      return res.json({ 
        success: true, 
        message: 'Email đã được xác thực rồi.',
        already_verified: true
      });
    }

    // Verify token
    if (user.verification_token !== token) {
      return res.status(400).json({ error: 'Invalid or expired verification token' });
    }

    // Verify email
    dbHelpers.verifyUserEmail(email, (err) => {
      if (err) {
        console.error('Error verifying email:', err);
        return res.status(500).json({ error: 'Error verifying email' });
      }

      res.json({
        success: true,
        message: 'Email đã được xác thực thành công! Bạn có thể đăng nhập ngay.'
      });
    });
  });
});

// Verify JWT Token (for frontend to check if token is still valid)
app.get('/api/auth/verify-token', verifyUserToken, (req, res) => {
  res.json({
    valid: true,
    user: {
      email: req.user.email,
      userId: req.user.userId
    }
  });
});

// Resend Verification Email
app.post('/api/auth/resend-verification', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  // Get user from database
  dbHelpers.getUserByEmail(email, async (err, user) => {
    if (err) {
      console.error('Error getting user:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.email_verified) {
      return res.json({ 
        success: true, 
        message: 'Email đã được xác thực rồi.',
        already_verified: true
      });
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Update verification token in database first
    dbHelpers.updateUserVerificationToken(email, verificationToken, async (err) => {
      if (err) {
        console.error('Error updating verification token:', err);
        return res.status(500).json({ error: 'Error updating verification token' });
      }

      console.log('✅ Verification token updated for:', email);

      const frontendUrl = process.env.FRONTEND_URL || 'https://duhocannhien.vercel.app';
      const verificationLink = `${frontendUrl}/verify-email?token=${verificationToken}&email=${encodeURIComponent(email)}`;

      const emailResult = await emailService.sendEmail(
        email,
        'Xác thực email - Du học An Nhiên',
        `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #667eea;">Xác thực email của bạn</h2>
            <p>Xin chào ${user.display_name || email},</p>
            <p>Bạn đã yêu cầu gửi lại email xác thực.</p>
            <p>Vui lòng click vào nút bên dưới để xác thực email của bạn:</p>
            <p style="text-align: center; margin: 20px 0;">
              <a href="${verificationLink}" style="background-color: #667eea; color: white; padding: 12px 25px; border-radius: 5px; text-decoration: none; font-weight: bold;">
                Xác thực email
              </a>
            </p>
            <p>Hoặc copy link này vào trình duyệt:</p>
            <p><a href="${verificationLink}">${verificationLink}</a></p>
            <p>Link này sẽ hết hạn sau 24 giờ.</p>
            <p>Nếu bạn không yêu cầu email này, vui lòng bỏ qua.</p>
            <p>Trân trọng,<br/>Đội ngũ Du học An Nhiên</p>
          </div>
        `,
        `Xác thực email của bạn\n\nVui lòng truy cập link sau để xác thực:\n${verificationLink}`
      );

      if (!emailResult.success) {
        console.warn('⚠️ Failed to send verification email:', emailResult.error);
        // Still return success - token is updated, user can try again later
        return res.json({
          success: true,
          email_sent: false,
          message: 'Token đã được cập nhật nhưng email chưa được gửi do lỗi kết nối. Bạn có thể thử lại sau hoặc liên hệ hỗ trợ.',
          error: emailResult.error
        });
      }

      console.log('✅ Verification email resent successfully');
      res.json({
        success: true,
        email_sent: true,
        message: 'Email xác thực đã được gửi lại. Vui lòng kiểm tra hộp thư của bạn.'
      });
    });
  });
});

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

// Configure multer for resource file uploads
const resourceStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, resourcesDir);
  },
  filename: (req, file, cb) => {
    // Use original filename to match RESOURCE_FILES mapping
    cb(null, file.originalname);
  }
});

const resourceUpload = multer({
  storage: resourceStorage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit for PDF/DOCX files
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = file.mimetype === 'application/pdf' || 
                     file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận file PDF hoặc DOCX'));
    }
  }
});

// Resources downloads routes
// Test route to verify endpoint is accessible
app.get('/api/resources/test', (req, res) => {
  console.log('✅ [TEST] GET /api/resources/test called');
  res.json({ message: 'Resources endpoint is working', timestamp: new Date().toISOString() });
});

// Upload resource file (Admin only)
app.post('/api/admin/resources/upload', (req, res) => {
  const token = req.headers['x-admin-token'];
  if (!token || token !== process.env.ADMIN_TOKEN) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  resourceUpload.single('file')(req, res, (err) => {
    if (err) {
      console.error('❌ Error uploading resource file:', err);
      res.status(400).json({ error: err.message });
      return;
    }

    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    console.log('✅ Resource file uploaded:', {
      filename: req.file.filename,
      originalname: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      path: req.file.path
    });

    res.json({
      message: 'File uploaded successfully',
      filename: req.file.filename,
      size: req.file.size,
      path: req.file.path
    });
  });
});

// POST route for downloading resources
app.post('/api/resources/download', (req, res) => {
  console.log('📥 [DEBUG] POST /api/resources/download called - ENTERING HANDLER');
  console.log('📥 [DEBUG] Request URL:', req.url);
  console.log('📥 [DEBUG] Request path:', req.path);
  console.log('📥 [DEBUG] Request method:', req.method);
  console.log('📥 [DEBUG] Request headers:', req.headers);
  console.log('📥 [DEBUG] Request body:', req.body);
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
  
  console.log('📥 [DEBUG] Resource ID:', resourceId);
  console.log('📥 [DEBUG] Resource file mapping:', resourceFile);
  
  if (!resourceFile) {
    console.log('❌ [DEBUG] Resource not found in RESOURCE_FILES');
    res.status(404).json({ error: 'Resource not found' });
    return;
  }

  const filePath = path.join(resourcesDir, resourceFile.filename);
  console.log('📥 [DEBUG] File path:', filePath);
  console.log('📥 [DEBUG] Resources directory:', resourcesDir);
  
  // Check if file exists
  const fileExists = fs.existsSync(filePath);
  console.log('📥 [DEBUG] File exists:', fileExists);
  
  if (!fileExists) {
    console.log('❌ [DEBUG] File does not exist at path:', filePath);
    // Record download attempt even if file doesn't exist
    dbHelpers.recordResourceDownload({ email, resource_id, resource_title }, (err, download) => {
      if (err) {
        console.error('❌ [DEBUG] Error recording download:', err);
        res.status(500).json({ error: err.message });
        return;
      }
      console.log('⚠️ [DEBUG] Returning 404 - File not found response');
      res.status(404).json({ 
        error: 'File not found',
        message: `File ${resourceFile.filename} does not exist. Please upload the file to server/uploads/resources/`,
        file_path: filePath,
        download_id: download ? download.id : null
      });
    });
    return;
  }

  // Record download
  console.log('📥 [DEBUG] Recording download in database...');
  dbHelpers.recordResourceDownload({ email, resource_id, resource_title }, (err, download) => {
    if (err) {
      console.error('❌ [DEBUG] Database error:', err);
      res.status(500).json({ error: err.message });
      return;
    }
    
    console.log('✅ [DEBUG] Download recorded in database:', download);
    
    // Determine content type based on file extension
    const ext = path.extname(resourceFile.filename).toLowerCase();
    let contentType = 'application/octet-stream';
    if (ext === '.pdf') {
      contentType = 'application/pdf';
    } else if (ext === '.docx') {
      contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    }
    
    console.log('📥 [DEBUG] Content type:', contentType);
    console.log('📥 [DEBUG] Sending file:', filePath);
    
    // Send file with proper headers
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(resourceFile.name)}"`);
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error('❌ [DEBUG] Error sending file:', err);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Error sending file' });
        }
      } else {
        console.log('✅ [DEBUG] File sent successfully');
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
  const { category, type, limit, offset, sort, author_email } = req.query;
  dbHelpers.getAllPosts({ 
    author_email: author_email ? decodeURIComponent(author_email) : null,
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
app.post('/api/community/posts', verifyUserToken, (req, res) => {
  const { author_name, title, content, category, tags, type } = req.body;
  const author_email = req.userEmail; // Use authenticated user's email
  
  if (!title || !content) {
    res.status(400).json({ error: 'Title and content are required' });
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
app.post('/api/community/posts/:id/comments', verifyUserToken, (req, res) => {
  const postId = parseInt(req.params.id);
  const { author_name, content } = req.body;
  const author_email = req.userEmail; // Use authenticated user's email
  
  if (!content) {
    res.status(400).json({ error: 'Content is required' });
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
app.post('/api/community/likes', verifyUserToken, (req, res) => {
  const { post_id, comment_id } = req.body;
  const user_email = req.userEmail; // Use authenticated user's email
  
  if (!post_id && !comment_id) {
    res.status(400).json({ error: 'post_id or comment_id is required' });
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
app.post('/api/social/follow', verifyUserToken, (req, res) => {
  const { following_email } = req.body;
  const follower_email = req.userEmail; // Use authenticated user's email
  
  if (!following_email) {
    res.status(400).json({ error: 'Missing following_email' });
    return;
  }

  if (follower_email === following_email) {
    res.status(400).json({ error: 'Cannot follow yourself' });
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

app.post('/api/social/unfollow', verifyUserToken, (req, res) => {
  const { following_email } = req.body;
  const follower_email = req.userEmail; // Use authenticated user's email
  
  if (!following_email) {
    res.status(400).json({ error: 'Missing following_email' });
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

// Search user by email - Public endpoint to find users
app.get('/api/social/search/user', (req, res) => {
  const email = req.query.email;
  
  if (!email || !email.trim()) {
    return res.status(400).json({ error: 'Email parameter is required' });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  const searchEmail = email.trim().toLowerCase();

  // Get user basic info
  dbHelpers.getUserByEmail(searchEmail, (err, user) => {
    if (err) {
      console.error('Error searching user:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user profile if exists
    dbHelpers.getUserProfile(searchEmail, (err, profile) => {
      if (err) {
        console.error('Error getting user profile:', err);
      }

      // Return public user info (don't expose password or sensitive data)
      const publicUserInfo = {
        email: user.email,
        name: profile?.name || user.email.split('@')[0],
        avatar: profile?.avatar || null,
        bio: profile?.bio || null,
        created_at: user.created_at,
        email_verified: user.email_verified || false,
        // Don't expose: password_hash, verification_token, etc.
      };

      res.json(publicUserInfo);
    });
  });
});

// Reactions
app.post('/api/social/reactions', verifyUserToken, (req, res) => {
  const { post_id, comment_id, reaction_type } = req.body;
  const user_email = req.userEmail; // Use authenticated user's email
  
  if (!post_id && !comment_id) {
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

app.delete('/api/social/reactions', verifyUserToken, (req, res) => {
  const { post_id, comment_id, reaction_type } = req.body;
  const user_email = req.userEmail; // Use authenticated user's email
  
  if (!post_id && !comment_id) {
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
    
    // Enhanced matching algorithm with comprehensive school database
    const schools = [
      { 
        name: 'Seoul National University', 
        location: 'Seoul', 
        type: 'public', 
        scholarship: 'high',
        ranking: 1,
        majors: ['Kinh tế', 'Kỹ thuật', 'Y tế', 'Nhân văn', 'Luật'],
        languageRequirement: 'high',
        tuition: 'high',
        accommodation: 'available'
      },
      { 
        name: 'Yonsei University', 
        location: 'Seoul', 
        type: 'private', 
        scholarship: 'high',
        ranking: 2,
        majors: ['Kinh tế', 'Kỹ thuật', 'Y tế', 'Nghệ thuật', 'Nhân văn'],
        languageRequirement: 'high',
        tuition: 'very_high',
        accommodation: 'available'
      },
      { 
        name: 'Korea University', 
        location: 'Seoul', 
        type: 'private', 
        scholarship: 'high',
        ranking: 3,
        majors: ['Kinh tế', 'Kỹ thuật', 'Luật', 'Nhân văn'],
        languageRequirement: 'high',
        tuition: 'very_high',
        accommodation: 'available'
      },
      { 
        name: 'Pusan National University', 
        location: 'Busan', 
        type: 'public', 
        scholarship: 'high',
        ranking: 4,
        majors: ['Kinh tế', 'Kỹ thuật', 'Y tế', 'Nhân văn'],
        languageRequirement: 'medium',
        tuition: 'medium',
        accommodation: 'available'
      },
      { 
        name: 'Kyung Hee University', 
        location: 'Seoul', 
        type: 'private', 
        scholarship: 'medium',
        ranking: 5,
        majors: ['Kinh tế', 'Kỹ thuật', 'Y tế', 'Nghệ thuật'],
        languageRequirement: 'medium',
        tuition: 'high',
        accommodation: 'available'
      },
      { 
        name: 'Hanyang University', 
        location: 'Seoul', 
        type: 'private', 
        scholarship: 'medium',
        ranking: 6,
        majors: ['Kỹ thuật', 'Kinh tế', 'Nghệ thuật'],
        languageRequirement: 'medium',
        tuition: 'high',
        accommodation: 'limited'
      },
      { 
        name: 'Sungkyunkwan University', 
        location: 'Seoul', 
        type: 'private', 
        scholarship: 'high',
        ranking: 7,
        majors: ['Kinh tế', 'Kỹ thuật', 'Y tế', 'Luật'],
        languageRequirement: 'high',
        tuition: 'very_high',
        accommodation: 'available'
      },
      { 
        name: 'Ewha Womans University', 
        location: 'Seoul', 
        type: 'private', 
        scholarship: 'high',
        ranking: 8,
        majors: ['Kinh tế', 'Y tế', 'Nghệ thuật', 'Nhân văn'],
        languageRequirement: 'high',
        tuition: 'high',
        accommodation: 'available'
      },
      { 
        name: 'Sogang University', 
        location: 'Seoul', 
        type: 'private', 
        scholarship: 'medium',
        ranking: 9,
        majors: ['Kinh tế', 'Nhân văn', 'Nghệ thuật'],
        languageRequirement: 'medium',
        tuition: 'high',
        accommodation: 'limited'
      },
      { 
        name: 'Inha University', 
        location: 'Incheon', 
        type: 'private', 
        scholarship: 'medium',
        ranking: 10,
        majors: ['Kỹ thuật', 'Kinh tế'],
        languageRequirement: 'medium',
        tuition: 'medium',
        accommodation: 'available'
      },
      { 
        name: 'Chung-Ang University', 
        location: 'Seoul', 
        type: 'private', 
        scholarship: 'medium',
        ranking: 11,
        majors: ['Nghệ thuật', 'Kinh tế', 'Y tế'],
        languageRequirement: 'medium',
        tuition: 'high',
        accommodation: 'limited'
      },
      { 
        name: 'Hankuk University of Foreign Studies', 
        location: 'Seoul', 
        type: 'private', 
        scholarship: 'medium',
        ranking: 12,
        majors: ['Nhân văn', 'Kinh tế'],
        languageRequirement: 'high',
        tuition: 'high',
        accommodation: 'available'
      }
    ];
    
    const results = schools.map(school => {
      let score = 40; // Base score
      const reasons = [];
      const weights = {
        location: 25,
        type: 20,
        scholarship: 20,
        major: 15,
        budget: 15,
        language: 10,
        ranking: 5
      };
      
      // Location matching (25 points)
      if (questionnaire.location_preference) {
        if (school.location === questionnaire.location_preference) {
          score += weights.location;
          reasons.push(`📍 Địa điểm: ${school.location} phù hợp với sở thích của bạn`);
        } else if (questionnaire.location_preference === 'Other' && school.location !== 'Seoul') {
          score += weights.location * 0.7;
          reasons.push(`📍 Địa điểm: ${school.location} - thành phố khác với chi phí hợp lý hơn`);
        }
      }
      
      // University type matching (20 points)
      if (questionnaire.university_type && school.type === questionnaire.university_type) {
        score += weights.type;
        reasons.push(`🏛️ Loại trường: ${school.type === 'public' ? 'Công lập' : 'Tư thục'} phù hợp`);
      }
      
      // Scholarship priority (20 points)
      if (questionnaire.scholarship_priority > 0) {
        const scholarshipWeight = weights.scholarship * (questionnaire.scholarship_priority / 5);
        if (school.scholarship === 'high') {
          score += scholarshipWeight;
          reasons.push(`💰 Học bổng: Nhiều cơ hội học bổng cao`);
        } else if (school.scholarship === 'medium') {
          score += scholarshipWeight * 0.6;
          reasons.push(`💰 Học bổng: Có cơ hội học bổng tốt`);
        }
      }
      
      // Major matching (15 points)
      if (questionnaire.major && school.majors.includes(questionnaire.major)) {
        score += weights.major;
        reasons.push(`📚 Ngành học: Có chương trình ${questionnaire.major} chất lượng cao`);
      }
      
      // Budget matching (15 points)
      if (questionnaire.budget_range) {
        if (questionnaire.budget_range === 'low') {
          if (school.type === 'public' || school.tuition === 'medium') {
            score += weights.budget;
            reasons.push(`💵 Chi phí: Phù hợp với ngân sách hạn chế`);
          }
        } else if (questionnaire.budget_range === 'medium') {
          if (school.tuition === 'medium' || school.tuition === 'high') {
            score += weights.budget * 0.8;
            reasons.push(`💵 Chi phí: Phù hợp với ngân sách trung bình`);
          }
        } else if (questionnaire.budget_range === 'high') {
          score += weights.budget * 0.9; // High budget can afford any school
          reasons.push(`💵 Chi phí: Phù hợp với ngân sách`);
        }
      }
      
      // Language requirement matching (10 points)
      if (questionnaire.language_level) {
        if (questionnaire.language_level === 'beginner' && school.languageRequirement === 'medium') {
          score += weights.language;
          reasons.push(`🗣️ Ngôn ngữ: Yêu cầu tiếng Hàn vừa phải, phù hợp với trình độ của bạn`);
        } else if (questionnaire.language_level === 'intermediate' && 
                   (school.languageRequirement === 'medium' || school.languageRequirement === 'high')) {
          score += weights.language;
          reasons.push(`🗣️ Ngôn ngữ: Yêu cầu tiếng Hàn phù hợp với trình độ của bạn`);
        } else if (questionnaire.language_level === 'advanced' && school.languageRequirement === 'high') {
          score += weights.language;
          reasons.push(`🗣️ Ngôn ngữ: Yêu cầu tiếng Hàn cao, phù hợp với trình độ của bạn`);
        }
      }
      
      // Ranking bonus (5 points)
      if (school.ranking <= 5) {
        score += weights.ranking;
        reasons.push(`⭐ Xếp hạng: Top ${school.ranking} trường đại học Hàn Quốc`);
      } else if (school.ranking <= 10) {
        score += weights.ranking * 0.6;
        reasons.push(`⭐ Xếp hạng: Top ${school.ranking} trường đại học Hàn Quốc`);
      }
      
      // Accommodation preference
      if (questionnaire.accommodation_preference && school.accommodation === 'available') {
        score += 5;
        reasons.push(`🏠 Ký túc xá: Có ký túc xá cho sinh viên quốc tế`);
      }
      
      return {
        school_name: school.name,
        match_score: Math.min(100, Math.round(score)),
        match_reasons: reasons.join('; ')
      };
    }).sort((a, b) => {
      // Sort by score first, then by school name for consistency
      if (b.match_score !== a.match_score) {
        return b.match_score - a.match_score;
      }
      return a.school_name.localeCompare(b.school_name);
    });
    
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

const videoCallIntegration = require('./video-call-integration');

app.post('/api/video-call/bookings', async (req, res) => {
  const bookingData = req.body;
  if (!bookingData.user_email || !bookingData.scheduled_time) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }
  
  try {
    // Calculate end time
    const startTime = new Date(bookingData.scheduled_time);
    const duration = bookingData.duration || 30;
    const endTime = new Date(startTime.getTime() + duration * 60000);
    
    // Create meeting via API integration
    const platform = bookingData.platform || 'webrtc';
    
    // If WebRTC, just generate a room ID (no external API needed)
    if (platform === 'webrtc') {
      const roomId = `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      bookingData.meeting_id = roomId;
      bookingData.meeting_url = `${process.env.FRONTEND_URL || 'https://duhocannhien.vercel.app'}/video-call?room=${roomId}`;
      bookingData.meeting_password = null;
      
      dbHelpers.createVideoCallBooking(bookingData, (err, booking) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json(booking);
      });
      return;
    }
    
    const meetingData = {
      topic: `${bookingData.call_type || 'Consultation'} - ${bookingData.user_name || bookingData.user_email}`,
      summary: `${bookingData.call_type || 'Consultation'} - ${bookingData.user_name || bookingData.user_email}`,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      duration: duration,
      timezone: bookingData.timezone || 'Asia/Ho_Chi_Minh',
      password: bookingData.meeting_password,
      description: bookingData.notes || '',
      settings: {
        host_video: true,
        participant_video: true
      }
    };

    let meetingInfo;
    try {
      meetingInfo = await videoCallIntegration.createMeeting(platform, meetingData);
    } catch (apiError) {
      console.warn('API integration failed, using fallback:', apiError.message);
      // Fallback to mock meeting
      meetingInfo = videoCallIntegration.createMockMeeting(platform, meetingData);
    }

    // Merge meeting info into booking data
    bookingData.meeting_id = meetingInfo.meeting_id;
    bookingData.meeting_url = meetingInfo.meeting_url;
    bookingData.meeting_password = meetingInfo.meeting_password || bookingData.meeting_password;
    
    dbHelpers.createVideoCallBooking(bookingData, (err, booking) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(booking);
    });
  } catch (error) {
    console.error('Error creating video call booking:', error);
    res.status(500).json({ error: error.message || 'Failed to create video call booking' });
  }
});

app.get('/api/video-call/config', (req, res) => {
  res.json({
    zoom: {
      configured: videoCallIntegration.isConfigured('zoom'),
      instructions: videoCallIntegration.isConfigured('zoom') 
        ? 'Zoom API is configured' 
        : 'Set ZOOM_API_KEY, ZOOM_API_SECRET, and optionally ZOOM_ACCOUNT_ID environment variables'
    },
    googleMeet: {
      configured: videoCallIntegration.isConfigured('google-meet'),
      instructions: videoCallIntegration.isConfigured('google-meet')
        ? 'Google Meet API is configured'
        : 'Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REFRESH_TOKEN environment variables'
    }
  });
});

// Send video call invitation
app.post('/api/video-call/invite', async (req, res) => {
  const { roomId, roomLink, callerEmail, callerName, recipientEmail, recipientName } = req.body;
  
  if (!roomId || !roomLink || !callerEmail || !recipientEmail) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }
  
  console.log('📞 Video Call Invitation:', {
    roomId,
    roomLink,
    caller: { email: callerEmail, name: callerName },
    recipient: { email: recipientEmail, name: recipientName },
    timestamp: new Date().toISOString()
  });
  
  // Send email notification
  if (emailService.isEmailConfigured()) {
    try {
      await emailService.sendVideoCallInvite({
        recipientEmail,
        recipientName,
        callerEmail,
        callerName,
        roomLink,
        roomId
      });
      
      res.json({ 
        success: true, 
        message: 'Email invitation sent successfully',
        roomLink,
        roomId,
        emailSent: true
      });
    } catch (error) {
      console.error('Error sending email:', error);
      // Still return success with link, but log the error
      res.json({ 
        success: true, 
        message: 'Invitation created. Email sending failed, but you can share the link manually.',
        roomLink,
        roomId,
        emailSent: false,
        error: error.message
      });
    }
  } else {
    // Email not configured, just return the link
    console.warn('⚠️ Email service not configured. Please set up email environment variables.');
    res.json({ 
      success: true, 
      message: 'Invitation created. Email service not configured. Please share the link manually.',
      roomLink,
      roomId,
      emailSent: false,
      emailConfigured: false
    });
  }
});

app.get('/api/video-call/bookings/:email', verifyUserToken, (req, res) => {
  const email = decodeURIComponent(req.params.email);
  
  // Verify that the requested email matches the authenticated user
  if (req.userEmail !== email) {
    return res.status(403).json({ error: 'Unauthorized: Cannot access other user\'s bookings' });
  }
  
  dbHelpers.getVideoCallBookings(email, (err, bookings) => {
    if (err) {
      console.error('Error getting video call bookings:', err);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(bookings || []);
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

const http = require('http');
const server = http.createServer(app);

// Initialize WebRTC Signaling Server
const WebRTCSignalingServer = require('./webrtc-signaling');
const signalingServer = new WebRTCSignalingServer(server);

// Initialize email service on startup
if (emailService.isEmailConfigured()) {
  emailService.initializeEmailService();
  console.log('📧 Email service: Configured and ready');
} else {
  console.log('⚠️ Email service: Not configured. Set EMAIL_PROVIDER and related env variables to enable email notifications.');
}

server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📁 Uploads directory: ${uploadsDir}`);
  console.log(`📹 WebRTC Signaling Server ready at ws://localhost:${PORT}/webrtc-signaling`);
  console.log(`✅ Available endpoints:`);
  console.log(`   - POST /api/recruitment/apply`);
  console.log(`   - POST /api/events/register`);
  console.log(`   - POST /api/newsletter/subscribe`);
  console.log(`   - GET /api/resources/test`);
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
app.post('/api/rewards/redeem', verifyUserToken, (req, res) => {
  const { reward_id, service_data, review_data, visa_data } = req.body;
  const user_email = req.userEmail; // Use authenticated user's email

  if (!reward_id) {
    res.status(400).json({ error: 'reward_id is required' });
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
// Use wildcard route to handle email with special characters
app.delete('/api/admin/users/*', (req, res) => {
  const token = req.headers['x-admin-token'];
  if (!token || token !== process.env.ADMIN_TOKEN) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  // Get email from path - everything after /api/admin/users/
  const pathAfterBase = req.path.replace('/api/admin/users/', '');
  const user_email = decodeURIComponent(pathAfterBase);
  
  console.log('🗑️ [DEBUG] Delete user request:', { path: req.path, user_email });
  
  if (!user_email || !user_email.includes('@')) {
    res.status(400).json({ error: 'Invalid email address' });
    return;
  }
  
  dbHelpers.deleteUser(user_email, (err, result) => {
    if (err) {
      console.error('Error deleting user:', err);
      res.status(500).json({ error: err.message });
      return;
    }
    if (!result || !result.deleted) {
      console.log('⚠️ [DEBUG] User not found or not deleted:', { user_email, result });
      res.status(404).json({ error: 'User not found' });
      return;
    }
    console.log('✅ [DEBUG] User deleted successfully:', { user_email });
    res.json({ success: true, message: 'User deleted successfully' });
  });
});

// ==================== LUCKY DRAW API ====================

// Get lucky draw settings and rewards (public)
app.get('/api/lucky-draw/info', (req, res) => {
  dbHelpers.getLuckyDrawSettings((err, settings) => {
    if (err) {
      console.error('Error fetching lucky draw settings:', err);
      return res.status(500).json({ error: err.message });
    }
    
    dbHelpers.getAllLuckyDrawRewards((err, rewards) => {
      if (err) {
        console.error('Error fetching lucky draw rewards:', err);
        return res.status(500).json({ error: err.message });
      }
      
      res.json({
        settings: settings || { win_rate: 30, is_active: 1 },
        rewards: rewards || []
      });
    });
  });
});

// Participate in lucky draw
app.post('/api/lucky-draw/participate', (req, res) => {
  const { email, phone } = req.body;

  if (!email || !phone) {
    return res.status(400).json({ error: 'Email và số điện thoại là bắt buộc' });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Email không hợp lệ' });
  }

  // Validate phone (Vietnamese phone format)
  const phoneRegex = /^[0-9]{10,11}$/;
  if (!phoneRegex.test(phone.replace(/\s+/g, ''))) {
    return res.status(400).json({ error: 'Số điện thoại không hợp lệ (10-11 chữ số)' });
  }

  // Check if user already participated
  dbHelpers.checkParticipantExists(email, phone, (err, existing) => {
    if (err) {
      console.error('Error checking participant:', err);
      return res.status(500).json({ error: 'Lỗi hệ thống' });
    }

    if (existing) {
      // User already participated, return their result
      return res.json({
        success: true,
        already_participated: true,
        won: existing.won === 1,
        reward: existing.won === 1 ? {
          id: existing.reward_id,
          name: existing.reward_name
        } : null,
        message: existing.won === 1 
          ? `Bạn đã tham gia và trúng ${existing.reward_name}!` 
          : 'Bạn đã tham gia rồi. Chúc bạn may mắn lần sau!'
      });
    }

    // Get settings
    dbHelpers.getLuckyDrawSettings((err, settings) => {
      if (err) {
        console.error('Error fetching settings:', err);
        return res.status(500).json({ error: 'Lỗi hệ thống' });
      }

      const winRate = (settings && settings.win_rate) || 30;
      const isActive = (settings && settings.is_active) === 1;

      if (!isActive) {
        return res.status(400).json({ error: 'Chương trình đang tạm dừng' });
      }

      // Check if user wins (random based on win rate)
      const random = Math.random() * 100;
      const won = random <= winRate;

      let reward = null;
      let rewardId = null;
      let rewardName = null;

      if (won) {
        // Get available rewards
        dbHelpers.getAllLuckyDrawRewards((err, rewards) => {
          if (err) {
            console.error('Error fetching rewards:', err);
            return res.status(500).json({ error: 'Lỗi hệ thống' });
          }

          // Filter rewards with stock > 0
          const availableRewards = (rewards || []).filter(r => (r.stock_quantity || 0) > 0);

          if (availableRewards.length === 0) {
            // No rewards available, user doesn't win
            dbHelpers.createLuckyDrawParticipant({
              email,
              phone,
              won: false,
              reward_id: null,
              reward_name: null
            }, (err, participant) => {
              if (err) {
                console.error('Error creating participant:', err);
                return res.status(500).json({ error: 'Lỗi hệ thống' });
              }
              return res.json({
                success: true,
                won: false,
                reward: null,
                message: 'Chúc bạn may mắn lần sau!'
              });
            });
            return;
          }

          // Randomly select a reward
          const randomReward = availableRewards[Math.floor(Math.random() * availableRewards.length)];
          reward = {
            id: randomReward.id,
            name: randomReward.name,
            description: randomReward.description,
            image: randomReward.image
          };
          rewardId = randomReward.id;
          rewardName = randomReward.name;

          // Update stock
          dbHelpers.updateRewardStock(rewardId, 1, (err) => {
            if (err) {
              console.error('Error updating reward stock:', err);
            }

            // Create participant record
            dbHelpers.createLuckyDrawParticipant({
              email,
              phone,
              won: true,
              reward_id: rewardId,
              reward_name: rewardName
            }, (err, participant) => {
              if (err) {
                console.error('Error creating participant:', err);
                return res.status(500).json({ error: 'Lỗi hệ thống' });
              }
              return res.json({
                success: true,
                won: true,
                reward: reward,
                message: `Chúc mừng! Bạn đã trúng ${rewardName}!`
              });
            });
          });
        });
      } else {
        // User didn't win
        dbHelpers.createLuckyDrawParticipant({
          email,
          phone,
          won: false,
          reward_id: null,
          reward_name: null
        }, (err, participant) => {
          if (err) {
            console.error('Error creating participant:', err);
            return res.status(500).json({ error: 'Lỗi hệ thống' });
          }
          return res.json({
            success: true,
            won: false,
            reward: null,
            message: 'Chúc bạn may mắn lần sau!'
          });
        });
      }
    });
  });
});

// Get all participants (admin only)
app.get('/api/admin/lucky-draw/participants', (req, res) => {
  const token = req.headers['x-admin-token'];
  if (!token || token !== process.env.ADMIN_TOKEN) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  dbHelpers.getAllParticipants((err, participants) => {
    if (err) {
      console.error('Error fetching participants:', err);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(participants || []);
  });
});

// Get participants stats (admin only)
app.get('/api/admin/lucky-draw/stats', (req, res) => {
  const token = req.headers['x-admin-token'];
  if (!token || token !== process.env.ADMIN_TOKEN) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  dbHelpers.getParticipantsStats((err, stats) => {
    if (err) {
      console.error('Error fetching stats:', err);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(stats || { total_participants: 0, total_winners: 0, total_losers: 0 });
  });
});

// Get all rewards (admin only - includes inactive)
app.get('/api/admin/lucky-draw/rewards', (req, res) => {
  const token = req.headers['x-admin-token'];
  if (!token || token !== process.env.ADMIN_TOKEN) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  dbHelpers.getAllLuckyDrawRewardsAdmin((err, rewards) => {
    if (err) {
      console.error('Error fetching rewards:', err);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rewards || []);
  });
});

// Create reward (admin only)
app.post('/api/admin/lucky-draw/rewards', (req, res) => {
  const token = req.headers['x-admin-token'];
  if (!token || token !== process.env.ADMIN_TOKEN) {
    console.log('❌ Unauthorized: Missing or invalid admin token');
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const { name, description, image, stock_quantity, is_active } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Tên phần quà là bắt buộc' });
  }

  console.log('📝 Creating reward:', { name, description, image, stock_quantity, is_active });

  dbHelpers.createLuckyDrawReward({
    name,
    description: description || null,
    image: image || null,
    stock_quantity: parseInt(stock_quantity) || 0,
    is_active: is_active !== undefined ? (is_active ? 1 : 0) : 1
  }, (err, reward) => {
    if (err) {
      console.error('❌ Error creating reward:', err);
      res.status(500).json({ error: err.message || 'Lỗi khi tạo phần quà' });
      return;
    }
    console.log('✅ Reward created successfully:', reward);
    res.json(reward);
  });
});

// Update reward (admin only)
app.put('/api/admin/lucky-draw/rewards/:id', (req, res) => {
  const token = req.headers['x-admin-token'];
  if (!token || token !== process.env.ADMIN_TOKEN) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const rewardId = parseInt(req.params.id);
  const { name, description, image, stock_quantity, is_active } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Tên phần quà là bắt buộc' });
  }

  dbHelpers.updateLuckyDrawReward(rewardId, {
    name,
    description: description || null,
    image: image || null,
    stock_quantity: parseInt(stock_quantity) || 0,
    is_active: is_active !== undefined ? (is_active ? 1 : 0) : 1
  }, (err, reward) => {
    if (err) {
      console.error('Error updating reward:', err);
      res.status(500).json({ error: err.message });
      return;
    }
    if (!reward) {
      res.status(404).json({ error: 'Phần quà không tồn tại' });
      return;
    }
    res.json(reward);
  });
});

// Delete reward (admin only)
app.delete('/api/admin/lucky-draw/rewards/:id', (req, res) => {
  const token = req.headers['x-admin-token'];
  if (!token || token !== process.env.ADMIN_TOKEN) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const rewardId = parseInt(req.params.id);

  dbHelpers.deleteLuckyDrawReward(rewardId, (err, result) => {
    if (err) {
      console.error('Error deleting reward:', err);
      res.status(500).json({ error: err.message });
      return;
    }
    if (!result || !result.deleted) {
      res.status(404).json({ error: 'Phần quà không tồn tại' });
      return;
    }
    res.json({ success: true, message: 'Đã xóa phần quà thành công' });
  });
});

// Update settings (admin only)
app.put('/api/admin/lucky-draw/settings', (req, res) => {
  const token = req.headers['x-admin-token'];
  if (!token || token !== process.env.ADMIN_TOKEN) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const { win_rate, is_active } = req.body;

  if (win_rate === undefined || win_rate < 0 || win_rate > 100) {
    return res.status(400).json({ error: 'Tỷ lệ trúng thưởng phải từ 0 đến 100' });
  }

  dbHelpers.updateLuckyDrawSettings(
    parseFloat(win_rate),
    is_active !== undefined ? (is_active ? 1 : 0) : 1,
    (err, settings) => {
      if (err) {
        console.error('Error updating settings:', err);
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(settings);
    }
  );
});

// Get settings (admin only)
app.get('/api/admin/lucky-draw/settings', (req, res) => {
  const token = req.headers['x-admin-token'];
  if (!token || token !== process.env.ADMIN_TOKEN) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  dbHelpers.getLuckyDrawSettings((err, settings) => {
    if (err) {
      console.error('Error fetching settings:', err);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(settings || { win_rate: 30, is_active: 1 });
  });
});

// ==================== ADMIN SERVICE REDEMPTIONS API ====================
// Get all service redemptions (admin only)
app.get('/api/admin/service-redemptions', (req, res) => {
  const token = req.headers['x-admin-token'];
  if (!token || token !== process.env.ADMIN_TOKEN) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  if (!db) {
    return res.status(500).json({ error: 'Database not available' });
  }

  db.all(`
    SELECT 
      sr.*,
      r.reward_name,
      r.reward_type
    FROM service_redemptions sr
    LEFT JOIN redemptions r ON sr.redemption_id = r.id
    ORDER BY sr.created_at DESC
  `, (err, rows) => {
    if (err) {
      console.error('Error fetching service redemptions:', err);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows || []);
  });
});

// ==================== ADMIN DOCUMENT REVIEWS API ====================
// Get all document reviews (admin only)
app.get('/api/admin/document-reviews', (req, res) => {
  const token = req.headers['x-admin-token'];
  if (!token || token !== process.env.ADMIN_TOKEN) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  if (!db) {
    return res.status(500).json({ error: 'Database not available' });
  }

  db.all(`
    SELECT 
      dr.*,
      r.reward_name,
      r.reward_type
    FROM document_reviews dr
    LEFT JOIN redemptions r ON dr.redemption_id = r.id
    ORDER BY dr.created_at DESC
  `, (err, rows) => {
    if (err) {
      console.error('Error fetching document reviews:', err);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows || []);
  });
});

// ==================== ADMIN VISA SUPPORT API ====================
// Get all visa support requests (admin only)
app.get('/api/admin/visa-support', (req, res) => {
  const token = req.headers['x-admin-token'];
  if (!token || token !== process.env.ADMIN_TOKEN) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  if (!db) {
    return res.status(500).json({ error: 'Database not available' });
  }

  db.all(`
    SELECT 
      vs.*,
      r.reward_name,
      r.reward_type
    FROM visa_support vs
    LEFT JOIN redemptions r ON vs.redemption_id = r.id
    ORDER BY vs.created_at DESC
  `, (err, rows) => {
    if (err) {
      console.error('Error fetching visa support:', err);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows || []);
  });
});
