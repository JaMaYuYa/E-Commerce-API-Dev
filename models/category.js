const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'], // 2.4 Custom validation message
      unique: true,
      trim: true,
      minlength: [3, 'Category name must be at least 3 characters long']
    },
    description: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('category', categorySchema);