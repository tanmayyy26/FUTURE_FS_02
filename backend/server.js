import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { generateToken, verifyToken, registerAdmin, loginAdmin, authMiddleware, changePassword } from './auth.js';
import { connectDB, getAllLeads, getLeadById, createLead, updateLead, deleteLead, isUsingInMemory } from './db.js';
import { ObjectId } from 'mongodb';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ==================== Auth Routes ====================

// POST - Admin Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    
    const admin = await loginAdmin(email, password);
    const token = generateToken(admin);
    res.json({ token, admin });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// POST - Admin Register (optional, for demo)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    
    const admin = await registerAdmin(email, password, name);
    const token = generateToken(admin);
    res.status(201).json({ token, admin });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET - Verify Token
app.get('/api/auth/verify', authMiddleware, (req, res) => {
  res.json({ admin: req.admin });
});

// POST - Change Password
app.post('/api/auth/change-password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password required' });
    }
    
    const admin = await changePassword(req.admin.id, currentPassword, newPassword);
    res.json({ message: 'Password changed successfully', admin });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ==================== Leads API Routes ====================
app.get('/api/leads', async (req, res) => {
  try {
    const leads = await getAllLeads();
    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single lead by ID
app.get('/api/leads/:id', async (req, res) => {
  try {
    const lead = await getLeadById(req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    res.json(lead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Create new lead (Admin only)
app.post('/api/leads', authMiddleware, async (req, res) => {
  try {
    const { name, email, source, status = 'New', notes = '' } = req.body;
    if (!name || !email) return res.status(400).json({ error: 'Name and email required' });
    
    const newLead = await createLead({ name, email, status, source: source || 'Website', notes });
    res.status(201).json(newLead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT - Update lead (Admin only)
app.put('/api/leads/:id', authMiddleware, async (req, res) => {
  try {
    const { status, name, email, source, notes } = req.body;
    const updateData = {};
    if (status) updateData.status = status;
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (source) updateData.source = source;
    if (notes !== undefined) updateData.notes = notes;
    
    const updatedLead = await updateLead(req.params.id, updateData);
    if (!updatedLead) return res.status(404).json({ error: 'Lead not found' });
    res.json(updatedLead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE - Delete lead (Admin only)
app.delete('/api/leads/:id', authMiddleware, async (req, res) => {
  try {
    const lead = await getLeadById(req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    
    await deleteLead(req.params.id);
    res.json(lead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== Follow-ups API Routes ====================

// GET - Get all follow-ups for a lead
app.get('/api/leads/:id/follow-ups', async (req, res) => {
  try {
    const lead = await getLeadById(req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    
    res.json(lead.followUps || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Add follow-up note to lead (Admin only)
app.post('/api/leads/:id/follow-ups', authMiddleware, async (req, res) => {
  try {
    const { note, date } = req.body;
    if (!note) return res.status(400).json({ error: 'Note required' });
    
    const lead = await getLeadById(req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    
    if (!lead.followUps) lead.followUps = [];
    
    const followUp = {
      _id: new ObjectId().toString(),
      note,
      date: date || new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    
    lead.followUps.push(followUp);
    await updateLead(req.params.id, { followUps: lead.followUps });
    
    res.status(201).json(followUp);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE - Delete follow-up from lead (Admin only)
app.delete('/api/leads/:id/follow-ups/:followUpId', authMiddleware, async (req, res) => {
  try {
    const lead = await getLeadById(req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    
    if (!lead.followUps) lead.followUps = [];
    
    const followUpIndex = lead.followUps.findIndex(f => f._id === req.params.followUpId);
    if (followUpIndex === -1) return res.status(404).json({ error: 'Follow-up not found' });
    
    const deletedFollowUp = lead.followUps.splice(followUpIndex, 1)[0];
    await updateLead(req.params.id, { followUps: lead.followUps });
    
    res.json(deletedFollowUp);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Contact form
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email) return res.status(400).json({ error: 'Name and email required' });
    
    const newLead = await createLead({ name, email, status: 'New', source: 'Contact Form', notes: message || '' });
    res.status(201).json(newLead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Stats
app.get('/api/stats', async (req, res) => {
  try {
    const leads = await getAllLeads();
    const total = leads.length;
    const active = leads.filter(l => l.status === 'New' || l.status === 'Contacted').length;
    const conversion = total ? Math.round((leads.filter(l => l.status === 'Won').length / total) * 100) : 0;
    res.json({ total, active, conversion });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  const dbStatus = isUsingInMemory() ? 'In-Memory (Fallback)' : 'MongoDB';
  res.json({ status: 'ok', message: 'CRM Backend running', database: dbStatus });
});

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 CRM Backend running on http://localhost:${PORT}`);
    console.log(`📝 POST  http://localhost:${PORT}/api/contact`);
    console.log(`📋 GET  http://localhost:${PORT}/api/leads`);
  });
}).catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
