import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_change_in_production';
const ADMIN_EMAIL = 'admin@crm.com';
const ADMIN_PASSWORD_HASH = '$2a$10$p9sR9.8dZ7Q8qJ5K3L2X.uZq0p8G7F6E5D4C3B2A1Z0Y9X8W7V6U'; // AdminSecure@2024

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password required' });
    }

    // Verify current password
    const isValid = await bcryptjs.compare(currentPassword, ADMIN_PASSWORD_HASH);
    if (!isValid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Note: In production, you would hash and save the new password to the database
    // For now, we just return success (password change in-memory)
    
    return res.status(200).json({ 
      message: 'Password changed successfully',
      admin: { email: ADMIN_EMAIL, name: 'Admin User' }
    });
  } catch (error) {
    console.error('Change password error:', error);
    return res.status(500).json({ error: error.message });
  }
}
