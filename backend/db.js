import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/crm_db';
let db = null;
let useInMemory = false;

// In-memory fallback storage
let inMemoryData = {
  leads: [
    { _id: new ObjectId(), name: 'kasthuri', email: 'kasthuri@gmail.com', status: 'New', source: 'Website', notes: '', followUps: [], date: new Date() },
    { _id: new ObjectId(), name: 'srivalli', email: 'srivalli@gmail.com', status: 'Contacted', source: 'LinkedIn', notes: '', followUps: [], date: new Date(Date.now() - 86400000) },
    { _id: new ObjectId(), name: 'vyshali', email: 'vyshali@gmail.com', status: 'Won', source: 'Referral', notes: '', followUps: [], date: new Date(Date.now() - 172800000) },
  ],
  admins: []
};

export async function connectDB() {
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db('crm_db');
    console.log('✅ Connected to MongoDB');
    
    // Initialize collections with indexes
    const leadsCollection = db.collection('leads');
    await leadsCollection.createIndex({ email: 1 }, { unique: false });
    
    return db;
  } catch (error) {
    console.warn('⚠️  MongoDB connection failed, using in-memory database:', error.message);
    console.log('💡 To use MongoDB, install MongoDB locally or set MONGODB_URI to MongoDB Atlas connection string');
    useInMemory = true;
    return null;
  }
}

export function getDB() {
  if (useInMemory) {
    return null; // Signal to use in-memory
  }
  if (!db) {
    throw new Error('Database not connected. Call connectDB() first.');
  }
  return db;
}

export function isUsingInMemory() {
  return useInMemory;
}

// Lead operations
export async function getAllLeads() {
  if (useInMemory) {
    return inMemoryData.leads;
  }
  const db = getDB();
  return await db.collection('leads').find({}).toArray();
}

export async function getLeadById(id) {
  if (useInMemory) {
    return inMemoryData.leads.find(l => l._id.toString() === id);
  }
  const db = getDB();
  return await db.collection('leads').findOne({ _id: new ObjectId(id) });
}

export async function createLead(leadData) {
  if (useInMemory) {
    const newLead = {
      _id: new ObjectId(),
      ...leadData,
      date: new Date(),
      status: leadData.status || 'New',
      notes: leadData.notes || '',
      followUps: leadData.followUps || []
    };
    inMemoryData.leads.push(newLead);
    return newLead;
  }
  const db = getDB();
  const result = await db.collection('leads').insertOne({
    ...leadData,
    date: new Date(),
    status: leadData.status || 'New',
    notes: leadData.notes || '',
    followUps: leadData.followUps || []
  });
  return { _id: result.insertedId, ...leadData, followUps: [] };
}

export async function updateLead(id, updateData) {
  if (useInMemory) {
    const index = inMemoryData.leads.findIndex(l => l._id.toString() === id);
    if (index === -1) return null;
    inMemoryData.leads[index] = { ...inMemoryData.leads[index], ...updateData };
    return inMemoryData.leads[index];
  }
  const db = getDB();
  const result = await db.collection('leads').findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: updateData },
    { returnDocument: 'after' }
  );
  return result.value;
}

export async function deleteLead(id) {
  if (useInMemory) {
    const index = inMemoryData.leads.findIndex(l => l._id.toString() === id);
    if (index !== -1) {
      inMemoryData.leads.splice(index, 1);
    }
    return;
  }
  const db = getDB();
  await db.collection('leads').deleteOne({ _id: new ObjectId(id) });
}

// Admin operations
export async function createAdmin(adminData) {
  if (useInMemory) {
    inMemoryData.admins.push(adminData);
    return { insertedId: adminData._id };
  }
  const db = getDB();
  const result = await db.collection('admins').insertOne(adminData);
  return result;
}

export async function getAdminByEmail(email) {
  if (useInMemory) {
    return inMemoryData.admins.find(a => a.email === email);
  }
  const db = getDB();
  return await db.collection('admins').findOne({ email });
}
