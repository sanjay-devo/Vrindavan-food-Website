import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { testConnection } from './services/orderService';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Checkout from './pages/Checkout';
import OrderTracking from './pages/OrderTracking';
import AdminDashboard from './pages/admin/AdminDashboard';
import DeliveryDashboard from './pages/delivery/DeliveryDashboard';

const ProtectedRoute: React.FC<{ children: React.ReactNode; roles?: string[] }> = ({ children, roles }) => {
  const { user, profile, loading } = useAuth();

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (roles && profile && !roles.includes(profile.role)) return <Navigate to="/home" />;

  return <>{children}</>;
};

const RoleRedirect = () => {
  const { profile, loading, user } = useAuth();
  if (loading) return null;
  
  if (user && profile) {
    if (profile.role === 'admin') return <Navigate to="/admin" />;
    if (profile.role === 'delivery') return <Navigate to="/delivery-dashboard" />;
  }
  
  return <Navigate to="/home" />;
};

function App() {
  useEffect(() => {
    testConnection();
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Toaster position="top-center" />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/" element={<RoleRedirect />} />
            
            {/* Public/Consumer Routes */}
            <Route path="/home" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            
            {/* Protected Consumer Routes */}
            <Route path="/checkout" element={<ProtectedRoute roles={['consumer']}><Checkout /></ProtectedRoute>} />
            <Route path="/order-tracking/:orderId" element={<ProtectedRoute roles={['consumer']}><OrderTracking /></ProtectedRoute>} />
            
            {/* Admin Routes */}
            <Route path="/admin/*" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
            
            {/* Delivery Routes */}
            <Route path="/delivery-dashboard" element={<ProtectedRoute roles={['delivery']}><DeliveryDashboard /></ProtectedRoute>} />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/home" />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
