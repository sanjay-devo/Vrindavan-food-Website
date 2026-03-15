import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { testConnection } from './services/orderService';
import { initializeDatabase } from './utils/dbInitialize';

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
  
  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#f8f7f5]">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#f48c25]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <div className="animate-spin">
              <svg className="w-8 h-8 text-[#f48c25]" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          </div>
          <p className="text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (user && profile) {
    if (profile.role === 'admin') return <Navigate to="/admin" />;
    if (profile.role === 'delivery') return <Navigate to="/delivery-dashboard" />;
  }
  
  return <Navigate to="/home" />;
};

function App() {
  useEffect(() => {
    testConnection();
    initializeDatabase(); // Initialize database structure on first load
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
