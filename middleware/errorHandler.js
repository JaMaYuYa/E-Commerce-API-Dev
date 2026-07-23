const AppError = require('../utils/appError');

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  let error = { ...err };
  error.message = err.message;

  // Handle Invalid ObjectId format -> 404
  if (err.name === 'CastError') {
    error = new AppError(`No item found with ID: ${err.value}`, 404);
  }

  // Handle Schema Enum/Validation failure -> 400
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((el) => el.message);
    error = new AppError(`Invalid input data: ${errors.join('. ')}`, 400);
  }

  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  } else {
    console.error('Unexpected Error:', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong on the server',
    });
  }
};

module.exports = errorHandler;