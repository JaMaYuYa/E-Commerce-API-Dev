const Category = require('../models/category.model');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

exports.getAllCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find();
  res.status(200).json({ status: 'success', message: 'Categories fetched', data: categories });
});

exports.getCategoryById = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) return next(new AppError('Category not found', 404));
  res.status(200).json({ status: 'success', message: 'Category fetched', data: category });
});

exports.createCategory = asyncHandler(async (req, res, next) => {
  const { name, description } = req.body;
  if (!name) return next(new AppError('Category name is required', 400));
  
  const slug = name.toLowerCase().replace(/\s+/g, '-');
  const newCategory = await Category.create({ name, description, slug });
  res.status(201).json({ status: 'success', message: 'Category created', data: newCategory });
});

exports.updateCategory = asyncHandler(async (req, res, next) => {
  const { name, description } = req.body;
  const slug = name ? name.toLowerCase().replace(/\s+/g, '-') : undefined;

  const updatedCategory = await Category.findByIdAndUpdate(
    req.params.id,
    { name, description, slug },
    { new: true, runValidators: true }
  );
  if (!updatedCategory) return next(new AppError('Category not found to update', 404));

  res.status(200).json({ status: 'success', message: 'Category updated', data: updatedCategory });
});

exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const deleted = await Category.findByIdAndDelete(req.params.id);
  if (!deleted) return next(new AppError('Category not found to delete', 404));
  res.status(200).json({ status: 'success', message: 'Category deleted' });
});