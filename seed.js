require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/category.model');
const Product = require('./models/product.model');

let Order;
try {
  Order = require('./models/order.model');
} catch (err) {
  Order = null;
}

const seedDatabase = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Database connected successfully!');

    console.log('Cleaning up old database records...');
    if (Order) {
      await Order.deleteMany({});
      console.log('Old Orders deleted');
    }
    await Product.deleteMany({});
    console.log('Old Products deleted');
    await Category.deleteMany({});
    console.log('Old Categories deleted');

    console.log('Inserting sample categories...');
    const categories = await Category.create([
      { name: 'Electronics', description: 'Gadgets and devices' },
      { name: 'Clothing', description: 'Clothing and apparel' },
      { name: 'Books', description: 'Written books and educational literature' }
    ]);
    console.log(`Added ${categories.length} categories.`);

    const [electronics, clothing, books] = categories;

    console.log('Inserting sample products...');
    const productsList = [
      // === ELECTRONICS (6 Products) ===
      {
        name: 'Smartphone',
        description: 'Latest model smartphone with premium camera array.',
        price: 699,
        stock: 50,
        category: electronics._id,
        images: [],
        inStock: true
      },
      {
        name: 'Laptop',
        description: 'Powerful gaming and core productivity laptop with 16GB RAM.',
        price: 1299,
        stock: 30,
        category: electronics._id,
        images: [],
        inStock: true
      },
      {
        name: 'Wireless Headphones',
        description: 'Active noise-canceling over-ear high-fidelity headphones.',
        price: 199,
        stock: 45,
        category: electronics._id,
        images: [],
        inStock: true
      },
      {
        name: 'Smartwatch',
        description: 'Fitness tracking watch with built-in GPS and heart monitor.',
        price: 249,
        stock: 40,
        category: electronics._id,
        images: [],
        inStock: true
      },
      {
        name: 'Bluetooth Speaker',
        description: 'Portable waterproof wireless speaker with deep bass profile.',
        price: 89,
        stock: 75,
        category: electronics._id,
        images: [],
        inStock: true
      },
      {
        name: 'Tablet computer',
        description: 'Ultra-thin lightweight computing tablet with vivid stylus display.',
        price: 450,
        stock: 20,
        category: electronics._id,
        images: [],
        inStock: true
      },

      // === CLOTHING (6 Products) ===
      {
        name: 'T-Shirt',
        description: 'Comfortable premium organic cotton crewneck t-shirt.',
        price: 19,
        stock: 100,
        category: clothing._id,
        images: [],
        inStock: true
      },
      {
        name: 'Jeans',
        description: 'Durable and classic slim-fit stretch denim jeans.',
        price: 49,
        stock: 60,
        category: clothing._id,
        images: [],
        inStock: true
      },
      {
        name: 'Hoodie',
        description: 'Cozy, fleece-lined pullover sweatshirt with front pocket.',
        price: 39,
        stock: 85,
        category: clothing._id,
        images: [],
        inStock: true
      },
      {
        name: 'Jacket',
        description: 'Water-resistant lightweight windbreaker jacket for outdoor use.',
        price: 79,
        stock: 35,
        category: clothing._id,
        images: [],
        inStock: true
      },
      {
        name: 'Sneakers',
        description: 'Breathable running shoes built with responsive sole cushioning.',
        price: 95,
        stock: 50,
        category: clothing._id,
        images: [],
        inStock: true
      },
      {
        name: 'Socks Pack',
        description: 'Pack of five durable ankle socks woven with reinforced heels.',
        price: 12,
        stock: 150,
        category: clothing._id,
        images: [],
        inStock: true
      },

      // === BOOKS (6 Products) ===
      {
        name: 'Novel Book',
        description: 'An intriguing, suspenseful bestselling fictional novel.',
        price: 15,
        stock: 80,
        category: books._id,
        images: [],
        inStock: true
      },
      {
        name: 'Science Book',
        description: 'Educational science textbook covering fundamental physics concepts.',
        price: 25,
        stock: 40,
        category: books._id,
        images: [],
        inStock: true
      },
      {
        name: 'History Book',
        description: 'Comprehensive historical overview documenting ancient world civilizations.',
        price: 30,
        stock: 25,
        category: books._id,
        images: [],
        inStock: true
      },
      {
        name: 'Cookbook',
        description: 'Over one hundred simple recipes focusing on quick healthy dinners.',
        price: 22,
        stock: 55,
        category: books._id,
        images: [],
        inStock: true
      },
      {
        name: 'Fantasy Novel',
        description: 'Epic world-building fantasy adventure involving dragons and empires.',
        price: 18,
        stock: 90,
        category: books._id,
        images: [],
        inStock: true
      },
      {
        name: 'Biography Book',
        description: 'Inspirational written life narrative detailing a major technological pioneer.',
        price: 28,
        stock: 30,
        category: books._id,
        images: [],
        inStock: true
      }
    ];

    const products = await Product.create(productsList);
    console.log(`Added ${products.length} products.`);

    console.log('=========================================');
    console.log('SEEDING COMPLETED SUCCESSFULLY!');
    console.log(`- Total Categories Injected: ${categories.length}`);
    console.log(`- Total Products Injected: ${products.length}`);
    console.log('=========================================');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from database safely.');
  }
};

seedDatabase();