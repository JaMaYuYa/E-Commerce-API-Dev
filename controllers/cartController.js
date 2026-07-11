// controllers/cartController.js
const Cart = require('../models/cart.model'); 
const Product = require('../models/product.model');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
};

// ==========================================
// 1. GET ACTIVE CART STATE (DIAGNOSTIC MODE)
// ==========================================
const getCart = async (req, res, next) => {
  try {
    const userId = 'guest_user_123';
    const cart = await getOrCreateCart(userId);
    
    if (cart.items && cart.items.length > 0) {
      await cart.populate('items.product', 'name images price');
    }

    return res.status(200).json({
      status: 'success',
      data: { cart }
    });
  } catch (err) {
    // This catches the exact line causing the failure!
    return res.status(500).json({
      status: 'diagnostic-error',
      errorName: err.name,
      errorMessage: err.message,
      errorStack: err.stack
    });
  }
};

// ==========================================
// 2. ADD ITEM TO CART
// ==========================================
const addItemToCart = asyncHandler(async (req, res, next) => {
  const userId = 'guest_user_123';
  const { productId, quantity = 1 } = req.body;

  const product = await Product.findById(productId);
  if (!product) return next(new AppError('Product not found.', 404));

  const cart = await getOrCreateCart(userId);
  const existingItemIndex = cart.items.findIndex(item => item.product.toString() === productId);

  if (existingItemIndex > -1) {
    cart.items[existingItemIndex].quantity += Number(quantity);
  } else {
    cart.items.push({ product: productId, quantity: Number(quantity), price: product.price });
  }

  await cart.save();
  res.status(200).json({ status: 'success', data: { cart } });
});

// ==========================================
// 3. REMOVE SINGLE ITEM INDEPENDENTLY
// ==========================================
const removeCartItem = asyncHandler(async (req, res, next) => {
  const userId = 'guest_user_123';
  let cart = await Cart.findOne({ user: userId });
  if (!cart) return next(new AppError('No cart found.', 404));

  cart.items = cart.items.filter(item => item.product.toString() !== req.params.productId);
  await cart.save();
  res.status(200).json({ status: 'success', data: { cart } });
});

module.exports = {
  getCart,
  addItemToCart,
  removeCartItem
};