import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const primaryUri = process.env.MONGODB_URI_PRIMARY as string;

const secondaryUri = process.env.MONGODB_URI_SECONDARY as string;

const db = async () => {
  try {
    // Connect to the primary database
    const primaryConnection = await mongoose.createConnection(primaryUri);

    // Connect to the secondary database
    const secondaryConnection = await mongoose.createConnection(secondaryUri);

    await Promise.all([
      new Promise<void>((resolve, reject) => {
        primaryConnection.once('connected', () => {
          console.log('Connected to Primary Database');
          resolve();
        });
        primaryConnection.on('error', reject);
      }),
      new Promise<void>((resolve, reject) => {
        secondaryConnection.once('connected', () => {
          console.log('Connected to Secondary Database');
          resolve();
        });
        secondaryConnection.on('error', reject);
      }),
    ]);

    return { primaryConnection, secondaryConnection };
  } catch (error) {
    console.error(' Error connecting to databases:', error);
    process.exit(1);
  }
};

export default db;
