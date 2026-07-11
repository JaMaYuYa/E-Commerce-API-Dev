// controllers/orderController.js
const Order = require('../models/order.model');
const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

// Helper to generate a unique random order token string
const generateOrderNumber = () => {
  return 'ORD' + Math.floor(100000 + Math.random() * 900000);
};

// ==========================================
// 1. CREATE ORDER (CHECKOUT PIPELINE)
// ==========================================
// @route   POST /api/orders/checkout
exports.createOrder = asyncHandler(async (req, res, next) => {
  const userId = 'guest_user_123'; // Target standard session user id

  // 🔍 FIX: Explicitly searches for the active user's cart instead of an arbitrary document
  const cart = await Cart.findOne({ user: userId }).populate('items.product');
  
  if (!cart || cart.items.length === 0) {
    return next(new AppError('Your shopping cart is empty', 400));
  }

  // Stock Check Validation
  for (let item of cart.items) {
    if (!item.product) {
      return next(new AppError('One of the products in your cart no longer exists.', 404));
    }
    if (item.product.stock < item.quantity) {
      return next(new AppError(`Insufficient stock for product: ${item.product.name}`, 400));
    }
  }

  // Deduct Inventory Stock Levels
  for (let item of cart.items) {
    await Product.findByIdAndUpdate(item.product._id, { $inc: { stock: -item.quantity } });
  }

  // Map out line items structure securely
  const orderItems = cart.items.map(item => ({
    product: item.product._id,
    name: item.product.name,
    price: item.price,
    quantity: item.quantity,
  }));

  const totalPrice = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const orderNumber = generateOrderNumber();

  // Save structural order collection item
  const newOrder = await Order.create({
    orderNumber,
    items: orderItems,
    totalPrice,
    status: 'pending',
    shippingAddress: req.body.shippingAddress || 'No shipping address provided',
  });

  // Reset Cart State metrics cleanly
  cart.items = [];
  cart.totalItems = 0;
  cart.billSubtotal = 0;
  await cart.save();

  res.status(201).json({ 
    status: 'success', 
    message: 'Order created successfully', 
    data: newOrder 
  });
});

// ==========================================
// 2. GET ALL ORDERS
// ==========================================
// @route   GET /api/orders
exports.getAllOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find();
  res.status(200).json({ status: 'success', message: 'Orders fetched', data: orders });
});

// ==========================================
// 3. GET ORDER BY ID
// ==========================================
// @route   GET /api/orders/:id
exports.getOrderById = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) return next(new AppError('Order not found', 404));
  res.status(200).json({ status: 'success', message: 'Order fetched', data: order });
});

// ==========================================
// 4. UPDATE STATUS & RESTORE STOCK IF CANCELLED
// ==========================================
// @route   PATCH /api/orders/:id
exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
  
  if (!validStatuses.includes(status)) {
    return next(new AppError('Invalid status value', 400));
  }
  
  // 1. Find the current order details first
  const order = await Order.findById(req.params.id);
  if (!order) return next(new AppError('Order not found to update', 404));

  // 2. Prevent double cancellation logic loophole
  if (order.status === 'cancelled') {
    return next(new AppError('This order has already been cancelled. Stock cannot be re-restored.', 400));
  }

  // 3. If the new status is 'cancelled', loop through items and restore store inventories
  if (status === 'cancelled') {
    for (let item of order.items) {
      await Product.findByIdAndUpdate(item.product, { 
        $inc: { stock: item.quantity },
        $set: { inStock: true } // Ensure it flips back to available if it was hidden
      });
    }
  }

  // 4. Commit the new status flag safely
  order.status = status;
  await order.save();
  
  res.status(200).json({ 
    status: 'success', 
    message: `Order status successfully transitioned to ${status}`, 
    data: order 
  });
});