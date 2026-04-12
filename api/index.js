import app from '../backend/server.js';

// Vercel serverless handler
export default function handler(req, res) {
  return app(req, res);
}
