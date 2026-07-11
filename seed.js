// seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./db/connect');

// Import All Models
const Category = require('./models/category.model');
const Product = require('./models/product.model');
const Cart = require('./models/cart.model');
const Order = require('./models/order.model');

const generateOrderNumber = () => {
  return 'ORD' + Math.floor(100000 + Math.random() * 900000);
};

const seedDB = async () => {
  try {
    // 1. Establish Database Connection
    await connectDB();

    // 2. Cleanup Data in Correct Logical Order
    console.log('Cleaning up existing collections...');
    await Order.deleteMany({});
    await Cart.deleteMany({});
    await Product.deleteMany({});
    await Category.deleteMany({});

    // 3. Seed Categories Collection (3 distinct categories)
    console.log('Seeding categories...');
    const categories = await Category.insertMany([
      { name: 'Electronics', description: 'Electronic gadgets, computing hardware, and modern devices', slug: 'electronics' },
      { name: 'Clothing', description: 'Premium apparel, textiles, and street fashion accessories', slug: 'clothing' },
      { name: 'Books', description: 'Educational materials, bestseller fiction, and sci-fi books', slug: 'books' },
    ]);

    const [electronics, clothing, books] = categories;

    // 4. Seed Products Collection (6 products in each category = 18 total)
    console.log('Seeding products (6 per category)...');
    const productsList = [
      // === ELECTRONICS (6 Products) ===
      {
        name: 'Smartphone',
        description: 'Latest model smartphone with premium camera array.',
        price: 699,
        stock: 50,
        category: electronics._id,
        images: ['smartphone.jpg'],
        inStock: true
      },
      {
        name: 'Laptop',
        description: 'Powerful gaming and core productivity laptop with 16GB RAM.',
        price: 1299,
        stock: 30,
        category: electronics._id,
        images: ['laptop.jpg'],
        inStock: true
      },
      {
        name: 'Wireless Headphones',
        description: 'Active noise-canceling over-ear high-fidelity headphones.',
        price: 199,
        stock: 45,
        category: electronics._id,
        images: ['headphones.jpg'],
        inStock: true
      },
      {
        name: 'Smartwatch',
        description: 'Fitness tracking watch with built-in GPS and heart monitor.',
        price: 249,
        stock: 40,
        category: electronics._id,
        images: ['smartwatch.jpg'],
        inStock: true
      },
      {
        name: 'Bluetooth Speaker',
        description: 'Portable waterproof wireless speaker with deep bass profile.',
        price: 89,
        stock: 75,
        category: electronics._id,
        images: ['speaker.jpg'],
        inStock: true
      },
      {
        name: 'Tablet computer',
        description: 'Ultra-thin lightweight computing tablet with vivid stylus display.',
        price: 450,
        stock: 20,
        category: electronics._id,
        images: ['tablet.jpg'],
        inStock: true
      },

      // === CLOTHING (6 Products) ===
      {
        name: 'T-Shirt',
        description: 'Comfortable premium organic cotton crewneck t-shirt.',
        price: 19,
        stock: 100,
        category: clothing._id,
        images: ['tshirt.jpg'],
        inStock: true
      },
      {
        name: 'Jeans',
        description: 'Durable and classic slim-fit stretch denim jeans.',
        price: 49,
        stock: 60,
        category: clothing._id,
        images: ['jeans.jpg'],
        inStock: true
      },
      {
        name: 'Hoodie',
        description: 'Cozy, fleece-lined pullover sweatshirt with front pocket.',
        price: 39,
        stock: 85,
        category: clothing._id,
        images: ['hoodie.jpg'],
        inStock: true
      },
      {
        name: 'Jacket',
        description: 'Water-resistant lightweight windbreaker jacket for outdoor use.',
        price: 79,
        stock: 35,
        category: clothing._id,
        images: ['jacket.jpg'],
        inStock: true
      },
      {
        name: 'Sneakers',
        description: 'Breathable running shoes built with responsive sole cushioning.',
        price: 95,
        stock: 50,
        category: clothing._id,
        images: ['sneakers.jpg'],
        inStock: true
      },
      {
        name: 'Socks Pack',
        description: 'Pack of five durable ankle socks woven with reinforced heels.',
        price: 12,
        stock: 150,
        category: clothing._id,
        images: ['socks.jpg'],
        inStock: true
      },

      // === BOOKS (6 Products) ===
      {
        name: 'Novel Book',
        description: 'An intriguing, suspenseful bestselling fictional novel.',
        price: 15,
        stock: 80,
        category: books._id,
        images: ['novel.jpg'],
        inStock: true
      },
      {
        name: 'Science Book',
        description: 'Educational science textbook covering fundamental physics concepts.',
        price: 25,
        stock: 40,
        category: books._id,
        images: ['science.jpg'],
        inStock: true
      },
      {
        name: 'History Book',
        description: 'Comprehensive historical overview documenting ancient world civilizations.',
        price: 30,
        stock: 25,
        category: books._id,
        images: ['history.jpg'],
        inStock: true
      },
      {
        name: 'Cookbook',
        description: 'Over one hundred simple recipes focusing on quick healthy dinners.',
        price: 22,
        stock: 55,
        category: books._id,
        images: ['cookbook.jpg'],
        inStock: true
      },
      {
        name: 'Fantasy Novel',
        description: 'Epic world-building fantasy adventure involving dragons and empires.',
        price: 18,
        stock: 90,
        category: books._id,
        images: ['fantasy.jpg'],
        inStock: true
      },
      {
        name: 'Biography Book',
        description: 'Inspirational written life narrative detailing a major technological pioneer.',
        price: 28,
        stock: 30,
        category: books._id,
        images: ['biography.jpg'],
        inStock: true
      }
    ];

    const seededProducts = await Product.insertMany(productsList);
    
    // Pick specific references for cart/order samples
    const prodSmartphone = seededProducts[0];
    const prodTshirt = seededProducts[6];
    const prodLaptop = seededProducts[1];

    // 5. Seed Global Active Cart
    console.log('Seeding active cart state...');
    await Cart.create({
      items: [
        {
          product: prodSmartphone._id,
          quantity: 1,
          price: prodSmartphone.price
        },
        {
          product: prodTshirt._id,
          quantity: 2,
          price: prodTshirt.price
        }
      ],
      totalPrice: (prodSmartphone.price * 1) + (prodTshirt.price * 2)
    });

    // 6. Seed Historical Order Logs
    console.log('Seeding order history archives...');
    await Order.create([
      {
        orderNumber: generateOrderNumber(),
        items: [
          {
            product: prodLaptop._id,
            name: prodLaptop.name,
            price: prodLaptop.price,
            quantity: 1
          }
        ],
        totalPrice: prodLaptop.price,
        status: 'delivered',
        shippingAddress: '123 Innovation Way, Tech District'
      }
    ]);

    console.log('\n===================================================');
    console.log('🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log(`- Created Categories : ${categories.length}`);
    console.log(`- Created Products   : ${seededProducts.length} (6 per category)`);
    console.log(`- Created Active Carts: 1`);
    console.log(`- Created Order Logs  : 1`);
    console.log('===================================================\n');

  } catch (err) {
    console.error('❌ Critical error encountered during database seeding:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB disconnected cleanly.');
    process.exit(0);
  }
};

// Execute Seeding Loop
seedDB();