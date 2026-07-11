// routes/orderRoutes.js
const express = require('express');
const router = express.Router();

// Import the named methods directly from your controller
const { 
  createOrder, 
  getAllOrders, 
  getOrderById, 
  updateOrderStatus 
} = require('../controllers/orderController');

// ==========================================
// 1. ROUTE: /api/orders/checkout
// ==========================================
// Handled by app.use('/api/orders', orderRouter) in app.js
router.post('/checkout', createOrder);

// ==========================================
// 2. ROUTE: /api/orders/
// ==========================================
// Get all historical system orders
router.get('/', getAllOrders);

// ==========================================
// 3. ROUTE: /api/orders/:id
// ==========================================
// Get a single order details or update its fulfillment state
router.route('/:id')
  .get(getOrderById)
  .patch(updateOrderStatus);

module.exports = router;