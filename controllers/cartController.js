const Cart = require('../models/cart.model'); 
const Product = require('../models/product.model');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

const updateCartPricing = async (cart) => {
  let totalBill = 0;
  let totalCount = 0;

  for (const item of cart.items) {
    const prodId = item.product._id ? item.product._id : item.product;
    const product = await Product.findById(prodId);
    
    if (product) {
      item.price = product.price;
      totalBill += product.price * item.quantity;
      totalCount += item.quantity;
    }
  }

  cart.totalPrice = totalBill;
  cart.price = totalBill;

  return { totalBill, totalCount };
};

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [], totalPrice: 0 });
  }
  return cart;
};

const getCart = async (req, res, next) => {
  try {
    const userId = 'guest_user_123';
    const cart = await getOrCreateCart(userId);
    const { totalBill, totalCount } = await updateCartPricing(cart);
    await cart.save();

    if (cart.items && cart.items.length > 0) {
      await cart.populate('items.product', 'name images price');    }

    const cartResponse = cart.toObject();
    cartResponse.billSubtotal = totalBill;
    cartResponse.totalItems = totalCount;

    return res.status(200).json({
      status: 'success',
      data: { cart: cartResponse }
    });
  } catch (err) {
    return res.status(500).json({
      status: 'diagnostic-error',
      errorName: err.name,
      errorMessage: err.message,
      errorStack: err.stack
    });
  }
};

const addItemToCart = asyncHandler(async (req, res, next) => {
  const userId = 'guest_user_123';
  const { productId, quantity = 1 } = req.body;

  const product = await Product.findById(productId);
  if (!product) return next(new AppError('Product not found.', 404));

  const cart = await getOrCreateCart(userId);
  
  const existingItemIndex = cart.items.findIndex(item => {
    const itemProdId = item.product._id ? item.product._id.toString() : item.product.toString();
    return itemProdId === productId.toString();
  });

  if (existingItemIndex > -1) {
    cart.items[existingItemIndex].quantity += Number(quantity);
  } else {
    cart.items.push({ product: productId, quantity: Number(quantity), price: product.price });
  }

  const { totalBill, totalCount } = await updateCartPricing(cart);
  await cart.save();
await cart.populate('items.product', 'name images price');  
  const cartResponse = cart.toObject();
  cartResponse.billSubtotal = totalBill;
  cartResponse.totalItems = totalCount;

  res.status(200).json({ status: 'success', data: { cart: cartResponse } });
});

const updateCartItem = asyncHandler(async (req, res, next) => {
  const userId = 'guest_user_123';
  
  const { productId } = req.params;
  const { quantity } = req.body;

  if (quantity === undefined || quantity < 0) {
    return next(new AppError('Please provide a valid quantity.', 400));
  }

  const cart = await Cart.findOne({ user: userId });
  if (!cart) return next(new AppError('No cart found.', 404));

  const itemIndex = cart.items.findIndex(item => {
    if (!item || !item.product) return false;
    const itemProdId = item.product._id ? item.product._id.toString() : item.product.toString();
    return itemProdId === productId;
  });

  if (itemIndex === -1) return next(new AppError('Product not found inside cart.', 404));

  if (Number(quantity) === 0) {
    cart.items.splice(itemIndex, 1);
  } else {
    cart.items[itemIndex].quantity = Number(quantity);
  }

  const { totalBill, totalCount } = await updateCartPricing(cart);
  await cart.save();
  await cart.populate('items.product', 'name images price');
  
  const cartResponse = cart.toObject();
  cartResponse.billSubtotal = totalBill;
  cartResponse.totalItems = totalCount;

  res.status(200).json({ status: 'success', data: { cart: cartResponse } });
});


const removeCartItem = asyncHandler(async (req, res, next) => {
  const userId = 'guest_user_123';
  const productId = req.params.productId || req.body.productId;

  if (!productId) {
    return next(new AppError('Please provide a product ID to remove.', 400));
  }

  let cart = await Cart.findOne({ user: userId });
  if (!cart) return next(new AppError('No cart found.', 404));

  cart.items = cart.items.filter(item => {
    if (!item.product) return false;
    const targetId = item.product._id ? item.product._id.toString() : item.product.toString();
    return targetId !== productId.toString();
  });
  
  const { totalBill, totalCount } = await updateCartPricing(cart);
  await cart.save();
  await cart.populate('items.product', 'name images price');  
  const cartResponse = cart.toObject();
  cartResponse.billSubtotal = totalBill;
  cartResponse.totalItems = totalCount;

  res.status(200).json({ status: 'success', data: { cart: cartResponse } });
});


const deleteCart = asyncHandler(async (req, res, next) => {
  const userId = 'guest_user_123';

  const cart = await Cart.findOneAndDelete({ user: userId });

  if (!cart) {
    return next(new AppError('No active cart found to delete.', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Cart deleted successfully.',
    data: null
  });
});

module.exports = {
  getCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  deleteCart
};