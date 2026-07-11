// middleware/errorHandler.js
const AppError = require('../utils/AppError');

// Transformation helper for MongoDB structural ID mismatches
const handleCastErrorDB = (err) => {
  const message = `Invalid format for resource ${err.path}: ${err.value}. Please verify your tracking or resource ID format.`;
  return new AppError(message, 400); // 400 Bad Request matches invalid input syntax
};

module.exports = (err, req, res, next) => {
  // Establish baseline default error states
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;
  error.status = err.status || 'error';

  // 🔍 Check for native MongoDB/Mongoose formatting exceptions
  if (err.name === 'CastError') {
    error = handleCastErrorDB(error);
  }

  // A. Trusted Operational Failures: Send clean structured JSON back to Postman
  if (error.isOperational) {
    return res.status(error.statusCode).json({
      status: error.status,
      message: error.message
    });
  }

  // B. Programming Bugs / Unknown System Exceptions: Mask sensitive system states
  console.error('💥 SYSTEM PIPELINE ERROR LOG:', err);
  return res.status(500).json({
    status: 'error',
    message: 'Something went completely wrong inside our servers. Please try again later.'
  });
};