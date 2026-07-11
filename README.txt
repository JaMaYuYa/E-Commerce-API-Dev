========================================================================
                      E-COMMERCE BACKEND API SYSTEM
========================================================================

A fully-featured, production-ready RESTful API for an e-commerce platform 
built using Node.js, Express.js, and MongoDB. The system includes full 
catalog management, advanced filtering, an active shopping cart system, 
inventory-aware checkout pipelines, and a robust centralized error-handling 
architecture.

------------------------------------------------------------------------
1. KEY FEATURES
------------------------------------------------------------------------
* Advanced Product Catalog Engine: Supports name/description string searching 
  via case-insensitive regex, range-bound price queries (minPrice/maxPrice), 
  category filtering, and inventory status visibility checks.
* Active Shopping Cart Subsystem: Automatically binds a global persistent cart 
  instance, dynamically manages line items, checks inventory ceilings, and 
  updates prices instantly.
* Inventory-Aware Checkout (Orders): Runs atomic verification across items 
  before checkout, updates inventory levels safely using Mongoose $inc 
  operations, records unique tracking IDs, and clears out successful checkouts.
* Centralized Error Middleware Pipeline (Task 8): Bypasses unstructured 
  try-catch blocks with custom promise tracking. Intercepts Mongoose Validation 
  errors, CastError anomalies, and duplicate key conflicts (code 11000) to 
  present uniform data outputs.
* Database Seeding Interface: Built-in catalog hydration engine to clear out 
  collections and instantly establish 3 distinct categories populated with 
  6 individual products each.

------------------------------------------------------------------------
2. TECH STACK
------------------------------------------------------------------------
* Runtime Environment: Node.js
* Backend Framework: Express.js
* Database Management System: MongoDB Atlas / Local MongoDB Enterprise
* Object Data Modeling (ODM): Mongoose
* Security Layer: Express-Mongo-Sanitize (Prevents NoSQL Injection)

------------------------------------------------------------------------
3. PREREQUISITES & INSTALLATION STEPS
------------------------------------------------------------------------
Prerequisites:
  - Node.js (v16.x or higher recommended)
  - MongoDB installed locally or a remote MongoDB Atlas connection URI string.

Installation Steps:
  1. Clone the repository:
     git clone <your-repository-url>
     cd my-final-mongo

  2. Install project dependencies:
     npm install

  3. Configure the environment variables:
     Create a '.env' file in the root directory of the project and populate 
     it with your specific database keys (see the variables table below).

  4. Hydrate and seed the database collections:
     Run the seeding script to safely drop older reference assets and 
     automatically set up 3 categories containing exactly 6 products each:
     npm run seed

  5. Execute the development server:
     Launch the system in reload monitoring state using Nodemon:
     npm run dev

------------------------------------------------------------------------
4. ENVIRONMENT VARIABLES TABLE
------------------------------------------------------------------------
Variable     Description                                Example / Default
------------------------------------------------------------------------
PORT         The port network address the Express       5000
             application runs on.
             
NODE_ENV     The structural operational environment     development
             tracking flag.
             
MONGO_URI    The cluster database driver connection     mongodb://127.0.0.1:27017/
             URI string.                                my-final-mongo

------------------------------------------------------------------------
5. API ENDPOINTS DIRECTORY
------------------------------------------------------------------------
Categories Management:
  - GET    /api/categories         | Retrieve all registered category collections.
  - POST   /api/categories         | Insert a new unique category (Auto-slugs).
  - GET    /api/categories/:id     | Fetch details map for a single specific ID.
  - PATCH  /api/categories/:id     | Modify descriptive category configurations.
  - DELETE /api/categories/:id     | Remove a category resource from the database.

Products Management:
  - GET    /api/products           | Fetch filtered list (?search=, ?minPrice=, 
                                     ?maxPrice=, ?category=).
  - POST   /api/products           | Append a new product (Validates Category ID).
  - GET    /api/products/:id       | Fetch single product populated with Category.
  - PATCH  /api/products/:id       | Update physical stock parameters or pricing.
  - DELETE /api/products/:id       | Drop a target product from the active catalog.

Shopping Cart Management:
  - GET    /api/cart               | Fetch global active cart parameters with items.
  - POST   /api/cart/items         | Add/increment product counts (Enforces stock check).
  - DELETE /api/cart              | Flush and reset the active cart contents to zero.

Orders & Checkout Systems:
  - POST   /api/orders             | Checkout cart items, reduce stock, and save logs.
  - GET    /api/orders             | Fetch full historical transaction ledger.
  - GET    /api/orders/:id         | Fetch specific invoice payload metrics by ID.
  - PATCH  /api/orders/:id/status  | Transition status enums through order workflow.

------------------------------------------------------------------------
6. PROJECT STRUCTURE TREE
------------------------------------------------------------------------
my-final-mongo/
├── config/
│   └── db.js                 # Core database driver connection logic
├── db/
│   └── connect.js            # Required architectural pipeline wrapper bridge
├── controllers/
│   ├── categoryController.js # Handles category maps and regex slug updates
│   ├── productController.js  # Runs advanced product filters and search queries
│   ├── cartController.js     # Orchestrates cart document calculation models
│   └── orderController.js    # Manages stock checkout deduction metrics
├── middleware/
│   └── errorHandler.js       # Centralized error formatter (Task 8 compliance)
├── models/
│   ├── category.model.js     # Schema blueprint tracking unique category items
│   ├── product.model.js      # Product data schema defining structural validations
│   ├── cart.model.js         # Single structural active shopping cart schema
│   └── order.model.js        # Strict order tracking structure with status enums
├── routes/
│   ├── categoryRoutes.js     # Endpoint mapping layer for /api/categories
│   ├── productRoutes.js      # Endpoint mapping layer for /api/products
│   ├── cartRoutes.js         # Endpoint mapping layer for /api/cart
│   └── orderRoutes.js        # Endpoint mapping layer for /api/orders
├── utils/
│   ├── AppError.js           # Custom operational exception wrapper object
│   └── asyncHandler.js       # Asynchronous structural wrapper resolving promises
├── .env                      # Secret configuration keys (Excluded via gitignore)
├── .env.example              # Blueprint template variables configuration
├── .gitignore                # Target version control system exclusion path ledger
├── app.js                    # Core application initialization pipeline module root
├── package.json              # Technical dependencies and system scripts map
└── seed.js                   # 18-Product catalog hydration script utility

========================================================================
