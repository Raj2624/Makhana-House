const express = require('express');
const router = express.Router();
const Coupon = require('../models/Coupon');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// @route   POST /api/coupons/validate
// @desc    Validate a promo code for discount check
router.post('/validate', async (req, res) => {
  try {
    const { code, amount } = req.body;

    if (!code) {
      return res.status(400).json({ message: 'Promo code is required' });
    }

    const coupon = await Coupon.findOne({ code });
    if (!coupon) {
      return res.status(404).json({ message: 'Invalid coupon code' });
    }

    if (!coupon.isActive) {
      return res.status(400).json({ message: 'This coupon is no longer active' });
    }

    const totalAmount = Number(amount) || 0;
    if (totalAmount < coupon.minOrderAmount) {
      return res.status(400).json({ 
        message: `This coupon requires a minimum purchase of ₹${coupon.minOrderAmount}` 
      });
    }

    // Calculate discount
    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = Math.round((coupon.discountValue / 100) * totalAmount);
    } else {
      discount = Math.min(coupon.discountValue, totalAmount);
    }

    res.json({
      valid: true,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount: discount
    });
  } catch (error) {
    console.error('Validate coupon error:', error.message);
    res.status(500).json({ message: 'Server error validating coupon' });
  }
});

// @route   GET /api/coupons
// @desc    Get all coupons (Admin only)
router.get('/', auth, admin, async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json(coupons);
  } catch (error) {
    console.error('Fetch coupons error:', error.message);
    res.status(500).json({ message: 'Server error fetching coupons' });
  }
});

// @route   POST /api/coupons
// @desc    Create a coupon (Admin only)
router.post('/', auth, admin, async (req, res) => {
  try {
    const { code, discountType, discountValue, minOrderAmount } = req.body;

    if (!code || !discountType || !discountValue) {
      return res.status(400).json({ message: 'Please provide code, type, and value' });
    }

    const newCoupon = await Coupon.create({
      code,
      discountType,
      discountValue: Number(discountValue),
      minOrderAmount: minOrderAmount ? Number(minOrderAmount) : 0
    });

    res.status(201).json(newCoupon);
  } catch (error) {
    console.error('Create coupon error:', error.message);
    res.status(500).json({ message: 'Server error creating coupon' });
  }
});

// @route   DELETE /api/coupons/:id
// @desc    Delete a coupon (Admin only)
router.delete('/:id', auth, admin, async (req, res) => {
  try {
    const deleted = await Coupon.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    res.json({ message: 'Coupon successfully deleted', id: req.params.id });
  } catch (error) {
    console.error('Delete coupon error:', error.message);
    res.status(500).json({ message: 'Server error deleting coupon' });
  }
});

module.exports = router;
