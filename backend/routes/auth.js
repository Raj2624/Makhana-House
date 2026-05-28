const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// JWT Token helper
const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || 'makhanahousesecretkey';
  return jwt.sign({ id }, secret, { expiresIn: '7d' });
};

// @route   POST /api/auth/signup
// @desc    Register a new user
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please enter all required fields' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Set first user ever registered as admin to simplify local testing, otherwise standard 'user'
    let role = 'user';
    const isMock = require('../config/db').isMock();
    if (isMock) {
      const data = require('../config/db').getLocalDb();
      if (data.users.length === 0) {
        role = 'admin'; // Make first user admin automatically
      }
    } else {
      const userCount = await User.MongoModel.countDocuments({});
      if (userCount === 0) {
        role = 'admin';
      }
    }

    const newUser = await User.create({ name, email, password, role });
    const token = generateToken(newUser._id);

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        wishlist: newUser.wishlist || []
      }
    });
  } catch (error) {
    console.error('Signup error:', error.message);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user and get token
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await User.comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        wishlist: user.wishlist || []
      }
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      wishlist: user.wishlist || []
    });
  } catch (error) {
    console.error('Profile fetch error:', error.message);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
});

// @route   POST /api/auth/wishlist
// @desc    Toggle item in user wishlist
router.post('/wishlist', auth, async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let wishlist = user.wishlist || [];
    const index = wishlist.indexOf(productId);

    if (index === -1) {
      wishlist.push(productId);
    } else {
      wishlist.splice(index, 1);
    }

    const updatedUser = await User.updateWishlist(user._id, wishlist);

    res.json({
      wishlist: updatedUser.wishlist || []
    });
  } catch (error) {
    console.error('Wishlist error:', error.message);
    res.status(500).json({ message: 'Server error updating wishlist' });
  }
});

module.exports = router;
