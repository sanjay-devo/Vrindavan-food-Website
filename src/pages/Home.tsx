import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase';
import { LogOut, ShoppingCart, Menu as MenuIcon, User, Search, Rocket, Star, MapPin, Clock, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Home = () => {
  const { profile, user } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#f8f7f5] pb-24 md:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-black/5 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-[#f48c25] tracking-tighter uppercase">Vrindavan</h2>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/home" className="text-sm font-bold text-[#f48c25]">Home</Link>
            <Link to="/menu" className="text-sm font-medium text-slate-600 hover:text-[#f48c25] transition-colors">Menu</Link>
            <Link to="/orders" className="text-sm font-medium text-slate-600 hover:text-[#f48c25] transition-colors">Orders</Link>
            <Link to="/profile" className="text-sm font-medium text-slate-600 hover:text-[#f48c25] transition-colors">Profile</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/menu" className="relative w-10 h-10 bg-[#f48c25]/10 rounded-xl flex items-center justify-center text-[#f48c25]">
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                  {totalItems}
                </span>
              )}
            </Link>
            {user ? (
              <button onClick={handleLogout} className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
                <LogOut className="w-5 h-5" />
              </button>
            ) : (
              <Link to="/login" className="px-6 py-2.5 bg-[#f48c25] text-white text-sm font-bold rounded-xl shadow-lg shadow-[#f48c25]/20 hover:scale-105 transition-all">
                Login
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Hero Banner */}
        <section className="py-6">
          <div className="relative h-[300px] md:h-[450px] rounded-[2rem] overflow-hidden group">
            <img 
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80" 
              alt="Delicious Food" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-8 md:p-12">
              <span className="inline-block px-4 py-1.5 bg-[#f48c25] text-white text-[10px] md:text-xs font-bold uppercase tracking-widest rounded-full mb-4 w-fit">
                Chef's Special
              </span>
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight max-w-2xl">Experience the Art of Dining</h1>
              <p className="text-slate-300 text-sm md:text-lg mt-4 max-w-lg">Premium flavors delivered from our kitchen to your table. Fresh ingredients, expert chefs.</p>
              <div className="mt-8 flex gap-4">
                <Link to="/menu" className="px-8 py-4 bg-[#f48c25] text-white font-bold rounded-2xl shadow-xl shadow-[#f48c25]/30 hover:scale-105 transition-all">
                  Explore Menu
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Search & CTA - Desktop Grid */}
        <section className="py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6" />
            <input 
              type="text" 
              placeholder="Search for dishes or cravings..." 
              className="w-full h-16 pl-14 pr-6 bg-white border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-[#f48c25] transition-all text-lg"
            />
          </div>
          <Link 
            to="/menu" 
            className="h-16 bg-[#f48c25] text-white font-bold rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-[#f48c25]/20 hover:scale-[1.02] active:scale-[0.98] transition-all text-lg"
          >
            <Rocket className="w-6 h-6" />
            Order Now
          </Link>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 py-8">
          <div className="lg:col-span-2 space-y-12">
            {/* Categories Preview */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-slate-900">Categories</h3>
                <Link to="/menu" className="text-[#f48c25] text-sm font-bold hover:underline">View All</Link>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-6">
                {[
                  { name: 'Pizza', icon: '🍕' },
                  { name: 'Burger', icon: '🍔' },
                  { name: 'Sushi', icon: '🍣' },
                  { name: 'Drinks', icon: '🥤' },
                  { name: 'Dessert', icon: '🍰' }
                ].map((cat) => (
                  <div key={cat.name} className="flex flex-col items-center gap-3 group cursor-pointer">
                    <div className="w-full aspect-square bg-white rounded-3xl shadow-sm border border-black/5 flex items-center justify-center text-4xl group-hover:scale-110 group-hover:shadow-md transition-all">
                      {cat.icon}
                    </div>
                    <span className="text-sm font-bold text-slate-600 group-hover:text-[#f48c25] transition-colors">{cat.name}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Featured Items */}
            <section className="bg-[#f48c25]/5 -mx-4 md:mx-0 md:rounded-[2.5rem] p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-slate-900">Featured Dishes</h3>
                <div className="flex items-center gap-2 text-[#f48c25]">
                  <Star className="w-6 h-6 fill-[#f48c25]" />
                  <span className="font-bold">Top Rated</span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {[
                  { name: 'Spicy Pepperoni', price: 18.50, img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80', desc: 'Fresh dough, spicy pepperoni, and melted mozzarella.' },
                  { name: 'The King Burger', price: 15.90, img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80', desc: 'Double beef patty, cheddar, and our secret sauce.' }
                ].map((item) => (
                  <div key={item.name} className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-black/5 hover:shadow-xl transition-all group">
                    <div className="h-56 relative overflow-hidden">
                      <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm">
                        <Star className="w-4 h-4 text-[#f48c25] fill-[#f48c25]" /> 4.8
                      </div>
                    </div>
                    <div className="p-6">
                      <h4 className="text-xl font-bold text-slate-900">{item.name}</h4>
                      <p className="text-slate-500 text-sm mt-2 line-clamp-2">{item.desc}</p>
                      <div className="flex items-center justify-between mt-6">
                        <span className="text-2xl font-bold text-[#f48c25]">${item.price.toFixed(2)}</span>
                        <button className="w-12 h-12 bg-[#f48c25] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-[#f48c25]/20 hover:scale-110 active:scale-95 transition-all">
                          <Plus className="w-6 h-6" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar Info */}
          <aside className="space-y-8">
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-black/5 space-y-8 sticky top-28">
              <h3 className="text-xl font-bold text-slate-900">Visit Us</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#f48c25]/10 rounded-2xl flex items-center justify-center shrink-0">
                    <MapPin className="text-[#f48c25] w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Vrindavan Central</p>
                    <p className="text-sm text-slate-500 mt-1">452 Gourmet Ave, Manhattan, NY 10012</p>
                    <button className="text-[#f48c25] text-xs font-bold mt-2 hover:underline">Get Directions</button>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#f48c25]/10 rounded-2xl flex items-center justify-center shrink-0">
                    <Clock className="text-[#f48c25] w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Opening Hours</p>
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Mon - Fri</span>
                        <span className="font-bold text-slate-700">09:00 - 23:00</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Sat - Sun</span>
                        <span className="font-bold text-slate-700">10:00 - 00:00</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-black/5">
                <div className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Now Open</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">Closes in 4h</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Bottom Nav - Mobile Only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-black/5 px-6 py-4 flex justify-between items-center max-w-md mx-auto rounded-t-3xl shadow-2xl">
        <Link to="/home" className="flex flex-col items-center gap-1 text-[#f48c25]">
          <Rocket className="w-6 h-6" />
          <span className="text-[10px] font-bold">Home</span>
        </Link>
        <Link to="/menu" className="flex flex-col items-center gap-1 text-slate-400">
          <MenuIcon className="w-6 h-6" />
          <span className="text-[10px] font-medium">Menu</span>
        </Link>
        <Link to="/orders" className="flex flex-col items-center gap-1 text-slate-400">
          <Star className="w-6 h-6" />
          <span className="text-[10px] font-medium">Orders</span>
        </Link>
        <Link to="/profile" className="flex flex-col items-center gap-1 text-slate-400">
          <User className="w-6 h-6" />
          <span className="text-[10px] font-medium">Profile</span>
        </Link>
      </nav>
    </div>
  );
};

export default Home;
