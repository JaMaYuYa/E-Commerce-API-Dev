<<<<<<< HEAD
# E-Commerce Backend API 

A backend API for an e-commerce website that manages categories, products, shopping carts, and order.

**Tech Stack:** Node.js, Express.js, MongoDB, Mongoose

---
## Features

* **Categories API:** Complete CRUD operations to organize products by category.
* **Products API:** Manage products with filtering, searching, and inventory tracking.
* **Cart API:** Add items, update quantities, remove items, and calculate total price dynamically per authenticated user.
* **Orders API:** Convert shopping cart items into persistent orders with dynamic total calculation and shipping details.

---
## Prerequisites

* **Node.js:** v18.x or higher
* **npm:** v9.x or higher (or yarn)
* **MongoDB:** Local instance running on port `27017` OR a MongoDB Atlas connection URI

---
## Installation

Follow these steps to set up and run the API locally after you **Clone the repository**:

 1. Install packages:
      npm install
 2. set up .env file:
      cp .env.example .env
 3. Seed database:
      npm run seed
 4. Run dev server:
      npm run dev

---
## Environment Variables
 **port**: for the Express HTTP server
 **NODE_ENV**: Runtime environment mode
 **MONGO_URI**: MongoDB connection string

---
## API Endpoints
**Categories API**:
   * GET	{{baseUrl}}/categories      Retrieve all categories
   * GET	{{baseUrl}}/categories/:id     Fetch a single category by ID
   * POST	{{baseUrl}}/categories      Create a new category
   * PUT	{{baseUrl}}/categories/:id     Update an existing category
   * DELETE	{{baseUrl}}/categories/:id     Delete a category

**Products API**
   * GET	{{baseUrl}}/products     Retrieve products with pagination and filter params
   * GET	{{baseUrl}}/products/:id    Get details for a single product
   * POST	{{baseUrl}}/products     Create a new product entry
   * PUT	{{baseUrl}}/products/:id    Update product details or stock
   * DELETE	{{baseUrl}}/products/:id    Remove a product from the database

**Cart API**
   * GET	{{baseUrl}}/cart      Get current cart and items for the authenticated user
   * POST	{{baseUrl}}/cart      Add a product and quantity to the cart
   * PUT	{{baseUrl}}/cart/:itemId    Update item quantity in cart
   * DELETE	{{baseUrl}}/cart/:itemId    Remove a specific item from cart
   * DELETE	{{baseUrl}}/cart      Clear all contents from cart

**Orders API**
   * POST	{{baseUrl}}/orders    Create an order using active cart items and shipping details
   * GET	{{baseUrl}}/orders    Get all past orders for the logged-in user
   * GET	{{baseUrl}}/orders/:id      Fetch order details by Order ID



## Project Structure
ecommerce-api/
├── config/             # Database connection & system configuration files
│   └── db.js           # Mongoose connection logic
├── controllers/        # Express route handlers and core business logic
│   ├── categoryController.js
│   ├── productController.js
│   ├── cartController.js
│   └── orderController.js
├── middleware/         # Middleware functions 
│   └── errorMiddleware.js
├── models/             # Mongoose schemas representing database collections
│   ├── Category.js
│   ├── Product.js
│   ├── Cart.js
│   └── Order.js
├── postman/            # Postman collection and environment configurations
│   ├── E-Commerce API Dev.postman_collection.json
│   └── E-Commerce API Dev.postman_environment.json
├── routes/             # Route endpoint declarations mapped to controllers
│   ├── categoryRoutes.js
│   ├── productRoutes.js
│   ├── cartRoutes.js
│   └── orderRoutes.js
├── seed.js           # CLI script to seed/wipe mock data in MongoDB
├── .env.example        # Environment variable definitions template
├── .gitignore          # Excluded files and build folders from version control
├── package.json        # Node.js project manifest, dependencies, and scripts
├── README.md           # Project documentation
└── app.js           # Entry point for starting the Express HTTP server
=======
# E-Commerce Backend API 

