const mongoose = require('mongoose');
const db = require('../config/db');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  compareAtPrice: { type: Number },
  category: { type: String, required: true },
  image: { type: String, required: true },
  images: [{ type: String }],
  rating: { type: Number, default: 4.5 },
  reviewsCount: { type: Number, default: 15 },
  stock: { type: Number, default: 100 },
  benefits: [{ type: String }],
  ingredients: [{ type: String }],
  nutritionFacts: {
    calories: { type: String, default: "150 kcal" },
    protein: { type: String, default: "4g" },
    carbs: { type: String, default: "20g" },
    fat: { type: String, default: "3g" },
    fiber: { type: String, default: "3g" }
  },
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

const MongoProduct = mongoose.models.Product || mongoose.model('Product', ProductSchema);

const Product = {
  schema: ProductSchema,
  MongoModel: MongoProduct,

  async find(query = {}) {
    if (db.isMock()) {
      const data = db.getLocalDb();
      let list = [...data.products];

      // Simple category filter
      if (query.category) {
        list = list.filter(p => p.category.toLowerCase() === query.category.toLowerCase());
      }
      
      // Simple search query matching name or tags or description
      if (query.search) {
        const term = query.search.toLowerCase();
        list = list.filter(p => 
          p.name.toLowerCase().includes(term) || 
          p.description.toLowerCase().includes(term) ||
          (p.tags && p.tags.some(t => t.toLowerCase().includes(term)))
        );
      }

      return list;
    } else {
      const mongoQuery = {};
      if (query.category) {
        mongoQuery.category = { $regex: new RegExp('^' + query.category + '$', 'i') };
      }
      if (query.search) {
        mongoQuery.$or = [
          { name: { $regex: query.search, $options: 'i' } },
          { description: { $regex: query.search, $options: 'i' } },
          { tags: { $in: [new RegExp(query.search, 'i')] } }
        ];
      }
      return await MongoProduct.find(mongoQuery);
    }
  },

  async findById(id) {
    if (db.isMock()) {
      const data = db.getLocalDb();
      const product = data.products.find(p => p._id === id);
      return product ? { ...product } : null;
    } else {
      return await MongoProduct.findById(id);
    }
  },

  async create(productData) {
    const finalData = {
      ...productData,
      rating: productData.rating || 4.5,
      reviewsCount: productData.reviewsCount || 15,
      createdAt: new Date()
    };

    if (db.isMock()) {
      const data = db.getLocalDb();
      const newId = 'prod_' + Math.random().toString(36).substr(2, 9);
      const newProduct = { _id: newId, ...finalData };
      data.products.push(newProduct);
      db.saveLocalDb(data);
      return newProduct;
    } else {
      const product = new MongoProduct(finalData);
      return await product.save();
    }
  },

  async findByIdAndUpdate(id, updateData) {
    if (db.isMock()) {
      const data = db.getLocalDb();
      const idx = data.products.findIndex(p => p._id === id);
      if (idx !== -1) {
        data.products[idx] = { ...data.products[idx], ...updateData };
        db.saveLocalDb(data);
        return data.products[idx];
      }
      return null;
    } else {
      return await MongoProduct.findByIdAndUpdate(id, updateData, { new: true });
    }
  },

  async findByIdAndDelete(id) {
    if (db.isMock()) {
      const data = db.getLocalDb();
      const idx = data.products.findIndex(p => p._id === id);
      if (idx !== -1) {
        const deleted = data.products[idx];
        data.products.splice(idx, 1);
        db.saveLocalDb(data);
        return deleted;
      }
      return null;
    } else {
      return await MongoProduct.findByIdAndDelete(id);
    }
  }
};

module.exports = Product;
