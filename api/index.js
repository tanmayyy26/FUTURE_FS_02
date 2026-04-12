import { connectDB } from '../backend/db.js';
import app from '../backend/server.js';

let dbConnected = false;

// Initialize database on first call
async function initDB() {
  if (!dbConnected) {
    try {
      await connectDB();
      dbConnected = true;
    } catch (error) {
      console.error('DB connection failed:', error);
    }
  }
}

// Vercel serverless handler - this is the entry point
export default async function handler(req, res) {
  // Initialize database
  await initDB();
  
  // Call Express app
  return app(req, res);
}
