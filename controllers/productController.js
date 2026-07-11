// controllers/productController.js
const Product = require('../models/product.model');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

// ==========================================
// 1. GET ALL PRODUCTS (ADVANCED QUERY ENGINE)
// ==========================================
// @route   GET /api/products
exports.getAllProducts = asyncHandler(async (req, res, next) => {
  // A. Shallow copy query params
  const queryObj = { ...req.query };
  
  // Exclude administrative control fields from direct field matching
  const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
  excludedFields.forEach(el => delete queryObj[el]);

  // B. Bulletproof Filtering Engine
  // Resolves bracket syntax variations and enforces numeric values for operators
  let finalQuery = {};

  Object.keys(queryObj).forEach(key => {
    // Scenario A: Handles flat bracket formats like ?price[lte]=199
    if (key.includes('[') && key.includes(']')) {
      const field = key.split('[')[0]; 
      const operator = key.split('[')[1].replace(']', '');
      
      if (!finalQuery[field]) finalQuery[field] = {};
      finalQuery[field][`$${operator}`] = Number(queryObj[key]);
    } 
    // Scenario B: Handles native nested object parsers
    else if (typeof queryObj[key] === 'object' && queryObj[key] !== null) {
      finalQuery[key] = {};
      Object.keys(queryObj[key]).forEach(op => {
        finalQuery[key][`$${op}`] = Number(queryObj[key][op]);
      });
    } 
    // Scenario C: Standard flat matching fields (e.g., category=Apparel)
    else {
      finalQuery[key] = queryObj[key];
    }
  });

  // C. Regex Text Search Implementation
  if (req.query.search) {
    finalQuery.name = { $regex: req.query.search, $options: 'i' };
  }

  // Build the initial DB query statement
  let query = Product.find(finalQuery);

  // D. Multi-Criteria Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt'); // Default fallback: newest items first
  }

  // E. Smart Pagination Logic
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit);

  // Prevent accessing out-of-bounds empty result pages
  if (req.query.page) {
    const totalProducts = await Product.countDocuments(finalQuery);
    if (skip >= totalProducts) {
      return next(new AppError('The requested catalog page does not exist.', 404));
    }
  }

  // F. Execute fully assembled query pipeline
  const products = await query;

  res.status(200).json({
    status: 'success',
    results: products.length,
    page,
    data: { products }
  });
});

// ==========================================
// 2. GET PRODUCT BY ID
// ==========================================
// @route   GET /api/products/:id
exports.getProductById = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new AppError('No product found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: { product }
  });
});

// ==========================================
// 3. CREATE PRODUCT
// ==========================================
// @route   POST /api/products
exports.createProduct = asyncHandler(async (req, res, next) => {
  const newProduct = await Product.create(req.body);
  res.status(201).json({
    status: 'success',
    data: { product: newProduct }
  });
});

// ==========================================
// 4. UPDATE PRODUCT
// ==========================================
// @route   PATCH /api/products/:id
exports.updateProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!product) {
    return next(new AppError('No product found with that ID to update', 404));
  }
  res.status(200).json({
    status: 'success',
    data: { product }
  });
});

// ==========================================
// 5. DELETE PRODUCT
// ==========================================
// @route   DELETE /api/products/:id
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return next(new AppError('No product found with that ID to delete', 404));
  }
  res.status(204).json({
    status: 'success',
    data: null
  });
});