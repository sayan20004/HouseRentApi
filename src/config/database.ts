import mongoose from 'mongoose';
import { config } from './env';

/**
 * Connect to MongoDB database
 */
export const connectDatabase = async (): Promise<void> => {
    try {
        const conn = await mongoose.connect(config.mongodbUri);

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

        // Handle connection events
        mongoose.connection.on('error', (error) => {
            console.error('❌ MongoDB connection error:', error);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️  MongoDB disconnected');
        });

    } catch (error) {
        console.error('❌ Error connecting to MongoDB:', error);
        process.exit(1);
    }
};

/**
 * Disconnect from MongoDB database
 */
export const disconnectDatabase = async (): Promise<void> => {
    try {
        await mongoose.connection.close();
        console.log('✅ MongoDB connection closed');
    } catch (error) {
        console.error('❌ Error disconnecting from MongoDB:', error);
        process.exit(1);
    }
};
