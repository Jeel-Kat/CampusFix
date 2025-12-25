import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { db } from '../../config/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { format } from 'date-fns';
import { Filter, X } from 'lucide-react';

const AdminDashboard = () => {
    const [tickets, setTickets] = useState([]);
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterCategory, setFilterCategory] = useState('all');
    const [filterUrgency, setFilterUrgency] = useState('all');
    const [editingAssignment, setEditingAssignment] = useState(null);
    const [assignedToInput, setAssignedToInput] = useState('');

    useEffect(() => {
        const q = query(collection(db, 'tickets'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setTickets(docs);
        });
        return unsubscribe;
    }, []);

    const handleStatusChange = async (ticketId, newStatus) => {
        try {
            const ticketRef = doc(db, 'tickets', ticketId);
            const updateData = {
                status: newStatus,
                updatedAt: serverTimestamp()
            };
            // If resolving, set resolvedAt
            if (newStatus === 'resolved') {
                updateData.resolvedAt = serverTimestamp();
            }
            await updateDoc(ticketRef, updateData);
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const handleAssignTicket = async (ticketId) => {
        if (!assignedToInput.trim()) return;
        try {
            const ticketRef = doc(db, 'tickets', ticketId);
            await updateDoc(ticketRef, {
                assignedTo: assignedToInput,
                updatedAt: serverTimestamp()
            });
            setEditingAssignment(null);
            setAssignedToInput('');
        } catch (error) {
            console.error("Error assigning ticket:", error);
        }
    };

    const getUniqueCategories = () => {
        const categories = new Set(tickets.map(t => t.category).filter(Boolean));
        return Array.from(categories).sort();
    };

    const filteredTickets = tickets.filter(t => {
        const statusMatch = filterStatus === 'all' || t.status === filterStatus;
        const categoryMatch = filterCategory === 'all' || t.category === filterCategory;
        let urgencyMatch = true;
        if (filterUrgency === 'high') {
            urgencyMatch = t.urgency >= 7;
        } else if (filterUrgency === 'medium') {
            urgencyMatch = t.urgency >= 4 && t.urgency < 7;
        } else if (filterUrgency === 'low') {
            urgencyMatch = t.urgency < 4;
        }
        return statusMatch && categoryMatch && urgencyMatch;
    });

    const clearFilters = () => {
        setFilterStatus('all');
        setFilterCategory('all');
        setFilterUrgency('all');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'resolved': return '#10b981';
            case 'in_progress': return '#f59e0b';
            default: return '#ef4444';
        }
    };

    const getUrgencyColor = (urgency) => {
        if (urgency >= 7) return '#ef4444';
        if (urgency >= 4) return '#f59e0b';
        return '#10b981';
    };

    return (
        <div>
            <Navbar />
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h2>Admin Dashboard</h2>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        Showing {filteredTickets.length} of {tickets.length} tickets
                    </div>
                </div>

                {/* Filters */}
                <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <Filter size={18} style={{ color: 'var(--primary)' }} />
                        <select
                            className="input-field"
                            value={filterStatus}
                            onChange={e => setFilterStatus(e.target.value)}
                            style={{ width: 'auto', minWidth: '150px' }}
                        >
                            <option value="all">All Status</option>
                            <option value="open">Open</option>
                            <option value="in_progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                        </select>

                        <select
                            className="input-field"
                            value={filterCategory}
                            onChange={e => setFilterCategory(e.target.value)}
                            style={{ width: 'auto', minWidth: '150px' }}
                        >
                            <option value="all">All Categories</option>
                            {getUniqueCategories().map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>

                        <select
                            className="input-field"
                            value={filterUrgency}
                            onChange={e => setFilterUrgency(e.target.value)}
                            style={{ width: 'auto', minWidth: '150px' }}
                        >
                            <option value="all">All Urgency</option>
                            <option value="high">High (7-10)</option>
                            <option value="medium">Medium (4-6)</option>
                            <option value="low">Low (1-3)</option>
                        </select>

                        {(filterStatus !== 'all' || filterCategory !== 'all' || filterUrgency !== 'all') && (
                            <button
                                className="btn btn-secondary"
                                onClick={clearFilters}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                            >
                                <X size={16} /> Clear Filters
                            </button>
                        )}
                    </div>
                </div>

                <div className="glass-card" style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #e2e8f0', background: '#f8fafc' }}>
                                <th style={{ padding: '1rem' }}>Date</th>
                                <th style={{ padding: '1rem' }}>Summary</th>
                                <th style={{ padding: '1rem' }}>Building</th>
                                <th style={{ padding: '1rem' }}>Category</th>
                                <th style={{ padding: '1rem' }}>Urgency</th>
                                <th style={{ padding: '1rem' }}>Status</th>
                                <th style={{ padding: '1rem' }}>Assigned To</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTickets.map(ticket => (
                                <tr key={ticket.id} style={{ borderBottom: '1px solid #f1f5f9', hover: { background: '#f9fafb' } }}>
                                    <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                                        {ticket.createdAt?.seconds ? format(new Date(ticket.createdAt.seconds * 1000), 'MMM d, HH:mm') : '-'}
                                    </td>
                                    <td style={{ padding: '1rem', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={ticket.description}>
                                        {ticket.summary || ticket.category}
                                    </td>
                                    <td style={{ padding: '1rem' }}>{ticket.building} ({ticket.floor})</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            background: 'rgba(79, 70, 229, 0.1)',
                                            color: 'var(--primary)',
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '4px',
                                            fontSize: '0.9rem'
                                        }}>
                                            {ticket.category}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', fontWeight: 'bold', color: getUrgencyColor(ticket.urgency) }}>
                                        {ticket.urgency}/10
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <select
                                            value={ticket.status}
                                            onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                                            style={{
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '4px',
                                                border: '1px solid #cbd5e1',
                                                background: ticket.status === 'open' ? '#fee2e2' : ticket.status === 'resolved' ? '#dcfce7' : '#fef3c7',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <option value="open">Open</option>
                                            <option value="in_progress">In Progress</option>
                                            <option value="resolved">Resolved</option>
                                        </select>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        {editingAssignment === ticket.id ? (
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <input
                                                    type="text"
                                                    className="input-field"
                                                    placeholder="Staff name"
                                                    value={assignedToInput}
                                                    onChange={(e) => setAssignedToInput(e.target.value)}
                                                    style={{ flex: 1, padding: '0.25rem 0.5rem' }}
                                                />
                                                <button
                                                    className="btn btn-primary"
                                                    onClick={() => handleAssignTicket(ticket.id)}
                                                    style={{ padding: '0.25rem 0.75rem', fontSize: '0.9rem' }}
                                                >
                                                    Save
                                                </button>
                                            </div>
                                        ) : (
                                            <div
                                                onClick={() => {
                                                    setEditingAssignment(ticket.id);
                                                    setAssignedToInput(ticket.assignedTo || '');
                                                }}
                                                style={{
                                                    cursor: 'pointer',
                                                    padding: '0.25rem 0.5rem',
                                                    borderRadius: '4px',
                                                    background: ticket.assignedTo ? 'rgba(34, 197, 94, 0.1)' : 'rgba(107, 114, 128, 0.1)',
                                                    color: ticket.assignedTo ? '#16a34a' : 'var(--text-muted)'
                                                }}
                                            >
                                                {ticket.assignedTo || 'Click to assign'}
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredTickets.length === 0 && (
                        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                            No tickets found matching filters.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
