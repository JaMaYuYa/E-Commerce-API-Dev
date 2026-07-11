// routes/cartRoutes.js
const express = require('express');
const router = express.Router();

// 🔍 Double-check the spelling inside this object destruction line!
const { 
  getCart, 
  addItemToCart, 
  removeCartItem 
} = require('../controllers/cartController');

// Define the endpoints cleanly
router.route('/')
  .get(getCart)
  .post(addItemToCart);

// 🔍 Check Line 14 here: make sure it says 'removeCartItem' and NOT an undefined name!
router.route('/:productId')
  .delete(removeCartItem);

module.exports = router;