import React from 'react';
import { X } from 'lucide-react';
import FollowUpsPanel from './FollowUpsPanel';

const LeadDetailModal = ({ lead, isOpen, onClose }) => {
    if (!isOpen || !lead) return null;

    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '600px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ margin: 0 }}>{lead.name}</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                        <X size={24} />
                    </button>
                </div>

                <div style={{ display: 'grid', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                            Email
                        </label>
                        <p style={{ margin: 0, color: 'var(--text-primary)' }}>{lead.email}</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                                Status
                            </label>
                            <p style={{ margin: 0, color: 'var(--text-primary)', fontWeight: 500 }}>{lead.status}</p>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                                Source
                            </label>
                            <p style={{ margin: 0, color: 'var(--text-primary)' }}>{lead.source}</p>
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                            Date Added
                        </label>
                        <p style={{ margin: 0, color: 'var(--text-primary)' }}>{new Date(lead.date).toLocaleDateString()}</p>
                    </div>

                    {lead.notes && (
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                                Notes
                            </label>
                            <p style={{ margin: 0, color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>{lead.notes}</p>
                        </div>
                    )}
                </div>

                <FollowUpsPanel leadId={lead._id} followUps={lead.followUps} />
            </div>
        </div>
    );
};

export default LeadDetailModal;
