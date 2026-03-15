import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Order, OrderStatus } from '../types';
import { ArrowLeft, Check, Clock, Truck, ShoppingBag, Utensils, MapPin, Phone } from 'lucide-react';

const OrderTracking = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!orderId) return;

    const unsubscribe = onSnapshot(doc(db, 'orders', orderId), (doc) => {
      if (doc.exists()) {
        setOrder({ id: doc.id, ...doc.data() } as Order);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [orderId]);

  const steps: { status: OrderStatus; label: string; icon: any }[] = [
    { status: 'received', label: 'Order Received', icon: ShoppingBag },
    { status: 'preparing', label: 'Preparing', icon: Utensils },
    { status: 'ready', label: 'Ready', icon: Check },
    { status: 'out-for-delivery', label: 'Out for Delivery', icon: Truck },
    { status: 'delivered', label: 'Delivered', icon: MapPin },
  ];

  const currentStepIndex = steps.findIndex(s => s.status === order?.status);

  if (loading) return <div className="h-screen flex items-center justify-center">Loading order...</div>;
  if (!order) return <div className="h-screen flex flex-col items-center justify-center p-4 text-center">
    <p className="text-slate-500 mb-4">Order not found</p>
    <Link to="/home" className="text-[#f48c25] font-bold">Back to Home</Link>
  </div>;

  return (
    <div className="min-h-screen bg-[#f8f7f5] pb-24">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-black/5 px-4 py-4 flex items-center gap-4">
        <button onClick={() => navigate('/home')} className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-slate-900">Track Order</h1>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-6">
        {/* Order ID & Status */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-black/5 text-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Order #{order.id.slice(-6).toUpperCase()}</p>
          <h2 className="text-2xl font-black text-[#f48c25] uppercase">{order.status.replace(/-/g, ' ')}</h2>
          <div className="mt-4 flex items-center justify-center gap-2 text-slate-500 text-sm">
            <Clock className="w-4 h-4" />
            <span>Estimated arrival in 25-30 mins</span>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-black/5">
          <div className="space-y-8 relative">
            <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-slate-100">
              <div 
                className="absolute top-0 left-0 w-full bg-[#f48c25] transition-all duration-1000" 
                style={{ height: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
              />
            </div>
            
            {steps.map((step, index) => {
              const isCompleted = index <= currentStepIndex;
              const isActive = index === currentStepIndex;
              
              return (
                <div key={step.status} className="flex items-center gap-6 relative z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${
                    isCompleted ? 'bg-[#f48c25] text-white shadow-lg shadow-[#f48c25]/20' : 'bg-white text-slate-300 border-2 border-slate-100'
                  }`}>
                    {isCompleted ? <Check className="w-4 h-4" /> : <step.icon className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className={`text-sm font-bold transition-colors ${isCompleted ? 'text-slate-900' : 'text-slate-300'}`}>
                      {step.label}
                    </p>
                    {isActive && <p className="text-[10px] text-[#f48c25] font-bold uppercase tracking-wider">Current Stage</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-black/5 space-y-4">
          <h3 className="font-bold text-slate-900">Order Details</h3>
          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="text-slate-500">{item.name} x{item.quantity}</span>
                <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="pt-3 border-t border-black/5 flex justify-between font-bold">
              <span>Total</span>
              <span className="text-[#f48c25]">${order.totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Delivery Info */}
        {order.orderType === 'delivery' && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-black/5 flex items-start gap-4">
            <div className="w-10 h-10 bg-[#f48c25]/10 rounded-full flex items-center justify-center shrink-0">
              <MapPin className="text-[#f48c25] w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Delivery Address</p>
              <p className="text-sm font-medium text-slate-700 mt-1">{order.address}</p>
            </div>
          </div>
        )}

        {/* Support CTA */}
        <div className="flex gap-3">
          <button className="flex-1 h-14 bg-white border border-black/5 rounded-2xl flex items-center justify-center gap-2 font-bold text-slate-700 shadow-sm active:scale-[0.98] transition-all">
            <Phone className="w-5 h-5 text-[#f48c25]" />
            Call Restaurant
          </button>
          <button className="flex-1 h-14 bg-[#f48c25] text-white rounded-2xl flex items-center justify-center gap-2 font-bold shadow-lg shadow-[#f48c25]/20 active:scale-[0.98] transition-all">
            Need Help?
          </button>
        </div>
      </main>
    </div>
  );
};

export default OrderTracking;
