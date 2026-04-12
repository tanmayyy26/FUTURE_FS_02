import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, PlusCircle, Settings, LogOut } from 'lucide-react';
import { useCRM } from '../context/CRMContext';

const Sidebar = () => {
    const navigate = useNavigate();
    const { logout, admin } = useCRM();

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: Users, label: 'Leads', path: '/leads' },
    ];

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            logout();
            navigate('/login');
        }
    };

    return (
        <aside className="sidebar">
            <div style={{ padding: '1.5rem 0', marginBottom: '2rem' }}>
                <h2 style={{ color: 'var(--accent-primary)', fontSize: '1.5rem', fontWeight: 'bold' }}>
                    Nexus CRM
                </h2>
            </div>

            <nav>
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div style={{ marginTop: 'auto', borderTop: 'var(--glass-border)', paddingTop: '1rem' }}>
                {admin && (
                    <div style={{ marginBottom: '1rem', padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0 0 0.25rem' }}>Admin</p>
                        <p style={{ margin: 0, color: 'var(--text-primary)', fontWeight: 500, fontSize: '0.9rem' }}>{admin.email}</p>
                    </div>
                )}
                <NavLink
                    to="/settings"
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                    <Settings size={20} />
                    <span>Settings</span>
                </NavLink>
                <button 
                    className="nav-item" 
                    style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: 'rgb(239, 68, 68)' }}
                    onClick={handleLogout}
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

const Layout = ({ onOpenAddLead }) => {
    return (
        <div className="layout">
            <Sidebar />
            <main className="main-content">
                <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="search-bar" style={{ position: 'relative', width: '300px' }}>
                        {/* Search placeholder */}
                    </div>
                    <button className="btn btn-primary" onClick={onOpenAddLead}>
                        <PlusCircle size={18} />
                        Add Lead
                    </button>
                </header>
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
