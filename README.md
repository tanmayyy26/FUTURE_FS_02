# 🚀 Nexus CRM - Mini Lead Management System

A modern, full-stack Customer Relationship Management (CRM) application for managing leads, tracking interactions, and monitoring sales pipeline. Built with React, Node.js, Express, and MongoDB.

## ✨ Features

### 🔐 **Security & Authentication**
- **Admin Login System** - Secure JWT-based authentication
- **Protected Routes** - Only authenticated users can access dashboard
- **Password Management** - Secure password change functionality
- **Token-based Access** - 24-hour JWT tokens for API security
- **Admin-only Operations** - Lead creation/modification requires authentication

### 👥 **Lead Management**
- **Create Leads** - Add new leads with name, email, source, and notes
- **View All Leads** - Display leads in table format with search & filter
- **Update Status** - Change lead status (New, Contacted, Won, Lost)
- **Delete Leads** - Remove leads from the system
- **Lead Details** - View complete lead information in modal

### 📝 **Follow-ups & Notes**
- **Add Follow-ups** - Track follow-up interactions with dates
- **Follow-up History** - View all follow-ups for each lead
- **Quick Notes** - Add custom notes to follow-ups
- **Delete Follow-ups** - Remove outdated follow-up records

### 📊 **Dashboard Analytics**
- **Total Leads** - Count of all leads in system
- **Active Pipeline** - Leads in New or Contacted status
- **Conversion Rate** - Percentage of Won leads
- **Recent Leads** - Display recent lead activity

### ⚙️ **Admin Settings**
- **Profile Management** - View admin email and name
- **Password Change** - Update admin password securely
- **Session Management** - Logout and clear authentication

## 🛠️ Tech Stack

### **Frontend**
- React 19.2.0 with Vite 7.3.1
- React Router 7.13.0 for navigation
- Lucide React icons
- CSS-in-JS with glass-morphism design

### **Backend**
- Express.js 4.18.0
- Node.js with file watching
- CORS enabled for cross-origin requests
- JWT (jsonwebtoken 9.0.0) for authentication
- bcryptjs 2.4.0 for password hashing

### **Database**
- MongoDB Atlas (Cloud)
- MongoDB driver 5.0.0
- In-memory fallback for local development

## 📋 Prerequisites

- Node.js v16 or higher
- npm or yarn
- MongoDB Atlas account (or local MongoDB)
- Git

## 🚀 Quick Start

### **1. Clone Repository**
```bash
git clone https://github.com/tanmayyy26/FUTURE_FS_02.git
cd FUTURE_FS_02
```

### **2. Install Dependencies**

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd backend
npm install
cd ..
```

### **3. Environment Setup**

Create `.env` file in backend folder:
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://crm_admin:MySecurePass321@cluster0.bbqxqma.mongodb.net/crm_db?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_change_in_production
```

### **4. Start Development Servers**

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### **5. Access Application**
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## 🔑 Default Login Credentials

| Field | Value |
|-------|-------|
| **Email** | admin@crm.com |
| **Password** | AdminSecure@2024 |

## 📁 Project Structure

```
FUTURE_FS_02/
├── src/
│   ├── pages/
│   │   ├── Dashboard.jsx      # Dashboard with stats
│   │   ├── Leads.jsx          # Leads table view
│   │   ├── Login.jsx          # Login page
│   │   └── Settings.jsx       # Admin settings
│   ├── components/
│   │   ├── Layout.jsx         # Main layout with sidebar
│   │   ├── AddLeadModal.jsx   # Add lead form
│   │   ├── LeadDetailModal.jsx # Lead details view
│   │   └── FollowUpsPanel.jsx # Follow-ups management
│   ├── context/
│   │   └── CRMContext.jsx     # Global state management
│   ├── App.jsx                # Main app routes
│   └── main.jsx               # Entry point
├── backend/
│   ├── server.js              # Express server & routes
│   ├── db.js                  # MongoDB operations
│   ├── auth.js                # Authentication logic
│   └── package.json
├── package.json
└── README.md
```

## 🔌 API Endpoints

### **Authentication**
- `POST /api/auth/login` - Admin login
- `POST /api/auth/register` - Create admin account
- `GET /api/auth/verify` - Verify JWT token
- `POST /api/auth/change-password` - Change admin password

### **Leads** (All require JWT token)
- `GET /api/leads` - Get all leads
- `GET /api/leads/:id` - Get single lead
- `POST /api/leads` - Create new lead
- `PUT /api/leads/:id` - Update lead
- `DELETE /api/leads/:id` - Delete lead

### **Follow-ups** (All require JWT token)
- `GET /api/leads/:id/follow-ups` - Get follow-ups
- `POST /api/leads/:id/follow-ups` - Add follow-up
- `DELETE /api/leads/:id/follow-ups/:followUpId` - Delete follow-up

### **Utilities**
- `GET /api/stats` - Get dashboard statistics
- `GET /api/health` - Health check

## 🔒 Security Features

✅ **Password Security**
- Bcryptjs hashing (salt rounds: 10)
- Secure password validation
- Password change functionality

✅ **Authentication**
- JWT tokens with 24-hour expiry
- Token verification middleware
- Authorization on protected routes

✅ **Database**
- MongoDB URI in environment variables
- No credentials in version control
- .gitignore properly configured

✅ **API Security**
- CORS enabled
- Protected endpoints require JWT
- Input validation on all routes

## 📝 Usage Guide

### **Login**
1. Open http://localhost:5173
2. Enter credentials (see Default Login Credentials)
3. Click "Login"

### **Add Lead**
1. Click "Add Lead" button in header
2. Fill in lead details (name, email, source)
3. Click "Save Lead"
4. Lead appears in Leads table

### **Manage Leads**
1. Go to "Leads" page
2. View, search, or filter leads
3. Click on any lead to view details
4. Update status or add follow-ups
5. Delete lead using delete button

### **Change Password**
1. Click "Settings" in sidebar
2. Enter current and new password
3. Click "Update Password"
4. Success message confirms change

### **Logout**
1. Click "Logout" button in sidebar
2. Confirm logout
3. Redirect to login page

## 🐛 Troubleshooting

### **MongoDB Connection Issues**
- Verify MongoDB URI in `.env`
- Check IP whitelist in MongoDB Atlas
- Ensure network connectivity

### **Login Failed**
- Confirm credentials are correct
- Check backend is running on port 5000
- Verify JWT_SECRET matches backend

### **Port Already in Use**
```bash
# Kill node processes
taskkill /F /IM node.exe  # Windows
# or
killall node              # Mac/Linux
```

### **Module Not Found**
```bash
# Reinstall dependencies
npm install
cd backend && npm install
```

## 🚢 Deployment

### **GitHub**
Code is hosted on: https://github.com/tanmayyy26/FUTURE_FS_02

### **Live Deployment**
Ready for deployment to:
- Vercel (Frontend)
- Heroku (Backend)
- MongoDB Atlas (Database)

## 📚 Additional Notes

- The application uses in-memory storage as fallback if MongoDB is unavailable
- All passwords are hashed and never stored in plain text
- JWT tokens are stored in localStorage (frontend only)
- The `.env` file should never be committed to version control

## 🤝 Contributing

Pull requests are welcome! Please ensure all tests pass and code follows project conventions.

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Created by: [Your Name]  
GitHub: https://github.com/tanmayyy26

---

**Last Updated:** April 12, 2026  
**Version:** 1.0.0
