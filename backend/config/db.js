const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

let isMockMode = false;
const localDbPath = path.join(__dirname, '../data/localDb.json');

// Ensure data folder exists
const dataDir = path.dirname(localDbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Ensure localDb.json exists with correct shape
const defaultDbStructure = {
  users: [],
  products: [],
  orders: [],
  blogs: [],
  coupons: []
};

if (!fs.existsSync(localDbPath)) {
  fs.writeFileSync(localDbPath, JSON.stringify(defaultDbStructure, null, 2), 'utf-8');
}

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.log('⚠️  No MONGODB_URI found in environment variables. Starting in LOCAL JSON DATABASE mode.');
    isMockMode = true;
    return;
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log('✅ Connected to MongoDB Database successfully.');
    isMockMode = false;
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    console.log('⚠️  Falling back to LOCAL JSON DATABASE mode.');
    isMockMode = true;
  }
};

const getLocalDb = () => {
  try {
    const data = fs.readFileSync(localDbPath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading localDb file, returning default structure', err);
    return defaultDbStructure;
  }
};

const saveLocalDb = (data) => {
  try {
    fs.writeFileSync(localDbPath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing to localDb file', err);
    return false;
  }
};

module.exports = {
  connectDB,
  isMock() { return isMockMode; },
  setMockMode(val) { isMockMode = val; },
  getLocalDb,
  saveLocalDb
};
