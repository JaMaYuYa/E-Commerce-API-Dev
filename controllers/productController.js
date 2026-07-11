// controllers/productController.js
const Product = require('../models/product.model');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

// ==========================================
// 1. GET ALL PRODUCTS (WITH ADVANCED FILTERING)
// ==========================================
// @route   GET /api/products
// @access  Public
const getAllProducts = asyncHandler(async (req, res, next) => {
  // A. ADVANCED FILTERING
  let queryObj = { ...req.query };

  // Parse flattened bracket structures sent by Postman query strings
  if (req.query['price[gte]'] || req.query['price[lte]']) {
    queryObj.price = {};
    if (req.query['price[gte]']) queryObj.price.gte = req.query['price[gte]'];
    if (req.query['price[lte]']) queryObj.price.lte = req.query['price[lte]'];
    delete queryObj['price[gte]'];
    delete queryObj['price[lte]'];
  }

  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach(el => delete queryObj[el]);

  // Turn operators (gte, gt, lte, lt) into MongoDB syntax ($gte, $gt, etc.)
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

  const parsedQuery = JSON.parse(queryStr);
  
  // Cast parameters to Numbers so MongoDB math comparisons run perfectly
  if (parsedQuery.price && typeof parsedQuery.price === 'object') {
    Object.keys(parsedQuery.price).forEach(key => {
      parsedQuery.price[key] = Number(parsedQuery.price[key]);
    });
  }

  console.log('--- EXECUTING MONGOOSE QUERY CRITERIA ---', parsedQuery);
  let query = Product.find(parsedQuery);
  query = query.populate('category', 'name slug');

  // B. SORTING
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt'); 
  }

  // C. FIELD LIMITING (PROJECTION)
  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ');
    query = query.select(fields);
  } else {
    query = query.select('-__v'); 
  }

  // Execute Compiled Query Statement
  const products = await query;

  res.status(200).json({
    status: 'success',
    results: products.length,
    data: { products }
  });
});

// ==========================================
// 2. GET SINGLE PRODUCT BY ID
// ==========================================
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError('No product found with that specific ID.', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { product }
  });
});

// ==========================================
// 3. CREATE NEW PRODUCT
// ==========================================
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res, next) => {
  const newProduct = await Product.create(req.body);

  res.status(201).json({
    status: 'success',
    data: { product: newProduct }
  });
});

// ==========================================
// 4. UPDATE PRODUCT BY ID
// ==========================================
// @route   PATCH /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res, next) => {
  const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!updatedProduct) {
    return next(new AppError('No product found with that specific ID to update.', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { product: updatedProduct }
  });
});

// ==========================================
// 5. DELETE PRODUCT BY ID
// ==========================================
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return next(new AppError('No product found with that specific ID to delete.', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};