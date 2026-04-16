const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Product = require('../models/Product');

// File filter for images only
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Error: Images only! (jpeg, jpg, png, webp)');
  }
};

// ✅ HELPER FUNCTION: Get full image URL (Updated for Cloudinary)
const getFullImageUrl = (req, imagePath) => {
  if (!imagePath) return '';
  // Cloudinary URLs are already full URLs, return as-is
  if (imagePath.startsWith('http')) return imagePath;
  
  // Fallback for old local images (if any exist in DB)
  const cleanPath = imagePath.replace(/^\/+/, '');
  return `${req.protocol}://${req.get('host')}/${cleanPath}`;
};

// GET all products
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};

    if (category && category !== 'all') {
      query.category = category;
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    
    // ✅ Images now already have full Cloudinary URLs, no transformation needed
    // But we keep the helper for backward compatibility with old data
    const productsWithFullUrls = products.map(product => {
      const productObj = product.toObject();
      productObj.image = getFullImageUrl(req, productObj.image);
      return productObj;
    });
    
    res.json({ success: true, products: productsWithFullUrls });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    const productObj = product.toObject();
    productObj.image = getFullImageUrl(req, productObj.image);
    
    res.json({ success: true, product: productObj });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST create product with image upload
router.post('/', (req, res, next) => {
  // ✅ CLOUDINARY: Use storage from app locals (set in server.js)
  const storage = req.app.locals.uploadStorage;
  const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5000000 }, // 5MB limit
    fileFilter: fileFilter
  }).single('image');

  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    try {
      const { name, category, description, originalPrice, discountedPrice, whatsappNumber } = req.body;

      // ✅ CLOUDINARY: req.file.path now contains the Cloudinary URL directly
      const imageUrl = req.file ? req.file.path : '';

      const product = new Product({
        name,
        category,
        description,
        originalPrice: parseFloat(originalPrice),
        discountedPrice: parseFloat(discountedPrice),
        whatsappNumber,
        image: imageUrl // ✅ Stores: https://res.cloudinary.com/.../image.jpg
      });

      await product.save();
      res.status(201).json({ success: true, message: 'Product added successfully', product });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });
});

// ✅ PUT UPDATE PRODUCT - EDIT FEATURE
router.put('/:id', (req, res, next) => {
  // ✅ CLOUDINARY: Use storage from app locals
  const storage = req.app.locals.uploadStorage;
  const cloudinary = req.app.locals.cloudinary;
  
  const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5000000 },
    fileFilter: fileFilter
  }).single('image');

  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    try {
      const { name, category, description, originalPrice, discountedPrice, whatsappNumber } = req.body;

      // Build update object
      const updateData = {
        name,
        category,
        description,
        originalPrice: parseFloat(originalPrice),
        discountedPrice: parseFloat(discountedPrice),
        whatsappNumber
      };

      // ✅ If new image uploaded, handle Cloudinary
      if (req.file) {
        // Get old product to delete previous image from Cloudinary
        const oldProduct = await Product.findById(req.params.id);
        
        if (oldProduct && oldProduct.image && oldProduct.image.includes('cloudinary')) {
          try {
            // Extract public_id from Cloudinary URL
            // URL format: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/public_id.jpg
            const urlParts = oldProduct.image.split('/');
            const filenameWithExt = urlParts[urlParts.length - 1]; // public_id.jpg
            const publicId = filenameWithExt.split('.')[0]; // public_id
            
            // Delete from Cloudinary
            await cloudinary.uploader.destroy(`bodyblast-products/${publicId}`);
            console.log('🗑️ Deleted old image from Cloudinary:', publicId);
          } catch (err) {
            console.error('Error deleting old image from Cloudinary:', err);
            // Continue even if delete fails
          }
        }
        
        // Set new image URL from Cloudinary
        updateData.image = req.file.path;
      }

      // ✅ Update product in database
      const product = await Product.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      res.json({ 
        success: true, 
        message: 'Product updated successfully', 
        product 
      });
    } catch (error) {
      console.error('Update error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  });
});

// DELETE product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    const cloudinary = req.app.locals.cloudinary;
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // ✅ CLOUDINARY: Delete image from Cloudinary when deleting product
    if (product.image && product.image.includes('cloudinary')) {
      try {
        // Extract public_id from Cloudinary URL
        const urlParts = product.image.split('/');
        const filenameWithExt = urlParts[urlParts.length - 1];
        const publicId = filenameWithExt.split('.')[0];
        
        await cloudinary.uploader.destroy(`bodyblast-products/${publicId}`);
        console.log('🗑️ Deleted image from Cloudinary:', publicId);
      } catch (err) {
        console.error('Error deleting image from Cloudinary:', err);
      }
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;