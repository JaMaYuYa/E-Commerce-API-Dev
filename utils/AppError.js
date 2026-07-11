// utils/AppError.js
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    // If the code is in the 4xx range, it's a client 'fail', otherwise it's a server 'error'
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    
    // Marks the error as operational (an expected user/input error, not a code crash)
    this.isOperational = true;

    // Captures the stack trace so you can easily see where the error occurred during debugging
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;