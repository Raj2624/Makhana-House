const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const db = require('../config/db');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  wishlist: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

const MongoUser = mongoose.models.User || mongoose.model('User', UserSchema);

const User = {
  // Schema for reference or direct use
  schema: UserSchema,
  MongoModel: MongoUser,

  async findOne({ email }) {
    if (db.isMock()) {
      const data = db.getLocalDb();
      const user = data.users.find(u => u.email === email);
      return user ? { ...user, comparePassword: async (pwd) => await bcrypt.compare(pwd, user.password) } : null;
    } else {
      const user = await MongoUser.findOne({ email });
      return user;
    }
  },

  async findById(id) {
    if (db.isMock()) {
      const data = db.getLocalDb();
      const user = data.users.find(u => u._id === id);
      return user ? { ...user } : null;
    } else {
      return await MongoUser.findById(id);
    }
  },

  async create(userData) {
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    const finalData = {
      ...userData,
      password: hashedPassword,
      wishlist: userData.wishlist || [],
      createdAt: new Date()
    };

    if (db.isMock()) {
      const data = db.getLocalDb();
      const newId = 'usr_' + Math.random().toString(36).substr(2, 9);
      const newUser = { _id: newId, ...finalData };
      data.users.push(newUser);
      db.saveLocalDb(data);
      return newUser;
    } else {
      const user = new MongoUser(finalData);
      return await user.save();
    }
  },

  async updateWishlist(userId, wishlist) {
    if (db.isMock()) {
      const data = db.getLocalDb();
      const userIndex = data.users.findIndex(u => u._id === userId);
      if (userIndex !== -1) {
        data.users[userIndex].wishlist = wishlist;
        db.saveLocalDb(data);
        return data.users[userIndex];
      }
      return null;
    } else {
      return await MongoUser.findByIdAndUpdate(userId, { wishlist }, { new: true });
    }
  },

  async comparePassword(candidatePassword, hashedPassword) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }
};

module.exports = User;
