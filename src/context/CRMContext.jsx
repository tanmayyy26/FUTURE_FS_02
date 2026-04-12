import React, { createContext, useContext, useState, useEffect } from 'react';

const CRMContext = createContext();
const API_URL = 'http://localhost:5000/api';

export const useCRM = () => useContext(CRMContext);

export const CRMProvider = ({ children }) => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [admin, setAdmin] = useState(() => {
        // Load admin from localStorage on init
        const stored = localStorage.getItem('admin');
        return stored ? JSON.parse(stored) : null;
    });
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return !!localStorage.getItem('authToken');
    });

    // Fetch leads from backend
    useEffect(() => {
        if (isAuthenticated) {
            fetchLeads();
        }
    }, [isAuthenticated]);

    // Login function to update auth state
    const login = (token, adminData) => {
        localStorage.setItem('authToken', token);
        localStorage.setItem('admin', JSON.stringify(adminData));
        setAdmin(adminData);
        setIsAuthenticated(true);
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('admin');
        setAdmin(null);
        setIsAuthenticated(false);
        setLeads([]);
    };

    // Login function to update auth state
    const login = (token, adminData) => {
        localStorage.setItem('authToken', token);
        localStorage.setItem('admin', JSON.stringify(adminData));
        setAdmin(adminData);
        setIsAuthenticated(true);
    };

    const fetchLeads = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/leads`);
            if (!response.ok) throw new Error('Failed to fetch leads');
            const data = await response.json();
            setLeads(data);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching leads:', err);
        } finally {
            setLoading(false);
        }
    };

    // Helper function to get auth headers
    const getAuthHeaders = () => {
        const token = localStorage.getItem('authToken');
        return {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        };
    };

    const addLead = async (lead) => {
        try {
            console.log('Adding lead:', lead);
            const response = await fetch(`${API_URL}/leads`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(lead)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to add lead');
            }
            
            const newLead = await response.json();
            console.log('Lead added successfully:', newLead);
            
            setLeads([newLead, ...leads]);
            setError(null);
            
            // Show success message
            alert('Lead added successfully!');
            
            return newLead;
        } catch (err) {
            const errorMsg = err.message || 'Failed to add lead';
            setError(errorMsg);
            console.error('Error adding lead:', err);
            alert('Error: ' + errorMsg);
        }
    };

    const updateStatus = async (id, newStatus) => {
        try {
            const response = await fetch(`${API_URL}/leads/${id}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify({ status: newStatus })
            });
            if (!response.ok) throw new Error('Failed to update lead');
            const updatedLead = await response.json();
            setLeads(leads.map(l => l._id === id ? updatedLead : l));
        } catch (err) {
            setError(err.message);
            console.error('Error updating lead:', err);
        }
    };

    const deleteLead = async (id) => {
        try {
            const response = await fetch(`${API_URL}/leads/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            if (!response.ok) throw new Error('Failed to delete lead');
            setLeads(leads.filter(l => l._id !== id));
        } catch (err) {
            setError(err.message);
            console.error('Error deleting lead:', err);
        }
    };

    const addFollowUp = async (leadId, note, date) => {
        try {
            const response = await fetch(`${API_URL}/leads/${leadId}/follow-ups`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ note, date })
            });
            if (!response.ok) throw new Error('Failed to add follow-up');
            const followUp = await response.json();
            
            // Update the lead in state
            setLeads(leads.map(l => {
                if (l._id === leadId) {
                    return { ...l, followUps: [...(l.followUps || []), followUp] };
                }
                return l;
            }));
            return followUp;
        } catch (err) {
            setError(err.message);
            console.error('Error adding follow-up:', err);
        }
    };

    const deleteFollowUp = async (leadId, followUpId) => {
        try {
            const response = await fetch(`${API_URL}/leads/${leadId}/follow-ups/${followUpId}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            if (!response.ok) throw new Error('Failed to delete follow-up');
            
            // Update the lead in state
            setLeads(leads.map(l => {
                if (l._id === leadId) {
                    return { ...l, followUps: (l.followUps || []).filter(f => f._id !== followUpId) };
                }
                return l;
            }));
        } catch (err) {
            setError(err.message);
            console.error('Error deleting follow-up:', err);
        }
    };

    const activeLeadsCount = leads.filter(l => l.status === 'New' || l.status === 'Contacted').length;
    const matchRate = leads.length ? Math.round((leads.filter(l => l.status === 'Won').length / leads.length) * 100) : 0;

    return (
        <CRMContext.Provider value={{ 
            leads, 
            addLead, 
            updateStatus, 
            deleteLead,
            addFollowUp,
            deleteFollowUp,
            logout,
            login,
            admin,
            isAuthenticated,
            stats: { total: leads.length, active: activeLeadsCount, conversion: matchRate },
            loading,
            error
        }}>
            {children}
        </CRMContext.Provider>
    );
};
