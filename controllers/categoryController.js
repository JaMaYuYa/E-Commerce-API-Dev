const Category = require('../models/category.model');
const AppError = require('../utils/appError');
const asyncHandler = require('../utils/asyncHandler');

exports.getAllCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find();
  res.status(200).json({
    status: 'success',
    message: 'Categories retrieved successfully',
    data: { categories },
  });
});

exports.getCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return next(new AppError('No category found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    message: 'Category retrieved successfully',
    data: { category },
  });
});

exports.createCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.create(req.body);
  res.status(201).json({
    status: 'success',
    message: 'Category created successfully',
    data: { category },
  });
});

exports.updateCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return next(new AppError('No category found with that ID', 404));
  }
  if (req.body.name) category.name = req.body.name;
  if (req.body.description !== undefined) category.description = req.body.description;
  await category.save();
  res.status(200).json({
    status: 'success',
    message: 'Category updated successfully',
    data: { category },
  });
});

exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    return next(new AppError('No category found with that ID', 404));
  }
  res.status(204).json({
    status: 'success',
    message: 'Category deleted successfully',
    data: null,
  });
});