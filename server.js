const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

// Load environment config
dotenv.config();

// Connect to MongoDB Database
connectDB();

const app = express();

// Body Parser Middleware
app.use(express.json());

// Mount Routing Files
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);

const PORT = process.env.PORT ||5000;

app.listen(PORT, () => {
  console.log(`Server running in environment mode on port: ${PORT}`);
});