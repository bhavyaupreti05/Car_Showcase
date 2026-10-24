import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export let isConnectedToDB = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('⚠️ No MONGODB_URI provided in .env');
    console.log('ℹ️ Running with in-memory car catalogue (16 sample cars loaded).');
    return null;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    isConnectedToDB = true;
    return conn;
  } catch (error) {
    console.warn(`⚠️ Could not connect to MongoDB (${error.message}).`);
    console.log('ℹ️ Operating in fallback in-memory mode with 16 sample cars loaded.');
    isConnectedToDB = false;
    return null;
  }
};
