import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCRM } from '../context/CRMContext';
import { LogIn } from 'lucide-react';

const Login = ({ onLoginSuccess }) => {
    const navigate = useNavigate();
    const { login } = useCRM();
    const [formData, setFormData] = useState({
        email: 'admin@crm.com',
        password: 'AdminSecure@2024'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // For Vercel production: use relative path /api
            // For local dev: use http://localhost:5000/api
            const apiUrl = import.meta.env.VITE_API_URL || 
                          (window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : '/api');
            const response = await fetch(`${apiUrl}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Login failed');
            }

            const data = await response.json();
            console.log('Login successful:', data);

            // Update auth state in context
            login(data.token, data.admin);

            // Call parent callback
            onLoginSuccess(data.admin);

            // Redirect to dashboard
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Login failed. Please try again.');
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-primary)',
            padding: '1rem'
        }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ 
                        width: '60px', 
                        height: '60px', 
                        margin: '0 auto 1rem',
                        background: 'var(--accent-primary)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <LogIn size={32} color="white" />
                    </div>
                    <h1 style={{ margin: '0 0 0.5rem', fontSize: '1.5rem' }}>Nexus CRM</h1>
                    <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Admin Login</p>
                </div>

                {error && (
                    <div style={{
                        padding: '1rem',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgb(239, 68, 68)',
                        borderRadius: '8px',
                        color: 'rgb(239, 68, 68)',
                        marginBottom: '1.5rem',
                        fontSize: '0.875rem'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            className="form-input"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="admin@crm.com"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-input"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: '1.5rem' }}
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div style={{
                    marginTop: '1.5rem',
                    padding: '1rem',
                    background: 'var(--bg-secondary)',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)',
                    lineHeight: '1.6'
                }}>
                    <p style={{ margin: '0 0 0.5rem', fontWeight: 500 }}>Demo Credentials:</p>
                    <p style={{ margin: '0.25rem 0' }}>Email: <code style={{ background: 'var(--bg-primary)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>admin@crm.com</code></p>
                    <p style={{ margin: '0.25rem 0' }}>Password: <code style={{ background: 'var(--bg-primary)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>AdminSecure@2024</code></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
