// models/cart.model.js
const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'A cart item must reference a valid product.']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required.'],
    min: [1, 'Quantity cannot be less than 1.'],
    default: 1
  },
  price: {
    type: Number,
    required: [true, 'Price is required.']
  }
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
      default: 'guest_user_123'
    },
    items: [cartItemSchema],
    totalItems: {
      type: Number,
      required: true,
      default: 0
    },
    billSubtotal: {
      type: Number,
      required: true,
      default: 0
    }
  },
  { timestamps: true }
);

// 🛠️ FIX: Notice NO "next" parameter inside the function brackets here!
cartSchema.pre('save', function () {
  if (this.items && this.items.length > 0) {
    this.totalItems = this.items.reduce((acc, item) => acc + item.quantity, 0);
    
    const subtotal = this.items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
    this.billSubtotal = Math.round(subtotal * 100) / 100;
  } else {
    this.totalItems = 0;
    this.billSubtotal = 0;
  }
  // No next() call is needed. Mongoose moves forward automatically.
});

module.exports = mongoose.model('Cart', cartSchema);