const Order = require('../models/order.model');
const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/appError');

const createOrder = asyncHandler(async (req, res, next) => {
  const userId = 'guest_user_123';
  const { shippingAddress } = req.body;

  if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || !shippingAddress.country) {
    return next(new AppError('Complete shipping address (street, city, country) is required.', 400));
  }

  const cart = await Cart.findOne({ user: userId });
  if (!cart || cart.items.length === 0) {
    return next(new AppError('Your cart is empty. Cannot place an order.', 400));
  }

  const checkedItems = [];
  let serverCalculatedTotalPrice = 0;

  for (const item of cart.items) {
    const prodId = item.product._id ? item.product._id : item.product;
    const product = await Product.findById(prodId);

    if (!product) {
      return next(new AppError('One or more products in your cart no longer exist.', 404));
    }

    if (product.stock < item.quantity) {
      return next(new AppError(`Not enough stock for ${product.name}. Available stock: ${product.stock}.`, 400));
    }

    serverCalculatedTotalPrice += product.price * item.quantity;

    checkedItems.push({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: item.quantity
    });
  }

  for (const item of checkedItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity }
    });
  }

  const order = await Order.create({
    user: userId,
    items: checkedItems,
    totalPrice: serverCalculatedTotalPrice,
    shippingAddress
  });

  cart.items = [];
  cart.totalPrice = 0;
  cart.price = 0;
  await cart.save();

  res.status(201).json({
    status: 'success',
    data: { order }
  });
});

const getAllOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find().sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    results: orders.length,
    data: { orders }
  });
});

const getOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError('No order found with that ID.', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { order }
  });
});

const updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;

  if (!status) {
    return next(new AppError('Please provide a status value to update.', 400));
  }

  // 1. Validate MongoDB ObjectId format -> 404 if invalid
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(new AppError('No order found with that ID.', 404));
  }

  // 2. Perform the update
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );

  // 3. Check if document exists -> 404 if not found
  if (!order) {
    return next(new AppError('No order found with that ID.', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { order }
  });
});

module.exports = {
  createOrder,
  getAllOrders,
  getOrder,
  updateOrderStatus
};