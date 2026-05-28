const mongoose = require('mongoose');
const db = require('../config/db');

const CouponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
  discountValue: { type: Number, required: true },
  minOrderAmount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const MongoCoupon = mongoose.models.Coupon || mongoose.model('Coupon', CouponSchema);

const Coupon = {
  schema: CouponSchema,
  MongoModel: MongoCoupon,

  async find() {
    if (db.isMock()) {
      const data = db.getLocalDb();
      return [...data.coupons];
    } else {
      return await MongoCoupon.find({});
    }
  },

  async findOne({ code }) {
    if (db.isMock()) {
      const data = db.getLocalDb();
      const coupon = data.coupons.find(c => c.code.toUpperCase() === code.toUpperCase());
      return coupon ? { ...coupon } : null;
    } else {
      return await MongoCoupon.findOne({ code: code.toUpperCase() });
    }
  },

  async create(couponData) {
    const finalData = {
      ...couponData,
      code: couponData.code.toUpperCase(),
      isActive: couponData.isActive !== undefined ? couponData.isActive : true,
      createdAt: new Date()
    };

    if (db.isMock()) {
      const data = db.getLocalDb();
      // Check unique code
      const exists = data.coupons.some(c => c.code === finalData.code);
      if (exists) {
        throw new Error('Coupon code already exists');
      }
      const newId = 'cpn_' + Math.random().toString(36).substr(2, 9);
      const newCoupon = { _id: newId, ...finalData };
      data.coupons.push(newCoupon);
      db.saveLocalDb(data);
      return newCoupon;
    } else {
      const coupon = new MongoCoupon(finalData);
      return await coupon.save();
    }
  },

  async findByIdAndDelete(id) {
    if (db.isMock()) {
      const data = db.getLocalDb();
      const idx = data.coupons.findIndex(c => c._id === id);
      if (idx !== -1) {
        const deleted = data.coupons[idx];
        data.coupons.splice(idx, 1);
        db.saveLocalDb(data);
        return deleted;
      }
      return null;
    } else {
      return await MongoCoupon.findByIdAndDelete(id);
    }
  }
};

module.exports = Coupon;
