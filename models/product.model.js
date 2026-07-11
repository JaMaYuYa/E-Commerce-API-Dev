// models/product.model.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A product must have a name'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'A product must belong to a category'],
      trim: true,
    },
    price: {
      type: Number, // 👈 Ensures numerical range queries work flawlessly
      required: [true, 'A product must have a price'],
      min: [0, 'Price cannot be negative'],
    },
    stock: {
      type: Number, // 👈 Essential for your checkout stock validations
      required: [true, 'A product must specify stock levels'],
      default: 0,
      min: [0, 'Stock cannot be negative'],
    },
    ratings: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be at least 1.0'],
      max: [5, 'Rating cannot exceed 5.0'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
      select: false, // Hides this field from standard API JSON responses
    },
  },
  {
    timestamps: true, // Automatically adds dynamic createdAt and updatedAt stamps
  }
);

// Define a text index to support name and category text searches natively
productSchema.index({ name: 'text', category: 'text' });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;