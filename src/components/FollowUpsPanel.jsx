import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { Plus, Trash2, Calendar } from 'lucide-react';

const FollowUpsPanel = ({ leadId, followUps = [] }) => {
    const { addFollowUp, deleteFollowUp } = useCRM();
    const [isAdding, setIsAdding] = useState(false);
    const [newNote, setNewNote] = useState('');
    const [followUpDate, setFollowUpDate] = useState(new Date().toISOString().split('T')[0]);

    const handleAddFollowUp = async (e) => {
        e.preventDefault();
        if (!newNote.trim()) return;

        await addFollowUp(leadId, newNote, new Date(followUpDate).toISOString());
        setNewNote('');
        setFollowUpDate(new Date().toISOString().split('T')[0]);
        setIsAdding(false);
    };

    const handleDeleteFollowUp = (followUpId) => {
        if (window.confirm('Delete this follow-up?')) {
            deleteFollowUp(leadId, followUpId);
        }
    };

    return (
        <div style={{ marginTop: '2rem', borderTop: 'var(--glass-border)', paddingTop: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>Follow-ups & Notes</h3>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    style={{
                        background: 'var(--accent-primary)',
                        border: 'none',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        gap: '0.5rem',
                        alignItems: 'center',
                        fontSize: '0.9rem'
                    }}
                >
                    <Plus size={16} /> Add Note
                </button>
            </div>

            {isAdding && (
                <form onSubmit={handleAddFollowUp} style={{ marginBottom: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                            Date
                        </label>
                        <input
                            type="date"
                            value={followUpDate}
                            onChange={(e) => setFollowUpDate(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                background: 'rgba(255,255,255,0.1)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '6px',
                                color: 'var(--text-primary)',
                                fontFamily: 'inherit'
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                            Note
                        </label>
                        <textarea
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            placeholder="Add a follow-up note..."
                            style={{
                                width: '100%',
                                minHeight: '100px',
                                padding: '0.75rem',
                                background: 'rgba(255,255,255,0.1)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '6px',
                                color: 'var(--text-primary)',
                                fontFamily: 'inherit',
                                resize: 'vertical'
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            type="submit"
                            style={{
                                background: 'var(--accent-primary)',
                                border: 'none',
                                color: 'white',
                                padding: '0.75rem 1.5rem',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontWeight: 500
                            }}
                        >
                            Save Note
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsAdding(false)}
                            style={{
                                background: 'transparent',
                                border: '1px solid var(--text-secondary)',
                                color: 'var(--text-secondary)',
                                padding: '0.75rem 1.5rem',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontWeight: 500
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {followUps && followUps.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {[...followUps].reverse().map((followUp) => (
                        <div
                            key={followUp._id}
                            style={{
                                padding: '1rem',
                                background: 'rgba(255,255,255,0.05)',
                                borderLeft: '3px solid var(--accent-primary)',
                                borderRadius: '6px'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                    <Calendar size={16} />
                                    {new Date(followUp.date || followUp.createdAt).toLocaleDateString()}
                                </div>
                                <button
                                    onClick={() => handleDeleteFollowUp(followUp._id)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: 'var(--danger)',
                                        cursor: 'pointer',
                                        padding: 0
                                    }}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <p style={{ margin: 0, color: 'var(--text-primary)', lineHeight: 1.5 }}>
                                {followUp.note}
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
                    No notes yet. Add your first follow-up note.
                </p>
            )}
        </div>
    );
};

export default FollowUpsPanel;
