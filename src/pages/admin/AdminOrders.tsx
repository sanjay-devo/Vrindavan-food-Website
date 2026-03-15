import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, updateDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import { Order, OrderStatus } from '../../types';
import { Search, Filter, MoreVertical, CheckCircle2, Clock, Truck, ShoppingBag } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all');

  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
      setOrders(ordersData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error: any) {
      toast.error('Failed to update status');
    }
  };

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Order Management</h2>
          <p className="text-sm text-slate-500">Track and manage all incoming orders</p>
        </div>
        <div className="flex gap-2 bg-white p-1 rounded-2xl border border-black/5 shadow-sm">
          {['all', 'received', 'preparing', 'ready', 'out-for-delivery', 'delivered'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                filter === s ? 'bg-[#f48c25] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              {s.replace(/-/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-black/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-black/5">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order Details</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Items</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-10 text-center text-slate-400">Loading orders...</td></tr>
              ) : filteredOrders.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-10 text-center text-slate-400">No orders found</td></tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-900">#{order.id.slice(-6).toUpperCase()}</p>
                      <p className="text-xs text-slate-500">{order.customerName}</p>
                      <p className="text-[10px] text-slate-400">{new Date(order.createdAt).toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {order.orderType === 'delivery' ? <Truck className="w-4 h-4 text-blue-500" /> : 
                         order.orderType === 'pickup' ? <ShoppingBag className="w-4 h-4 text-purple-500" /> : 
                         <Clock className="w-4 h-4 text-green-500" />}
                        <span className="text-xs font-bold capitalize">{order.orderType}</span>
                      </div>
                      {order.tableNumber && <p className="text-[10px] text-slate-400">Table #{order.tableNumber}</p>}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs font-bold text-slate-700">{order.items.length} Items</p>
                      <p className="text-sm font-black text-[#f48c25]">${order.totalPrice.toFixed(2)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order.id, e.target.value as OrderStatus)}
                        className={`text-[10px] font-bold uppercase tracking-wider rounded-full px-3 py-1 border-none focus:ring-2 focus:ring-[#f48c25] cursor-pointer ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-600' : 'bg-[#f48c25]/10 text-[#f48c25]'
                        }`}
                      >
                        <option value="received">Received</option>
                        <option value="preparing">Preparing</option>
                        <option value="ready">Ready</option>
                        <option value="out-for-delivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
