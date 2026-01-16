import * as mongoose from 'mongoose';
import config from '../config';

export async function connectToMongoDB() {
  try {
    await mongoose.connect(config.databaseURL, {
      connectTimeoutMS: 300000,
      family: 4,
      minPoolSize: 250,
      maxPoolSize: 500,
      socketTimeoutMS: 0,
      serverSelectionTimeoutMS: 30000,
      heartbeatFrequencyMS: 3000,
    });
  } catch (err) {
    console.log('Mongo Connection', JSON.stringify(err));
  }
}

export async function disconnectFromMongoDB() {
  await mongoose.disconnect();
}
mongoose.connection?.once('open', async () => {
  try {
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection not established');
    }
    const pingResult = await db.admin().command({ ping: 1 });
    console.log('Ping successful:', pingResult);
  } catch (error) {
    console.error('Ping failed:', error);
  }
});

mongoose.connection?.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection?.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection?.on('disconnected', () => {
  console.log('Mongoose disconnected from MongoDB');
});

process.on('SIGINT', async () => {
  await mongoose.connection?.close();
  console.log('Mongoose connection closed due to application termination');
  process.exit(0);
});
