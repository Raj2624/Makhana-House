const mongoose = require('mongoose');
const db = require('../config/db');

const OrderSchema = new mongoose.Schema({
  user: { type: String }, // User ID, or "guest"
  items: [{
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: { type: String }
  }],
  shippingAddress: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true }
  },
  paymentMethod: { type: String, enum: ['COD', 'Razorpay'], default: 'COD' },
  paymentStatus: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' },
  paymentId: { type: String },
  couponApplied: { type: String },
  discountAmount: { type: Number, default: 0 },
  shippingPrice: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  orderStatus: { type: String, enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'], default: 'Processing' },
  createdAt: { type: Date, default: Date.now }
});

const MongoOrder = mongoose.models.Order || mongoose.model('Order', OrderSchema);

const Order = {
  schema: OrderSchema,
  MongoModel: MongoOrder,

  async find(query = {}) {
    if (db.isMock()) {
      const data = db.getLocalDb();
      let list = [...data.orders];
      if (query.user) {
        list = list.filter(o => o.user === query.user);
      }
      // Sort newest first
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return list;
    } else {
      return await MongoOrder.find(query).sort({ createdAt: -1 });
    }
  },

  async findById(id) {
    if (db.isMock()) {
      const data = db.getLocalDb();
      const order = data.orders.find(o => o._id === id);
      return order ? { ...order } : null;
    } else {
      return await MongoOrder.findById(id);
    }
  },

  async create(orderData) {
    const finalData = {
      ...orderData,
      createdAt: new Date(),
      orderStatus: orderData.orderStatus || 'Processing',
      paymentStatus: orderData.paymentStatus || 'Pending'
    };

    if (db.isMock()) {
      const data = db.getLocalDb();
      const newId = 'ord_' + Math.random().toString(36).substr(2, 9);
      const newOrder = { _id: newId, ...finalData };
      data.orders.push(newOrder);
      db.saveLocalDb(data);
      return newOrder;
    } else {
      const order = new MongoOrder(finalData);
      return await order.save();
    }
  },

  async findByIdAndUpdate(id, updateData) {
    if (db.isMock()) {
      const data = db.getLocalDb();
      const idx = data.orders.findIndex(o => o._id === id);
      if (idx !== -1) {
        data.orders[idx] = { ...data.orders[idx], ...updateData };
        db.saveLocalDb(data);
        return data.orders[idx];
      }
      return null;
    } else {
      return await MongoOrder.findByIdAndUpdate(id, updateData, { new: true });
    }
  }
};

module.exports = Order;