A backend API for an e-commerce website that manages categories, products, shopping carts, and order.

**Tech Stack:** Node.js, Express.js, MongoDB, Mongoose

---
## Features

* **Categories API:** Complete CRUD operations to organize products by category.
* **Products API:** Manage products with filtering, searching, and inventory tracking.
* **Cart API:** Add items, update quantities, remove items, and calculate total price dynamically per authenticated user.
* **Orders API:** Convert shopping cart items into persistent orders with dynamic total calculation and shipping details.

---
## Prerequisites

* **Node.js:** v18.x or higher
* **npm:** v9.x or higher (or yarn)
* **MongoDB:** Local instance running on port `27017` OR a MongoDB Atlas connection URI

---
## Installation

Follow these steps to set up and run the API locally after you **Clone the repository**:

 1. Install packages:
      npm install
 2. set up .env file:
      cp .env.example .env
 3. Seed database:
      npm run seed
 4. Run dev server:
      npm run dev

---
## Environment Variables
 **port**: for the Express HTTP server
 **NODE_ENV**: Runtime environment mode
 **MONGO_URI**: MongoDB connection string

---
## API Endpoints
**Categories API**:
   * GET	{{baseUrl}}/categories      Retrieve all categories
   * GET	{{baseUrl}}/categories/:id     Fetch a single category by ID
   * POST	{{baseUrl}}/categories      Create a new category
   * PUT	{{baseUrl}}/categories/:id     Update an existing category
   * DELETE	{{baseUrl}}/categories/:id     Delete a category

**Products API**
   * GET	{{baseUrl}}/products     Retrieve products with pagination and filter params
   * GET	{{baseUrl}}/products/:id    Get details for a single product
   * POST	{{baseUrl}}/products     Create a new product entry
   * PUT	{{baseUrl}}/products/:id    Update product details or stock
   * DELETE	{{baseUrl}}/products/:id    Remove a product from the database

**Cart API**
   * GET	{{baseUrl}}/cart      Get current cart and items for the authenticated user
   * POST	{{baseUrl}}/cart      Add a product and quantity to the cart
   * PUT	{{baseUrl}}/cart/:itemId    Update item quantity in cart
   * DELETE	{{baseUrl}}/cart/:itemId    Remove a specific item from cart
   * DELETE	{{baseUrl}}/cart      Clear all contents from cart

**Orders API**
   * POST	{{baseUrl}}/orders    Create an order using active cart items and shipping details
   * GET	{{baseUrl}}/orders    Get all past orders for the logged-in user
   * GET	{{baseUrl}}/orders/:id      Fetch order details by Order ID



## Project Structure
ecommerce-api/
├── config/             # Database connection & system configuration files
│   └── db.js           # Mongoose connection logic
├── controllers/        # Express route handlers and core business logic
│   ├── categoryController.js
│   ├── productController.js
│   ├── cartController.js
│   └── orderController.js
├── middleware/         # Middleware functions 
│   └── errorMiddleware.js
├── models/             # Mongoose schemas representing database collections
│   ├── Category.js
│   ├── Product.js
│   ├── Cart.js
│   └── Order.js
├── postman/            # Postman collection and environment configurations
│   ├── E-Commerce API Dev.postman_collection.json
│   └── E-Commerce API Dev.postman_environment.json
├── routes/             # Route endpoint declarations mapped to controllers
│   ├── categoryRoutes.js
│   ├── productRoutes.js
│   ├── cartRoutes.js
│   └── orderRoutes.js
├── seed.js           # CLI script to seed/wipe mock data in MongoDB
├── .env.example        # Environment variable definitions template
├── .gitignore          # Excluded files and build folders from version control
├── package.json        # Node.js project manifest, dependencies, and scripts
├── README.md           # Project documentation
└── app.js           # Entry point for starting the Express HTTP server
>>>>>>> 52e473a3d5c0a7d848fcb77558beaa85642d5d85
