const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['protein', 'pre-workout', 'bcaa', 'weight-gainer', 'fat-burner', 'performance']
  },
  description: {
    type: String,
    required: true
  },
  originalPrice: {
    type: Number,
    required: true
  },
  discountedPrice: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  image: {
    type: String,
    required: true
  },
  whatsappNumber: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Auto-calculate discount before saving
productSchema.pre('save', function(next) {
  if (this.originalPrice > 0 && this.discountedPrice > 0) {
    this.discount = Math.round(((this.originalPrice - this.discountedPrice) / this.originalPrice) * 100);
  }
  next();
});

// Also for update operations
productSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();
  if (update.originalPrice && update.discountedPrice) {
    update.discount = Math.round(((update.originalPrice - update.discountedPrice) / update.originalPrice) * 100);
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
