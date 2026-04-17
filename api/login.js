import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_change_in_production';

// Initialize default admin
const ADMIN_EMAIL = 'admin@crm.com';
const ADMIN_PASSWORD_HASH = '$2a$10$p9sR9.8dZ7Q8qJ5K3L2X.uZq0p8G7F6E5D4C3B2A1Z0Y9X8W7V6U'; // AdminSecure@2024

async function verifyAdminPassword(email, password) {
  if (email !== ADMIN_EMAIL) {
    throw new Error('Invalid email or password');
  }
  const isValid = await bcryptjs.compare(password, ADMIN_PASSWORD_HASH);
  if (!isValid) {
    throw new Error('Invalid email or password');
  }
  return { id: 1, email, name: 'Admin User' };
}

function generateToken(admin) {
  return jwt.sign(
    { id: admin.id, email: admin.email, name: admin.name },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    
    const admin = await verifyAdminPassword(email, password);
    const token = generateToken(admin);
    
    return res.status(200).json({ token, admin });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(401).json({ error: error.message });
  }
}
