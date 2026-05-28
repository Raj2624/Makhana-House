const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const db = require('../config/db');

// @route   GET /api/analytics
// @desc    Get dashboard analytics indicators (Admin only)
router.get('/', auth, admin, async (req, res) => {
  try {
    let ordersList = [];
    let productsCount = 0;
    let usersCount = 0;
    let categorySales = {};

    if (db.isMock()) {
      const data = db.getLocalDb();
      ordersList = [...data.orders];
      productsCount = data.products.length;
      usersCount = data.users.length;
    } else {
      ordersList = await Order.MongoModel.find({});
      productsCount = await Product.MongoModel.countDocuments({});
      usersCount = await User.MongoModel.countDocuments({});
    }

    // Process sales metrics
    let totalSales = 0;
    let totalOrders = ordersList.length;
    let pendingOrders = 0;
    let deliveredOrders = 0;

    ordersList.forEach(o => {
      // Completed, COD or Processing are counted as active sales
      if (o.paymentStatus === 'Completed' || o.paymentMethod === 'COD') {
        totalSales += o.totalAmount;
      }
      
      if (o.orderStatus === 'Processing') pendingOrders++;
      if (o.orderStatus === 'Delivered') deliveredOrders++;

      // Compute sales per category
      if (o.items && Array.isArray(o.items)) {
        o.items.forEach(item => {
          // In mock database, we might have full items, let's fetch default categories
          // Or we can group by item names
          const cat = item.name.includes('Makhana') ? 'Makhana' : 
                      item.name.includes('Seed') ? 'Seeds' : 
                      item.name.includes('Mix') ? 'Trail Mixes' : 'Dry Fruits';
          categorySales[cat] = (categorySales[cat] || 0) + (item.price * item.quantity);
        });
      }
    });

    // Generate simulated monthly charts data
    const monthlySales = [
      { month: 'Jan', sales: Math.round(totalSales * 0.1) },
      { month: 'Feb', sales: Math.round(totalSales * 0.15) },
      { month: 'Mar', sales: Math.round(totalSales * 0.2) },
      { month: 'Apr', sales: Math.round(totalSales * 0.25) },
      { month: 'May', sales: Math.round(totalSales * 0.3) }
    ];

    res.json({
      totalSales,
      totalOrders,
      productsCount,
      usersCount,
      pendingOrders,
      deliveredOrders,
      categoryDistribution: Object.keys(categorySales).map(key => ({
        name: key,
        value: categorySales[key]
      })),
      monthlySales,
      recentOrders: ordersList.slice(0, 5) // Last 5 orders
    });
  } catch (error) {
    console.error('Analytics fetch error:', error.message);
    res.status(500).json({ message: 'Server error generating dashboard analytics' });
  }
});

module.exports = router;
