const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// @route   GET /api/blogs
// @desc    Get all blog posts
router.get('/', async (req, res) => {
  try {
    const posts = await Blog.find();
    res.json(posts);
  } catch (error) {
    console.error('Fetch blogs error:', error.message);
    res.status(500).json({ message: 'Server error fetching blog posts' });
  }
});

// @route   GET /api/blogs/:id
// @desc    Get a single blog post details
router.get('/:id', async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.json(post);
  } catch (error) {
    console.error('Fetch single blog error:', error.message);
    res.status(500).json({ message: 'Server error fetching blog post' });
  }
});

// @route   POST /api/blogs
// @desc    Create a blog post (Admin only)
router.post('/', auth, admin, async (req, res) => {
  try {
    const { title, content, image, tags, readTime, author } = req.body;

    if (!title || !content || !image) {
      return res.status(400).json({ message: 'Please enter title, content, and cover image' });
    }

    const newPost = await Blog.create({
      title,
      content,
      image,
      tags: tags || [],
      readTime: readTime || '3 min read',
      author: author || 'Makhana House Nutritionist'
    });

    res.status(201).json(newPost);
  } catch (error) {
    console.error('Create blog error:', error.message);
    res.status(500).json({ message: 'Server error creating blog post' });
  }
});

// @route   PUT /api/blogs/:id
// @desc    Update a blog post (Admin only)
router.put('/:id', auth, admin, async (req, res) => {
  try {
    const updatedPost = await Blog.findByIdAndUpdate(req.params.id, req.body);
    if (!updatedPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.json(updatedPost);
  } catch (error) {
    console.error('Update blog error:', error.message);
    res.status(500).json({ message: 'Server error updating blog post' });
  }
});

// @route   DELETE /api/blogs/:id
// @desc    Delete a blog post (Admin only)
router.delete('/:id', auth, admin, async (req, res) => {
  try {
    const deletedPost = await Blog.findByIdAndDelete(req.params.id);
    if (!deletedPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.json({ message: 'Blog post successfully deleted', id: req.params.id });
  } catch (error) {
    console.error('Delete blog error:', error.message);
    res.status(500).json({ message: 'Server error deleting blog post' });
  }
});

module.exports = router;
