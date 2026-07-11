// middleware/validators.js
const { body, validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

exports.validateCategory = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Category name is required via validation layers'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMsg = errors.array().map(err => err.msg).join(', ');
      return next(new AppError(errorMsg, 400));
    }
    next();
  }
];