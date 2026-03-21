import mongoose from 'mongoose';

const MAX_RETRIES = 5;
const INITIAL_DELAY_MS = 2000;

const connectDB = async (): Promise<void> => {
  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const conn = await mongoose.connect(mongoURI);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      console.error(`Error connecting to MongoDB (attempt ${attempt}/${MAX_RETRIES}):`, error);

      if (attempt === MAX_RETRIES) {
        console.error('All MongoDB connection attempts failed. Exiting.');
        process.exit(1);
      }

      const delay = INITIAL_DELAY_MS * Math.pow(2, attempt - 1);
      console.log(`Retrying in ${delay / 1000}s...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

export default connectDB;
