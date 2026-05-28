const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// @route   GET /api/products
// @desc    Get all products (supports query parameters category, search)
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    const products = await Product.find({ category, search });
    res.json(products);
  } catch (error) {
    console.error('Fetch products error:', error.message);
    res.status(500).json({ message: 'Server error fetching products' });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product details
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Fetch single product error:', error.message);
    res.status(500).json({ message: 'Server error fetching product' });
  }
});

// @route   POST /api/products
// @desc    Create a product (Admin only)
router.post('/', auth, admin, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      compareAtPrice,
      category,
      image,
      images,
      stock,
      benefits,
      ingredients,
      nutritionFacts,
      tags
    } = req.body;

    if (!name || !description || !price || !category || !image) {
      return res.status(400).json({ message: 'Please enter all mandatory fields (name, description, price, category, image)' });
    }

    const newProduct = await Product.create({
      name,
      description,
      price: Number(price),
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
      category,
      image,
      images: images || [image],
      stock: stock ? Number(stock) : 100,
      benefits: benefits || [],
      ingredients: ingredients || [],
      nutritionFacts: nutritionFacts || {
        calories: "140 kcal",
        protein: "3.5g",
        carbs: "22g",
        fat: "2.5g",
        fiber: "3g"
      },
      tags: tags || []
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Create product error:', error.message);
    res.status(500).json({ message: 'Server error creating product' });
  }
});

// @route   PUT /api/products/:id
// @desc    Update a product (Admin only)
router.put('/:id', auth, admin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body);
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(updatedProduct);
  } catch (error) {
    console.error('Update product error:', error.message);
    res.status(500).json({ message: 'Server error updating product' });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product (Admin only)
router.delete('/:id', auth, admin, async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product successfully deleted', id: req.params.id });
  } catch (error) {
    console.error('Delete product error:', error.message);
    res.status(500).json({ message: 'Server error deleting product' });
  }
});

module.exports = router;
