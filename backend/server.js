const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB, isMock, getLocalDb, saveLocalDb } = require('./config/db');

// Load environment variables
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Basic welcome route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Makhana House Premium eCommerce API',
    mode: isMock() ? 'Local JSON Database' : 'MongoDB Connection',
    status: 'online'
  });
});

// Register API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/blogs', require('./routes/blogs'));
app.use('/api/coupons', require('./routes/coupons'));
app.use('/api/analytics', require('./routes/analytics'));

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect to Database
  await connectDB();

  // Auto-seed database if empty (both in Mock JSON mode and MongoDB mode)
  try {
    const Product = require('./models/Product');
    const seed = require('./scripts/seed');
    
    if (isMock()) {
      const data = getLocalDb();
      if (!data.products || data.products.length === 0) {
        console.log('🌱 Local database is empty. Auto-seeding default premium snack products, blogs, and coupons...');
        seed.seedLocalDirect();
        console.log('✅ Auto-seed completed successfully!');
      }
    } else {
      const productCount = await Product.MongoModel.countDocuments({});
      if (productCount === 0) {
        console.log('🌱 MongoDB database is empty. Auto-seeding default premium snack products, blogs, and coupons...');
        await seed.seedMongo();
        console.log('✅ MongoDB auto-seed completed successfully!');
      }
    }
  } catch (err) {
    console.error('⚠️ Auto-seed check/execution encountered an error:', err.message);
  }

  // Start Express listener
  app.listen(PORT, () => {
    console.log(`🚀 Server successfully running on port ${PORT}`);
    console.log(`📍 API Base URL: http://localhost:${PORT}/api`);
  });
};

startServer();
