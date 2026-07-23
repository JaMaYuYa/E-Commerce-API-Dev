const Product = require('../models/product.model');
const Category = require('../models/category.model');
const AppError = require('../utils/appError');
const asyncHandler = require('../utils/asyncHandler');

exports.getAllProducts = asyncHandler(async (req, res, next) => {
  let queryObj = {};

  if (req.query.category) {
    queryObj.category = req.query.category;
  }

  if (req.query.minPrice || req.query.maxPrice) {
    queryObj.price = {};
    if (req.query.minPrice) queryObj.price.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) queryObj.price.$lte = Number(req.query.maxPrice);
  }

  if (req.query.inStock === 'true') {
    queryObj.stock = { $gt: 0 };
  }

  if (req.query.search) {
    const searchRegex = { $regex: req.query.search, $options: 'i' };
    queryObj.$or = [{ name: searchRegex }, { description: searchRegex }];
  }

  const products = await Product.find(queryObj).populate('category', 'name description');
  res.status(200).json({
    status: 'success',
    message: 'Products retrieved successfully',
    data: { products },
  });
});

exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate('category', 'name description');
  if (!product) {
    return next(new AppError('No product found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    message: 'Product retrieved successfully',
    data: { product },
  });
});

exports.createProduct = asyncHandler(async (req, res, next) => {
  const categoryExists = await Category.findById(req.body.category);
  if (!categoryExists) {
    return next(new AppError('Category ID does not exist', 404));
  }
  const product = await Product.create(req.body);
  res.status(201).json({
    status: 'success',
    message: 'Product created successfully',
    data: { product },
  });
});

exports.updateProduct = asyncHandler(async (req, res, next) => {
  // 1. Only run the validation check if a category is explicitly sent in the body
  if (req.body.category !== undefined && req.body.category !== null) {
    const categoryExists = await Category.findById(req.body.category);
    if (!categoryExists) {
      return next(new AppError('Category ID does not exist', 404));
    }
  }

  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    return next(new AppError('No product found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Product updated successfully',
    data: { product },
  });
});

exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return next(new AppError('No product found with that ID', 404));
  }
  res.status(204).json({
    status: 'success',
    message: 'Product deleted successfully',
    data: null,
  });
});