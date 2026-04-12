import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_change_in_production';

// In-memory admin storage (in production, use database)
let admins = [];
let adminsInitialized = false;

// Initialize default admin
async function initializeAdmins() {
  if (adminsInitialized) return;
  
  const hashedPassword = await bcryptjs.hash('admin123', 10);
  admins = [
    {
      id: 1,
      email: 'admin@crm.com',
      password: hashedPassword,
      name: 'Admin User'
    }
  ];
  adminsInitialized = true;
}

let nextAdminId = 2;

// Generate JWT token
export function generateToken(admin) {
  return jwt.sign(
    { id: admin.id, email: admin.email, name: admin.name },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}

// Verify JWT token
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Register new admin
export async function registerAdmin(email, password, name) {
  await initializeAdmins();
  
  const existingAdmin = admins.find(a => a.email === email);
  if (existingAdmin) {
    throw new Error('Admin with this email already exists');
  }

  const hashedPassword = await bcryptjs.hash(password, 10);
  const newAdmin = {
    id: nextAdminId++,
    email,
    password: hashedPassword,
    name: name || 'Admin'
  };

  admins.push(newAdmin);
  return { id: newAdmin.id, email: newAdmin.email, name: newAdmin.name };
}

// Login admin
export async function loginAdmin(email, password) {
  await initializeAdmins();
  
  const admin = admins.find(a => a.email === email);
  if (!admin) {
    throw new Error('Invalid email or password');
  }

  const isPasswordValid = await bcryptjs.compare(password, admin.password);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  return { id: admin.id, email: admin.email, name: admin.name };
}

// Middleware to check authentication
export function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  req.admin = decoded;
  next();
}
