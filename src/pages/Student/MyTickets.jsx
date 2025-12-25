import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { db } from '../../config/firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';
import { Clock, CheckCircle, AlertTriangle } from 'lucide-react';

const MyTickets = () => {
    const [tickets, setTickets] = useState([]);
    const { currentUser } = useAuth();

    useEffect(() => {
        if (!currentUser) return;

        const q = query(
            collection(db, 'tickets'),
            where('userId', '==', currentUser.uid),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setTickets(docs);
        });

        return unsubscribe;
    }, [currentUser]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'resolved': return '#10b981'; // green
            case 'in_progress': return '#f59e0b'; // amber
            default: return '#ef4444'; // red (open)
        }
    };

    return (
        <div>
            <Navbar />
            <div className="container">
                <h2 style={{ marginBottom: '2rem' }}>My Support Tickets</h2>

                <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                    {tickets.map(ticket => (
                        <div key={ticket.id} className="glass-card" style={{ padding: '1.5rem', borderLeft: `4px solid ${getStatusColor(ticket.status)}` }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                <h3 style={{ margin: 0, fontSize: '1.1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '70%' }} title={ticket.summary}>{ticket.summary || ticket.category}</h3>
                                <span style={{
                                    background: getStatusColor(ticket.status),
                                    color: 'white',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '999px',
                                    fontSize: '0.75rem',
                                    textTransform: 'uppercase',
                                    fontWeight: 'bold'
                                }}>
                                    {ticket.status.replace('_', ' ')}
                                </span>
                            </div>

                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                                {ticket.description.length > 100 ? ticket.description.substring(0, 100) + '...' : ticket.description}
                            </p>

                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'grid', gap: '0.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Clock size={16} />
                                    {ticket.createdAt?.seconds ? format(new Date(ticket.createdAt.seconds * 1000), 'MMM d, yyyy') : 'Just now'}
                                </div>
                                <div>
                                    <span style={{ fontWeight: '600' }}>Location:</span> {ticket.building}, {ticket.floor} Floor
                                </div>
                            </div>
                        </div>
                    ))}

                    {tickets.length === 0 && (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                            No tickets found. Create one to get started!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyTickets;
