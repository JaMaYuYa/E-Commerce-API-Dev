const AppError = require('../utils/appError');

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  let error = { ...err };
  error.message = err.message;

  if (err.name === 'CastError') {
    error = new AppError(`Invalid ${err.path}: ${err.value}`, 400);
  }

  if (err.code === 11000) {
    const value = Object.values(err.keyValue)[0];
    error = new AppError(`Duplicate field value: "${value}". Please use another value.`, 400);
  }

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