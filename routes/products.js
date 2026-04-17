const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Product = require('../models/Product');

// File filter for images only
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Images only! (jpeg, jpg, png, webp)'));
  }
};

// ✅ HELPER FUNCTION: Get full image URL
const getFullImageUrl = (req, imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
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
router.post('/', (req, res) => {
  const storage = req.app.locals.uploadStorage;
  
  if (!storage) {
    return res.status(500).json({ success: false, message: 'Storage not configured' });
  }

  const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5000000 },
    fileFilter: fileFilter
  }).single('image');

  upload(req, res, async (err) => {
    if (err) {
      console.error('Upload error:', err);
      return res.status(400).json({ success: false, message: err.message });
    }

    try {
      const { name, category, description, originalPrice, discountedPrice, whatsappNumber } = req.body;

      // Validation
      if (!name || !category || !description || !originalPrice || !discountedPrice) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
      }

      if (!req.file) {
        return res.status(400).json({ success: false, message: 'Image is required' });
      }

      const imageUrl = req.file.path;

      const product = new Product({
        name,
        category,
        description,
        originalPrice: parseFloat(originalPrice) || 0,
        discountedPrice: parseFloat(discountedPrice) || 0,
        whatsappNumber: whatsappNumber || '923058666797',
        image: imageUrl
      });

      await product.save();
      res.status(201).json({ success: true, message: 'Product added successfully', product });
    } catch (error) {
      console.error('Create error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  });
});

// ✅ PUT UPDATE PRODUCT - FIXED VERSION
router.put('/:id', async (req, res) => {
  try {
    const storage = req.app.locals.uploadStorage;
    const cloudinary = req.app.locals.cloudinary;
    
    if (!storage) {
      return res.status(500).json({ success: false, message: 'Storage not configured' });
    }

    // Use multer as a promise to handle file upload optionally
    const upload = multer({ 
      storage: storage,
      limits: { fileSize: 5000000 },
      fileFilter: fileFilter
    }).single('image');

    // Convert multer callback to promise
    await new Promise((resolve, reject) => {
      upload(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    const { name, category, description, originalPrice, discountedPrice, whatsappNumber } = req.body;

    // Validation
    if (!name || !category || !description || !originalPrice || !discountedPrice) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Build update object
    const updateData = {
      name,
      category,
      description,
      originalPrice: parseFloat(originalPrice) || 0,
      discountedPrice: parseFloat(discountedPrice) || 0,
      whatsappNumber: whatsappNumber || '923058666797'
    };

    // If new image uploaded, handle Cloudinary
    if (req.file) {
      // Get old product to delete previous image
      const oldProduct = await Product.findById(req.params.id);
      
      if (oldProduct && oldProduct.image && oldProduct.image.includes('cloudinary')) {
        try {
          const urlParts = oldProduct.image.split('/');
          const filenameWithExt = urlParts[urlParts.length - 1];
          const publicId = filenameWithExt.split('.')[0];
          await cloudinary.uploader.destroy(`bodyblast-products/${publicId}`);
          console.log('🗑️ Deleted old image from Cloudinary:', publicId);
        } catch (err) {
          console.error('Error deleting old image:', err);
        }
      }
      
      updateData.image = req.file.path;
    }

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
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    const cloudinary = req.app.locals.cloudinary;
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Delete image from Cloudinary
    if (product.image && product.image.includes('cloudinary')) {
      try {
        const urlParts = product.image.split('/');
        const filenameWithExt = urlParts[urlParts.length - 1];
        const publicId = filenameWithExt.split('.')[0];
        await cloudinary.uploader.destroy(`bodyblast-products/${publicId}`);
        console.log('🗑️ Deleted image from Cloudinary:', publicId);
      } catch (err) {
        console.error('Error deleting image:', err);
      }
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;