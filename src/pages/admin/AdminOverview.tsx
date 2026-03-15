import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase';
import { Order, MenuItem, UserProfile } from '../../types';
import { TrendingUp, ShoppingBag, Users, DollarSign, Clock, ArrowRight } from 'lucide-react';

const AdminOverview = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    activeMenu: 0
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  useEffect(() => {
    const unsubscribeOrders = onSnapshot(collection(db, 'orders'), (snapshot) => {
      const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
      const revenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
      setStats(prev => ({ ...prev, totalOrders: orders.length, totalRevenue: revenue }));
      
      // Sort and limit for recent orders
      const sorted = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);
      setRecentOrders(sorted);
    });

    const unsubscribeUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      setStats(prev => ({ ...prev, totalUsers: snapshot.size }));
    });

    const unsubscribeMenu = onSnapshot(collection(db, 'menu'), (snapshot) => {
      setStats(prev => ({ ...prev, activeMenu: snapshot.size }));
    });

    return () => {
      unsubscribeOrders();
      unsubscribeUsers();
      unsubscribeMenu();
    };
  }, []);

  const cards = [
    { label: 'Total Revenue', value: `$${stats.totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'bg-green-500', trend: '+12.5%' },
    { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'bg-blue-500', trend: '+5.2%' },
    { label: 'Total Customers', value: stats.totalUsers, icon: Users, color: 'bg-purple-500', trend: '+2.4%' },
    { label: 'Menu Items', value: stats.activeMenu, icon: TrendingUp, color: 'bg-[#f48c25]', trend: 'Active' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div key={card.label} className="bg-white p-6 rounded-3xl shadow-sm border border-black/5 group hover:border-[#f48c25]/30 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 ${card.color}/10 rounded-2xl flex items-center justify-center`}>
                <card.icon className={`w-6 h-6 text-${card.color.split('-')[1]}-500`} />
              </div>
              <span className="text-[10px] font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full">{card.trend}</span>
            </div>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">{card.label}</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{card.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-black/5 overflow-hidden">
          <div className="p-6 border-b border-black/5 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900">Recent Orders</h3>
            <button className="text-[#f48c25] text-sm font-bold flex items-center gap-1 hover:underline">
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order ID</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Customer</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-[#f48c25]">#{order.id.slice(-6).toUpperCase()}</td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-900">{order.customerName}</p>
                      <p className="text-[10px] text-slate-400">{order.orderType}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-600' : 'bg-[#f48c25]/10 text-[#f48c25]'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-900">${order.totalPrice.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Stats / Info */}
        <div className="bg-white rounded-3xl shadow-sm border border-black/5 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6">System Status</h3>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center text-green-500">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Server Online</p>
                <p className="text-xs text-slate-500">All systems operational</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Payment Gateway</p>
                <p className="text-xs text-slate-500">Razorpay connected</p>
              </div>
            </div>
            <div className="pt-6 border-t border-black/5">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Popular Categories</p>
              <div className="space-y-3">
                {['Main Course', 'Appetizers', 'Desserts'].map((cat) => (
                  <div key={cat} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">{cat}</span>
                    <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#f48c25]" style={{ width: `${Math.random() * 100}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
