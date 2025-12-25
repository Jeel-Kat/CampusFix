import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import FullPageLoader from './components/FullPageLoader';
import Login from './pages/Login';
import NewTicket from './pages/Student/NewTicket';
import MyTickets from './pages/Student/MyTickets';
import AdminDashboard from './pages/Admin/Dashboard';
import AdminMap from './pages/Admin/Map';
import AdminAnalytics from './pages/Admin/Analytics';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser, userRole, loading } = useAuth();

  if (loading) return <FullPageLoader />;

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Redirect students trying to access admin pages to their home
    return userRole === 'admin' ? <Navigate to="/admin/dashboard" /> : <Navigate to="/student/new-ticket" />;
  }

  return children;
};

// Redirect root based on auth status and role
const RootRedirect = () => {
  const { currentUser, userRole, loading } = useAuth();
  if (loading) return <FullPageLoader />;
  if (!currentUser) return <Navigate to="/landing" />;
  if (userRole === 'admin') return <Navigate to="/admin/dashboard" />;
  return <Navigate to="/student/new-ticket" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/landing" element={<Landing />} />
          <Route path="/login" element={<Login />} />

          {/* Student Routes */}
          <Route
            path="/student/new-ticket"
            element={
              <ProtectedRoute allowedRoles={['student', 'admin']}>
                <NewTicket />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/my-tickets"
            element={
              <ProtectedRoute allowedRoles={['student', 'admin']}>
                <MyTickets />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/map"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminMap />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminAnalytics />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<RootRedirect />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
