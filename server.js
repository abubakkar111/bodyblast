




// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const path = require('path');
// const fs = require('fs');
// require('dotenv').config();

// const app = express();

// // Create uploads folder if it doesn't exist
// const uploadsDir = path.join(__dirname, 'uploads');
// if (!fs.existsSync(uploadsDir)) {
//     fs.mkdirSync(uploadsDir, { recursive: true });
//     console.log('📁 Created uploads folder');
// }

// // CORS configuration
// app.use(cors({
//   origin: '*',
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // ✅ OPTIMIZED: Static files with caching headers for faster image loading
// app.use('/uploads', express.static(uploadsDir, {
//   maxAge: '7d',           // Cache images in browser for 7 days
//   etag: true,             // Enable ETag for cache validation
//   lastModified: true,     // Enable Last-Modified header
//   setHeaders: (res, path) => {
//     // Set proper content-type for images
//     if (path.endsWith('.jpg') || path.endsWith('.jpeg')) {
//       res.setHeader('Content-Type', 'image/jpeg');
//     } else if (path.endsWith('.png')) {
//       res.setHeader('Content-Type', 'image/png');
//     } else if (path.endsWith('.webp')) {
//       res.setHeader('Content-Type', 'image/webp');
//     }
//     // Enable CORS for images (allows loading from any origin)
//     res.setHeader('Access-Control-Allow-Origin', '*');
//   }
// }));

// // ✅ COMPRESSION: Add compression middleware for faster responses
// const compression = require('compression');
// app.use(compression());

// // MongoDB Connection
// const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/protein-store';

// mongoose.connect(MONGO_URI)
//   .then(() => console.log('✅ MongoDB Connected Successfully'))
//   .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// // ✅ HEALTH CHECK: Add a health check endpoint
// app.get('/health', (req, res) => {
//   res.json({ 
//     status: 'OK', 
//     timestamp: new Date().toISOString(),
//     uptime: process.uptime()
//   });
// });

// // Routes
// app.use('/api/products', require('./routes/products'));

// // Test route
// app.get('/', (req, res) => {
//   res.json({ message: 'Bodyblast Sports & Nutrition API is running!' });
// });

// // ✅ 404 Handler: Catch undefined routes
// app.use((req, res) => {
//   res.status(404).json({ success: false, message: 'Route not found' });
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.log(req.file.path)
//   console.error('Error:', err.stack);
//   res.status(500).json({ success: false, message: err.message || 'Something went wrong!' });
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
//   console.log(`📁 Uploads directory: ${uploadsDir}`);
//   console.log(`🖼️  Images served at: http://localhost:${PORT}/uploads/`);
// });









const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const path = require('path');  // ✅ Keep this for the fallback static serving
const fs = require('fs');
const compression = require('compression');
require('dotenv').config();

// ✅ CLOUDINARY: Import Cloudinary packages
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const app = express();
app.locals.cloudinary = cloudinary;
// ✅ CLOUDINARY: Configure Cloudinary (REQUIRED - Add these to your .env file)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// ✅ CLOUDINARY: Create storage engine for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'bodyblast-products',  // Folder name in your Cloudinary account
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }], // Optional: resize large images
    public_id: (req, file) => {
      // Generate unique filename: product-timestamp-originalname
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      return `product-${uniqueSuffix}`;
    }
  }
});

// ✅ CLOUDINARY: Export configured multer storage (we'll use this in routes)
app.locals.uploadStorage = storage;
// Also export cloudinary instance for deletion operations in routes
app.locals.cloudinary = cloudinary;

// CORS configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ REMOVED: Static files serving for uploads (no longer needed with Cloudinary)
// Images are now served directly from Cloudinary CDN
// If you have old images in uploads folder, keep this temporarily:
const uploadsDir = path.join(__dirname, 'uploads');
if (fs.existsSync(uploadsDir)) {
  app.use('/uploads', express.static(uploadsDir, {
    maxAge: '7d',
    etag: true,
    lastModified: true
  }));
}

// ✅ COMPRESSION: Add compression middleware
app.use(compression());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/protein-store';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// ✅ HEALTH CHECK
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    cloudinary: 'configured' // Added to verify Cloudinary is set up
  });
});

// Routes
app.use('/api/products', require('./routes/products'));

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Bodyblast Sports & Nutrition API is running! ☁️ Cloudinary Active' });
});

// ✅ 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ success: false, message: err.message || 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`☁️  Cloudinary configured for image uploads`);
});