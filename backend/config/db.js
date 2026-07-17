const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error('MONGO_URI is not defined in the environment. Check your .env file.');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log(`MongoDB connected: ${mongoose.connection.host}`);
  } catch (err) {
    console.error(`MongoDB connection failed: ${err.message}`);
     console.error('Full error for diagnosis:', err)
    process.exit(1);
  }
}

module.exports = connectDB;
