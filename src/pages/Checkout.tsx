import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { OrderType, OrderStatus } from '../types';
import { ArrowLeft, MapPin, Phone, User, CreditCard, Truck, ShoppingBag, Utensils, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Checkout = () => {
  const [searchParams] = useSearchParams();
  const initialTable = searchParams.get('table') || '';
  
  const { profile } = useAuth();
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [orderType, setOrderType] = useState<OrderType>(initialTable ? 'dine-in' : 'delivery');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [name, setName] = useState(profile?.name || '');
  const [tableNumber, setTableNumber] = useState(initialTable);
  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    if (orderType === 'delivery' && !address) {
      toast.error('Please provide a delivery address');
      return;
    }

    if (orderType === 'dine-in' && !tableNumber) {
      toast.error('Please provide a table number');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        customerId: profile?.uid,
        customerName: name,
        phone: phone,
        items: items,
        totalPrice: totalPrice,
        orderType: orderType,
        tableNumber: orderType === 'dine-in' ? tableNumber : null,
        address: orderType === 'delivery' ? address : null,
        status: 'received' as OrderStatus,
        paymentStatus: 'pending',
        createdAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, 'orders'), orderData);
      
      // Razorpay Integration Placeholder
      // In a real app, you would call your backend to create a Razorpay order
      // and then open the Razorpay checkout modal.
      toast.success('Order placed successfully!');
      clearCart();
      navigate(`/order-tracking/${docRef.id}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7f5] pb-32">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-black/5 px-4 py-4 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-slate-900">Checkout</h1>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-6">
        {/* Order Type Selector */}
        <div className="bg-white rounded-3xl p-2 shadow-sm border border-black/5 flex gap-1">
          {[
            { id: 'delivery', label: 'Delivery', icon: Truck },
            { id: 'pickup', label: 'Pickup', icon: ShoppingBag },
            { id: 'dine-in', label: 'Dine-In', icon: Utensils }
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setOrderType(type.id as OrderType)}
              className={`flex-1 h-12 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold transition-all ${
                orderType === type.id ? 'bg-[#f48c25] text-white shadow-lg shadow-[#f48c25]/20' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <type.icon className="w-4 h-4" />
              {type.label}
            </button>
          ))}
        </div>

        {/* Form Sections */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-black/5 space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <User className="text-[#f48c25] w-5 h-5" />
              Contact Details
            </h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Full Name</label>
                <input 
                  type="text" 
                  className="w-full h-12 px-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#f48c25]"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Phone Number</label>
                <input 
                  type="tel" 
                  className="w-full h-12 px-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#f48c25]"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
          </div>

          {orderType === 'delivery' && (
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-black/5 space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <MapPin className="text-[#f48c25] w-5 h-5" />
                Delivery Address
              </h3>
              <textarea 
                className="w-full min-h-[100px] p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#f48c25] resize-none"
                placeholder="Enter your full address..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          )}

          {orderType === 'dine-in' && (
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-black/5 space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Utensils className="text-[#f48c25] w-5 h-5" />
                Table Information
              </h3>
              <input 
                type="text" 
                className="w-full h-12 px-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#f48c25]"
                placeholder="Enter table number"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-black/5 space-y-4">
          <h3 className="text-lg font-bold">Order Summary</h3>
          <div className="space-y-3">
            {items.map(item => (
              <div key={item.id} className="flex justify-between items-center text-sm">
                <span className="text-slate-600">{item.name} x{item.quantity}</span>
                <span className="font-bold text-slate-900">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="pt-4 border-t border-black/5 flex justify-between items-center">
              <span className="text-lg font-bold">Total Amount</span>
              <span className="text-2xl font-black text-[#f48c25]">${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </main>

      {/* Place Order Button */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-40">
        <button 
          onClick={handlePlaceOrder}
          disabled={loading || items.length === 0}
          className="w-full h-16 bg-[#f48c25] text-white rounded-2xl shadow-2xl shadow-[#f48c25]/40 flex items-center justify-center gap-2 font-bold text-lg active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Place Order'}
          {!loading && <ChevronRight className="w-6 h-6" />}
        </button>
      </div>
    </div>
  );
};

export default Checkout;
