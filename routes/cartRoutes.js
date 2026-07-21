const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.route('/')
  .get(cartController.getCart)
  .post(cartController.addItemToCart)
  .patch(cartController.updateCartItem)
  .delete(cartController.deleteCart);

router.route('/:productId')
  .delete(cartController.removeCartItem)
  .put(cartController.updateCartItem);


module.exports = router;