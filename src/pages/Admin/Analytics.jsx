import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { db } from '../../config/firebase';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { BarChart, PieChart, TrendingUp } from 'lucide-react';
import { format, differenceInHours } from 'date-fns';

const AdminAnalytics = () => {
    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        const q = query(collection(db, 'tickets'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setTickets(docs);
        });
        return unsubscribe;
    }, []);

    // Calculate analytics
    const statusCounts = {
        open: tickets.filter(t => t.status === 'open').length,
        in_progress: tickets.filter(t => t.status === 'in_progress').length,
        resolved: tickets.filter(t => t.status === 'resolved').length
    };

    const categoryCounts = {};
    tickets.forEach(t => {
        categoryCounts[t.category] = (categoryCounts[t.category] || 0) + 1;
    });

    const avgResolutionTime = (() => {
        const resolved = tickets.filter(t => t.resolvedAt && t.createdAt);
        if (resolved.length === 0) return 0;
        const totalHours = resolved.reduce((sum, t) => {
            const created = new Date(t.createdAt.seconds * 1000);
            const resolved_time = new Date(t.resolvedAt.seconds * 1000);
            return sum + differenceInHours(resolved_time, created);
        }, 0);
        return (totalHours / resolved.length).toFixed(1);
    })();

    const avgUrgency = tickets.length > 0 
        ? (tickets.reduce((sum, t) => sum + (t.urgency || 0), 0) / tickets.length).toFixed(1)
        : 0;

    const StatCard = ({ title, value, icon: Icon, color }) => (
        <div className="glass-card" style={{ padding: '1.5rem', borderTop: `3px solid ${color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                    <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        {title}
                    </p>
                    <h3 style={{ margin: 0, fontSize: '2.2rem', fontWeight: 'bold', color }}>
                        {value}
                    </h3>
                </div>
                <Icon size={32} style={{ color, opacity: 0.6 }} />
            </div>
        </div>
    );

    return (
        <div>
            <Navbar />
            <div className="container">
                <h2 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <TrendingUp className="text-primary" /> Campus Analytics Dashboard
                </h2>

                {/* Key Metrics Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                    <StatCard title="Total Tickets" value={tickets.length} icon={BarChart} color="#4f46e5" />
                    <StatCard title="Open Issues" value={statusCounts.open} icon={BarChart} color="#ef4444" />
                    <StatCard title="In Progress" value={statusCounts.in_progress} icon={BarChart} color="#f59e0b" />
                    <StatCard title="Resolved" value={statusCounts.resolved} icon={BarChart} color="#10b981" />
                    <StatCard title="Avg Resolution (hrs)" value={avgResolutionTime} icon={TrendingUp} color="#8b5cf6" />
                    <StatCard title="Avg Urgency Score" value={avgUrgency} icon={TrendingUp} color="#f59e0b" />
                </div>

                {/* Charts Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
                    {/* Status Breakdown */}
                    <div className="glass-card" style={{ padding: '1.5rem' }}>
                        <h3 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Tickets by Status</h3>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {Object.entries(statusCounts).map(([status, count]) => {
                                const total = tickets.length;
                                const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : 0;
                                const colorMap = {
                                    open: '#ef4444',
                                    in_progress: '#f59e0b',
                                    resolved: '#10b981'
                                };
                                return (
                                    <div key={status}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                            <span style={{ textTransform: 'capitalize' }}>{status.replace('_', ' ')}</span>
                                            <span style={{ fontWeight: 'bold', color: colorMap[status] }}>
                                                {count} ({percentage}%)
                                            </span>
                                        </div>
                                        <div style={{
                                            height: '8px',
                                            background: '#f1f5f9',
                                            borderRadius: '999px',
                                            overflow: 'hidden'
                                        }}>
                                            <div style={{
                                                height: '100%',
                                                width: `${percentage}%`,
                                                background: colorMap[status],
                                                transition: 'width 0.3s'
                                            }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Category Breakdown */}
                    <div className="glass-card" style={{ padding: '1.5rem' }}>
                        <h3 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Tickets by Category</h3>
                        <div style={{ display: 'grid', gap: '0.75rem', fontSize: '0.95rem' }}>
                            {Object.entries(categoryCounts)
                                .sort((a, b) => b[1] - a[1])
                                .map(([category, count]) => (
                                    <div key={category} style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        padding: '0.75rem',
                                        background: 'rgba(79, 70, 229, 0.05)',
                                        borderRadius: 'var(--radius-lg)',
                                        borderLeft: '3px solid var(--primary)'
                                    }}>
                                        <span>{category}</span>
                                        <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{count}</span>
                                    </div>
                                ))}
                            {Object.keys(categoryCounts).length === 0 && (
                                <p style={{ color: 'var(--text-muted)', textAlign: 'center', margin: 0 }}>
                                    No tickets yet
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Urgency Distribution */}
                <div className="glass-card" style={{ padding: '1.5rem', marginTop: '1.5rem' }}>
                    <h3 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Urgency Distribution</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: '1rem' }}>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(urgency => {
                            const count = tickets.filter(t => t.urgency === urgency).length;
                            const maxCount = Math.max(...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(u => 
                                tickets.filter(t => t.urgency === u).length
                            )) || 1;
                            const heightPercent = (count / maxCount) * 100;
                            return (
                                <div key={urgency} style={{ textAlign: 'center' }}>
                                    <div style={{
                                        height: '100px',
                                        background: 'rgba(79, 70, 229, 0.1)',
                                        borderRadius: '4px',
                                        display: 'flex',
                                        alignItems: 'flex-end',
                                        justifyContent: 'center',
                                        padding: '0.5rem',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}>
                                        {count > 0 && (
                                            <div style={{
                                                width: '100%',
                                                height: `${heightPercent}%`,
                                                background: urgency > 7 ? '#ef4444' : urgency > 4 ? '#f59e0b' : '#10b981',
                                                borderRadius: '2px'
                                            }} />
                                        )}
                                    </div>
                                    <div style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
                                        <div style={{ fontWeight: 'bold' }}>{urgency}</div>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{count}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Summary Stats */}
                <div className="glass-card" style={{ padding: '1.5rem', marginTop: '1.5rem' }}>
                    <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Quick Summary</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                        <div>
                            <strong>Total Tickets:</strong> {tickets.length}
                        </div>
                        <div>
                            <strong>Resolution Rate:</strong> {tickets.length > 0 ? ((statusCounts.resolved / tickets.length) * 100).toFixed(1) : 0}%
                        </div>
                        <div>
                            <strong>Open Rate:</strong> {tickets.length > 0 ? ((statusCounts.open / tickets.length) * 100).toFixed(1) : 0}%
                        </div>
                        <div>
                            <strong>Average Time to Resolve:</strong> {avgResolutionTime} hours
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
