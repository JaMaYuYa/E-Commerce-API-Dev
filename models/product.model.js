const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A product must have a name.'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'A product must have a description.'],
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'A product must have a price.'],
      min: [0, 'Price cannot be negative.']
    },
    stock: {
      type: Number,
      required: [true, 'A product must have a stock level.'],
      min: [0, 'Stock cannot be negative.'],
      default: 0
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'A product must belong to a category.']
    },
    images: {
      type: [String],
      default: []
    },
    inStock: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

productSchema.pre('save', async function () {
  const currentStock = this.stock ?? 0;
  this.inStock = currentStock > 0;
  // No next() or callback parameter needed! Mongoose resolves this automatically.
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;