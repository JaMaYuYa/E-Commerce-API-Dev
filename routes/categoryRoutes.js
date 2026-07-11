// routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const { validateCategory } = require('../middleware/validators'); // Import it here
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');

// Inject it into your POST route pipeline
router.route('/').get(getAllCategories).post(validateCategory, createCategory);
router.route('/:id').get(getCategoryById).patch(updateCategory).delete(deleteCategory);

module.exports = router;