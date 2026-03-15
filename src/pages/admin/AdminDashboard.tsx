import React from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Menu as MenuIcon, 
  Users, 
  Truck, 
  Table as TableIcon, 
  BarChart3, 
  Settings, 
  LogOut,
  Plus,
  Search,
  Bell
} from 'lucide-react';
import { auth } from '../../firebase';

// Admin Sub-pages (to be created)
import AdminOverview from './AdminOverview';
import AdminOrders from './AdminOrders';
import AdminMenu from './AdminMenu';
import AdminUsers from './AdminUsers';
import AdminTables from './AdminTables';

const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.signOut();
    navigate('/login');
  };

  const navItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
    { path: '/admin/menu', icon: MenuIcon, label: 'Menu' },
    { path: '/admin/users', icon: Users, label: 'Users' },
    { path: '/admin/tables', icon: TableIcon, label: 'Tables' },
    { path: '/admin/reports', icon: BarChart3, label: 'Reports' },
  ];

  return (
    <div className="flex h-screen bg-[#f8f7f5] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-black/5 flex flex-col">
        <div className="p-8 flex items-center gap-3">
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Vrindavan</h1>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${
                  isActive 
                    ? 'bg-[#f48c25] text-white shadow-lg shadow-[#f48c25]/20' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-black/5">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-black/5 px-8 flex items-center justify-between">
          <div className="relative w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search anything..." 
              className="w-full h-12 pl-12 pr-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#f48c25] transition-all"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-500 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-10 w-px bg-black/5 mx-2"></div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900">Admin Panel</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Super Admin</p>
              </div>
              <div className="w-10 h-10 bg-[#f48c25]/10 rounded-xl flex items-center justify-center text-[#f48c25]">
                <Settings className="w-6 h-6" />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <Routes>
            <Route path="/" element={<AdminOverview />} />
            <Route path="/orders" element={<AdminOrders />} />
            <Route path="/menu" element={<AdminMenu />} />
            <Route path="/users" element={<AdminUsers />} />
            <Route path="/tables" element={<AdminTables />} />
            <Route path="*" element={<AdminOverview />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
