const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    slug: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Use a clean async function with NO parameters. 
// Mongoose will handle this safely and wait for it to resolve!
categorySchema.pre('save', async function () {
  if (this.name) {
    this.slug = this.name.toLowerCase().split(' ').join('-');
  }
});

module.exports = mongoose.model('Category', categorySchema);