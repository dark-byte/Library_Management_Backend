import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async (uri?: string) => {
  try {
    const dbUri = uri || process.env.MONGO_URI || 'mongodb://localhost:27017/library-management';
    await mongoose.connect(dbUri, {});
    console.log('MongoDB connected successfully.');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB disconnected successfully.');
  } catch (error) {
    console.error('Error while disconnecting MongoDB:', error);
  }
};

export { connectDB, disconnectDB };
