// seeder.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// 1. Load environment variables
dotenv.config();

// Import your Mongoose models
const Category = require('./models/category');
const Product = require('./models/product');

// Sample Data Arrays
const sampleCategories = [
  { name: 'Electronics', description: 'Gadgets, devices, and accessories' },
  { name: 'Books', description: 'Fiction, non-fiction, and educational textbooks' }
];

const seedDatabase = async () => {
  try {
    // 2. Connect to MongoDB using your URI from the .env file
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    // 3. Clear existing data to start fresh
    await Category.deleteMany();
    await Product.deleteMany();
    console.log('Old data cleared successfully!');

    // 4. Insert Categories first to generate their ObjectIds
    const createdCategories = await Category.insertMany(sampleCategories);
    
    // Grab the specific IDs of the newly created categories
    const electronicsId = createdCategories[0]._id;
    const booksId = createdCategories[1]._id;

    // 5. Map out your dummy products using those real Category IDs and your new 'stock' field
    const sampleProducts = [
      {
        name: 'Wireless Mouse',
        description: 'Ergonomic 2.4GHz wireless mouse with USB receiver',
        price: 25.99,
        stock: 50,
        category: electronicsId 
      },
      {
        name: 'Full-Stack Web Development Textbook',
        description: 'Learn modern JavaScript, Node.js, and MongoDB',
        price: 45.00,
        stock: 15, 
        category: booksId 
      }
    ];

    // Insert Products into the database
    await Product.insertMany(sampleProducts);
    console.log('Database seeded with dummy data successfully!');

    // 6. Disconnect from database cleanly
    mongoose.connection.close();
    process.exit(0); 

  } catch (error) {
    console.error(`Error with seeding database: ${error.message}`);
    process.exit(1); 
  }
};

// Execute the function
seedDatabase();