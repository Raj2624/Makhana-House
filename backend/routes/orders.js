const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// @route   POST /api/orders
// @desc    Create a new order (handles authenticated and guest checkout)
router.post('/', async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
      couponApplied,
      discountAmount,
      shippingPrice,
      totalAmount,
      userId // Optional userId sent from frontend
    } = req.body;

    if (!items || items.length === 0 || !shippingAddress || !totalAmount) {
      return res.status(400).json({ message: 'Order details are incomplete' });
    }

    // Dynamic stock adjustment
    for (const item of items) {
      const dbProd = await Product.findById(item.productId);
      if (dbProd) {
        const newStock = Math.max(0, dbProd.stock - item.quantity);
        await Product.findByIdAndUpdate(item.productId, { stock: newStock });
      }
    }

    // Payment simulation setup
    let paymentStatus = 'Pending';
    let paymentId = undefined;

    if (paymentMethod === 'COD') {
      paymentStatus = 'Pending';
    } else if (paymentMethod === 'Razorpay') {
      // Simulate successful payment instantly or return completed payment
      paymentStatus = 'Completed';
      paymentId = 'pay_rzp_' + Math.random().toString(36).substr(2, 9);
    }

    const orderData = {
      user: userId || 'guest',
      items,
      shippingAddress,
      paymentMethod,
      paymentStatus,
      paymentId,
      couponApplied,
      discountAmount: Number(discountAmount) || 0,
      shippingPrice: Number(shippingPrice) || 0,
      totalAmount: Number(totalAmount),
      orderStatus: 'Processing'
    };

    const newOrder = await Order.create(orderData);
    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Order creation error:', error.message);
    res.status(500).json({ message: 'Server error creating order' });
  }
});

// @route   GET /api/orders/my
// @desc    Get order history of authenticated user
router.get('/my', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id });
    res.json(orders);
  } catch (error) {
    console.error('Fetch user orders error:', error.message);
    res.status(500).json({ message: 'Server error fetching user orders' });
  }
});

// @route   GET /api/orders
// @desc    Get all orders (Admin only)
router.get('/', auth, admin, async (req, res) => {
  try {
    const orders = await Order.find({});
    res.json(orders);
  } catch (error) {
    console.error('Fetch all orders error:', error.message);
    res.status(500).json({ message: 'Server error fetching all orders' });
  }
});

// @route   PUT /api/orders/:id
// @desc    Update order status or payment status (Admin only)
router.put('/:id', auth, admin, async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const updateData = {};
    if (orderStatus) updateData.orderStatus = orderStatus;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, updateData);
    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(updatedOrder);
  } catch (error) {
    console.error('Update order status error:', error.message);
    res.status(500).json({ message: 'Server error updating order' });
  }
});

module.exports = router;
