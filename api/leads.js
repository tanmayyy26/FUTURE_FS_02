import { MongoClient, ObjectId } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/crm_db';

// In-memory fallback data
const DEFAULT_LEADS = [
  { _id: new ObjectId(), name: 'kasthuri', email: 'kasthuri@gmail.com', status: 'New', source: 'Website', notes: '', followUps: [], date: new Date() },
  { _id: new ObjectId(), name: 'srivalli', email: 'srivalli@gmail.com', status: 'Contacted', source: 'LinkedIn', notes: '', followUps: [], date: new Date(Date.now() - 86400000) },
  { _id: new ObjectId(), name: 'vyshali', email: 'vyshali@gmail.com', status: 'Won', source: 'Referral', notes: '', followUps: [], date: new Date(Date.now() - 172800000) },
];

let mongoClient = null;
let db = null;
let cachedLeads = [...DEFAULT_LEADS];

async function connectMongoDB() {
  try {
    if (!mongoClient) {
      mongoClient = new MongoClient(MONGODB_URI);
      await mongoClient.connect();
      db = mongoClient.db('crm_db');
    }
    return db;
  } catch (error) {
    console.warn('MongoDB connection failed, using in-memory data:', error.message);
    return null;
  }
}

async function getLeadsList() {
  try {
    const database = await connectMongoDB();
    if (database) {
      const leads = await database.collection('leads').find({}).toArray();
      cachedLeads = leads;
      return leads;
    }
  } catch (error) {
    console.error('Error fetching from MongoDB:', error);
  }
  return cachedLeads;
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      const leads = await getLeadsList();
      return res.status(200).json(leads);
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: error.message });
  }
}
}
