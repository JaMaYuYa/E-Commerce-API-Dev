// app.js
require('dotenv').config(); // MUST BE LINE 1
const express = require('express');
const mongoSanitize = require('express-mongo-sanitize');
const connectDB = require('./config/db'); // Core DB connection logic
const errorHandler = require('./middleware/errorHandler');
const AppError = require('./utils/AppError');

// Import Route Bundles
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

// ==========================================
// 1. GLOBAL MIDDLEWARE PIPELINE REGISTER
// ==========================================

// Body parsing middleware
app.use(express.json());

// Secure NoSQL Injection Protection
// Manual execution protects internal collections without throwing read-only property errors
app.use((req, res, next) => {
  if (req.body) {
    mongoSanitize.sanitize(req.body);
  }
  if (req.params) {
    mongoSanitize.sanitize(req.params);
  }
  next();
});

// ==========================================
// 2. RESOURCE ROUTE MOUNTING DIRECTORY
// ==========================================
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// ==========================================
// 3. UNHANDLED FALLBACK ROUTE INTERCEPTOR (404)
// ==========================================
// Omit path strings entirely to make it 100% stable across all modern routing libraries
app.use((req, res, next) => {
  next(new AppError(`The requested endpoint path [${req.originalUrl}] does not exist on this system.`, 404));
});

// ==========================================
// 4. CENTRAL CATCH-ALL ERROR HANDLER MIDDLEWARE
// ==========================================
app.use(errorHandler);

// ==========================================
// 5. BOOTSTRAP SYSTEM IGNITION PIPELINE
// ==========================================
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Await database cluster connection before opening the server network stream
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`Server running in [${process.env.NODE_ENV || 'development'}] mode on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to ignite server cluster pipeline due to critical database error:', err.message);
    process.exit(1);
  }
};

startServer();