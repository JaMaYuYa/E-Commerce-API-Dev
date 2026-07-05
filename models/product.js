const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
      type: String,
      required: [true, 'Product name is required'], 
      trim: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  // 2.3 ObjectId Reference link to the Category Model
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'A product must belong to a category']
  },
  stock: {
  type: Number,
  required: [true, 'Product stock quantity is required'],
  default: 0,
  min: [0, 'Stock cannot be negative']
}
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);