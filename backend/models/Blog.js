const mongoose = require('mongoose');
const db = require('../config/db');

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String, required: true },
  author: { type: String, default: "Makhana House Nutritionist" },
  readTime: { type: String, default: "3 min read" },
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

const MongoBlog = mongoose.models.Blog || mongoose.model('Blog', BlogSchema);

const Blog = {
  schema: BlogSchema,
  MongoModel: MongoBlog,

  async find() {
    if (db.isMock()) {
      const data = db.getLocalDb();
      // Sort newest first
      return [...data.blogs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
      return await MongoBlog.find({}).sort({ createdAt: -1 });
    }
  },

  async findById(id) {
    if (db.isMock()) {
      const data = db.getLocalDb();
      const post = data.blogs.find(b => b._id === id);
      return post ? { ...post } : null;
    } else {
      return await MongoBlog.findById(id);
    }
  },

  async create(blogData) {
    const finalData = {
      ...blogData,
      author: blogData.author || "Makhana House Nutritionist",
      readTime: blogData.readTime || "3 min read",
      createdAt: new Date()
    };

    if (db.isMock()) {
      const data = db.getLocalDb();
      const newId = 'blog_' + Math.random().toString(36).substr(2, 9);
      const newPost = { _id: newId, ...finalData };
      data.blogs.push(newPost);
      db.saveLocalDb(data);
      return newPost;
    } else {
      const blog = new MongoBlog(finalData);
      return await blog.save();
    }
  },

  async findByIdAndUpdate(id, updateData) {
    if (db.isMock()) {
      const data = db.getLocalDb();
      const idx = data.blogs.findIndex(b => b._id === id);
      if (idx !== -1) {
        data.blogs[idx] = { ...data.blogs[idx], ...updateData };
        db.saveLocalDb(data);
        return data.blogs[idx];
      }
      return null;
    } else {
      return await MongoBlog.findByIdAndUpdate(id, updateData, { new: true });
    }
  },

  async findByIdAndDelete(id) {
    if (db.isMock()) {
      const data = db.getLocalDb();
      const idx = data.blogs.findIndex(b => b._id === id);
      if (idx !== -1) {
        const deleted = data.blogs[idx];
        data.blogs.splice(idx, 1);
        db.saveLocalDb(data);
        return deleted;
      }
      return null;
    } else {
      return await MongoBlog.findByIdAndDelete(id);
    }
  }
};

module.exports = Blog;
