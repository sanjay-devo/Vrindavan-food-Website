import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { MenuItem, Category } from '../types';
import { useCart } from '../context/CartContext';
import { Search, ShoppingCart, Plus, Minus, ArrowLeft, Star } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Menu = () => {
  const [searchParams] = useSearchParams();
  const tableNumber = searchParams.get('table');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  
  const { addItem, items: cartItems, updateQuantity, totalPrice, totalItems } = useCart();

  useEffect(() => {
    const q = query(collection(db, 'menu'), where('available', '==', true));
    const unsubscribeMenu = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem));
      setMenuItems(items);
      setLoading(false);
    });

    const unsubscribeCats = onSnapshot(collection(db, 'categories'), (snapshot) => {
      const cats = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
      setCategories(cats);
    });

    return () => {
      unsubscribeMenu();
      unsubscribeCats();
    };
  }, []);

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getItemQuantity = (id: string) => {
    return cartItems.find(i => i.id === id)?.quantity || 0;
  };

  return (
    <div className="min-h-screen bg-[#f8f7f5] pb-32">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-black/5 px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Link to="/home" className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Our Menu</h1>
              {tableNumber && (
                <span className="text-[10px] font-bold text-[#f48c25] uppercase tracking-widest bg-[#f48c25]/10 px-2 py-0.5 rounded-full">
                  Table #{tableNumber}
                </span>
              )}
            </div>
          </div>
          <div className="w-10 h-10 bg-[#f48c25]/10 rounded-xl flex items-center justify-center text-[#f48c25]">
            <Search className="w-5 h-5" />
          </div>
        </div>

        {/* Search Input */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search for dishes..." 
            className="w-full h-12 pl-11 pr-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#f48c25]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          <button 
            onClick={() => setSelectedCategory('All')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
              selectedCategory === 'All' ? 'bg-[#f48c25] text-white shadow-lg shadow-[#f48c25]/20' : 'bg-white text-slate-500 border border-black/5'
            }`}
          >
            All
          </button>
          {categories.map(cat => (
            <button 
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat.name ? 'bg-[#f48c25] text-white shadow-lg shadow-[#f48c25]/20' : 'bg-white text-slate-500 border border-black/5'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-md mx-auto p-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 border-4 border-[#f48c25] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium">Loading menu...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-500">No items found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredItems.map(item => (
              <div key={item.id} className="bg-white rounded-3xl p-4 shadow-sm border border-black/5 flex gap-4 group">
                <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-slate-900 leading-tight">{item.name}</h3>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-[#f48c25]">
                        <Star className="w-3 h-3 fill-[#f48c25]" /> 4.9
                      </div>
                    </div>
                    <p className="text-slate-500 text-[10px] line-clamp-2 mt-1">{item.description}</p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold text-[#f48c25]">${item.price.toFixed(2)}</span>
                    
                    {getItemQuantity(item.id) > 0 ? (
                      <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-1 px-2 border border-black/5">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-7 h-7 bg-white rounded-lg flex items-center justify-center text-slate-600 shadow-sm"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-bold w-4 text-center">{getItemQuantity(item.id)}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-7 h-7 bg-[#f48c25] rounded-lg flex items-center justify-center text-white shadow-sm"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => addItem(item)}
                        className="w-10 h-10 bg-[#f48c25] text-white rounded-xl flex items-center justify-center shadow-md shadow-[#f48c25]/20 active:scale-90 transition-all"
                      >
                        <Plus className="w-6 h-6" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Floating Cart Button */}
      {totalItems > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-40">
          <Link 
            to="/checkout" 
            className="w-full h-16 bg-[#f48c25] text-white rounded-2xl shadow-2xl shadow-[#f48c25]/40 flex items-center justify-between px-6 active:scale-[0.98] transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="bg-white/20 px-3 py-1 rounded-lg font-bold text-sm">{totalItems}</div>
              <span className="font-bold tracking-wide">View Cart</span>
            </div>
            <span className="text-lg font-extrabold">${totalPrice.toFixed(2)}</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Menu;
