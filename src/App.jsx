import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CRMProvider, useCRM } from './context/CRMContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Login from './pages/Login';
import Settings from './pages/Settings';
import AddLeadModal from './components/AddLeadModal';
import { useState } from 'react';

// Protected Route Component
const ProtectedRoute = ({ children, isAuthenticated }) => {
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

// Wrapper to provide props to Layout for opening modal
const AppLayout = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const { addLead, admin } = useCRM();

  return (
    <>
      <Layout onOpenAddLead={() => setModalOpen(true)} />
      <AddLeadModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={addLead}
      />
    </>
  );
};

// Wrapper for Settings route to access context
const SettingsPageWrapper = () => {
  const { admin } = useCRM();
  return <Settings admin={admin} />;
};

function App() {
  const { isAuthenticated } = useCRM();

  return (
    <CRMProvider>
      <Router>
        <Routes>
          {/* Login Route */}
          <Route path="/login" element={
            <Login onLoginSuccess={() => {}} />
          } />

          {/* Protected Routes */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="leads" element={<Leads />} />
            <Route path="settings" element={<SettingsPageWrapper />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </CRMProvider>
  );
}

export default App;
