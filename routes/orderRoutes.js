const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/orderController');

router.route('/')
  .post(ordersController.createOrder)
  .get(ordersController.getAllOrders);

router.route('/:id')
  .get(ordersController.getOrder);

router.route('/:id/status')
  .patch(ordersController.updateOrderStatus)
  .put(ordersController.updateOrderStatus);

module.exports = router;