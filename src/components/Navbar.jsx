import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, PlusCircle, List, Map as MapIcon, BarChart3 } from 'lucide-react';

const Navbar = () => {
  const { userRole, logout, currentUser } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const linkStyle = (path) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    textDecoration: 'none',
    color: isActive(path) ? '#dc2626' : '#6b7280', // red active, gray inactive
    fontWeight: isActive(path) ? 600 : 500,
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    background: isActive(path) ? 'rgba(220, 38, 38, 0.1)' : 'transparent', // light red background for active
    transition: 'all 0.2s',
    fontSize: '0.95rem',
  });

  return (
    <nav
      style={{
        marginBottom: '2rem',
        background: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            textDecoration: 'none',
            color: '#dc2626', // red
          }}
        >
          CampusFix AI
        </Link>

        {/* Links */}
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
            flexWrap: 'wrap',
            marginTop: '0.5rem',
          }}
        >
          {userRole === 'student' && (
            <>
              <Link to="/student/new-ticket" style={linkStyle('/student/new-ticket')}>
                <PlusCircle size={18} /> New Ticket
              </Link>
              <Link to="/student/my-tickets" style={linkStyle('/student/my-tickets')}>
                <List size={18} /> My Tickets
              </Link>
            </>
          )}

          {userRole === 'admin' && (
            <>
              <Link to="/admin/dashboard" style={linkStyle('/admin/dashboard')}>
                <List size={18} /> Dashboard
              </Link>
              <Link to="/admin/map" style={linkStyle('/admin/map')}>
                <MapIcon size={18} /> Map & Heatmap
              </Link>
              <Link to="/admin/analytics" style={linkStyle('/admin/analytics')}>
                <BarChart3 size={18} /> Analytics
              </Link>
            </>
          )}

          {/* User Info & Logout */}
          <div
            style={{
              borderLeft: '1px solid #e5e7eb',
              paddingLeft: '1rem',
              marginLeft: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              {currentUser?.displayName || 'User'}
            </span>
            <button
              onClick={logout}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#6b7280',
                display: 'flex',
                alignItems: 'center',
                padding: '0.25rem',
                borderRadius: '0.375rem',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#dc2626')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#6b7280')}
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
