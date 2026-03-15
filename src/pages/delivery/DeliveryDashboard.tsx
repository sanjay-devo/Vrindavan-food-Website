import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where, updateDoc, doc, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import { Order, OrderStatus } from '../../types';
import { Truck, MapPin, Phone, CheckCircle2, Navigation, LogOut, Package, Clock } from 'lucide-react';
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const DeliveryDashboard = () => {
  const { profile } = useAuth();
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [availableOrders, setAvailableOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!profile?.uid) return;

    // Active orders assigned to this partner
    const qActive = query(
      collection(db, 'orders'), 
      where('deliveryPartnerId', '==', profile.uid),
      where('status', 'in', ['preparing', 'ready', 'out-for-delivery'])
    );
    
    const unsubscribeActive = onSnapshot(qActive, (snapshot) => {
      setActiveOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)));
    });

    // Available orders ready for pickup
    const qAvailable = query(
      collection(db, 'orders'),
      where('orderType', '==', 'delivery'),
      where('status', '==', 'ready'),
      where('deliveryPartnerId', '==', null)
    );

    const unsubscribeAvailable = onSnapshot(qAvailable, (snapshot) => {
      setAvailableOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)));
      setLoading(false);
    });

    return () => {
      unsubscribeActive();
      unsubscribeAvailable();
    };
  }, [profile?.uid]);

  const handleAcceptOrder = async (orderId: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        deliveryPartnerId: profile?.uid,
        status: 'out-for-delivery'
      });
      toast.success('Order accepted! Head to restaurant.');
    } catch (error) {
      toast.error('Failed to accept order');
    }
  };

  const handleCompleteOrder = async (orderId: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: 'delivered'
      });
      toast.success('Order delivered! Good job.');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleLogout = () => {
    auth.signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#f8f7f5] pb-24">
      <header className="sticky top-0 z-50 bg-white border-b border-black/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#f48c25]/10 rounded-xl flex items-center justify-center text-[#f48c25]">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">Partner Dashboard</h1>
            <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Online & Active</p>
          </div>
        </div>
        <button onClick={handleLogout} className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500">
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-black/5">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Today's Earnings</p>
            <h3 className="text-2xl font-black text-[#f48c25]">$142.50</h3>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-black/5">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Deliveries</p>
            <h3 className="text-2xl font-black text-slate-900">12</h3>
          </div>
        </div>

        {/* Active Deliveries */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Navigation className="w-5 h-5 text-[#f48c25]" />
            Active Deliveries
          </h2>
          {activeOrders.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-dashed border-slate-200">
              <Package className="w-10 h-10 text-slate-200 mx-auto mb-3" />
              <p className="text-slate-400 text-sm font-medium">No active deliveries</p>
            </div>
          ) : (
            activeOrders.map(order => (
              <div key={order.id} className="bg-white rounded-3xl p-6 shadow-sm border border-[#f48c25]/20 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-bold text-[#f48c25] uppercase tracking-widest">Order #{order.id.slice(-6).toUpperCase()}</p>
                    <h3 className="text-lg font-bold text-slate-900 mt-1">{order.customerName}</h3>
                  </div>
                  <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    {order.status.replace(/-/g, ' ')}
                  </span>
                </div>
                
                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                    <p className="text-sm text-slate-600">{order.address}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-slate-400 mt-0.5" />
                    <p className="text-sm text-slate-600">{order.phone}</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button className="flex-1 h-12 bg-slate-100 rounded-2xl flex items-center justify-center gap-2 font-bold text-slate-600">
                    <Navigation className="w-4 h-4" />
                    Navigate
                  </button>
                  <button 
                    onClick={() => handleCompleteOrder(order.id)}
                    className="flex-1 h-12 bg-[#f48c25] text-white rounded-2xl flex items-center justify-center gap-2 font-bold shadow-lg shadow-[#f48c25]/20"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Delivered
                  </button>
                </div>
              </div>
            ))
          )}
        </section>

        {/* Available Orders */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#f48c25]" />
            Available Near You
          </h2>
          {availableOrders.length === 0 ? (
            <p className="text-center text-slate-400 text-sm py-4">Searching for new orders...</p>
          ) : (
            availableOrders.map(order => (
              <div key={order.id} className="bg-white rounded-3xl p-6 shadow-sm border border-black/5 flex justify-between items-center group hover:border-[#f48c25]/30 transition-all">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">New Request</p>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">$12.50 • 2.5 miles</h3>
                  <p className="text-xs text-slate-500 mt-1">Pickup: Vrindavan Central</p>
                </div>
                <button 
                  onClick={() => handleAcceptOrder(order.id)}
                  className="bg-[#f48c25] text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-[#f48c25]/20 active:scale-95 transition-all"
                >
                  Accept
                </button>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
};

export default DeliveryDashboard;
