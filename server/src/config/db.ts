import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = `${process.env.MONGODB_URI}/${process.env.DB_NAME}`;

    if (!process.env.MONGODB_URI || !process.env.DB_NAME) {
      throw new Error("Missing MongoDB connection environment variables.");
    }

    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to database", error);
    process.exit(1);
  }
};

export default connectDB;
