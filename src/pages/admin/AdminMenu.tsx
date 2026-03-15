import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { MenuItem, Category } from '../../types';
import { Plus, Search, Edit2, Trash2, Image as ImageIcon, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminMenu = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
    available: true
  });

  useEffect(() => {
    const unsubscribeMenu = onSnapshot(collection(db, 'menu'), (snapshot) => {
      setMenuItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem)));
      setLoading(false);
    });
    const unsubscribeCats = onSnapshot(collection(db, 'categories'), (snapshot) => {
      setCategories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category)));
    });
    return () => {
      unsubscribeMenu();
      unsubscribeCats();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await updateDoc(doc(db, 'menu', editingItem.id), formData);
        toast.success('Item updated');
      } else {
        await addDoc(collection(db, 'menu'), formData);
        toast.success('Item added');
      }
      setShowModal(false);
      setEditingItem(null);
      setFormData({ name: '', description: '', price: 0, category: '', image: formData.image, available: true });
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({ 
      name: item.name, 
      description: item.description, 
      price: item.price, 
      category: item.category, 
      image: item.image, 
      available: item.available 
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await deleteDoc(doc(db, 'menu', id));
      toast.success('Item deleted');
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Menu Management</h2>
          <p className="text-sm text-slate-500">Add or edit dishes in your restaurant menu</p>
        </div>
        <button 
          onClick={() => { setEditingItem(null); setShowModal(true); }}
          className="bg-[#f48c25] text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-[#f48c25]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus className="w-5 h-5" />
          Add New Item
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {menuItems.map((item) => (
          <div key={item.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-black/5 group">
            <div className="h-40 relative overflow-hidden">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute top-3 right-3 flex gap-2">
                <button onClick={() => handleEdit(item)} className="p-2 bg-white/90 backdrop-blur-md rounded-xl text-blue-500 shadow-sm hover:text-blue-600">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(item.id)} className="p-2 bg-white/90 backdrop-blur-md rounded-xl text-red-500 shadow-sm hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-md px-2 py-1 rounded-lg text-white text-[10px] font-bold uppercase tracking-widest">
                {item.category}
              </div>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-slate-900">{item.name}</h3>
                <span className="text-[#f48c25] font-black">${item.price.toFixed(2)}</span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-2 mb-4">{item.description}</p>
              <div className="flex items-center justify-between pt-4 border-t border-black/5">
                <span className={`text-[10px] font-bold uppercase tracking-widest ${item.available ? 'text-green-500' : 'text-red-500'}`}>
                  {item.available ? 'In Stock' : 'Out of Stock'}
                </span>
                <div className={`w-10 h-5 rounded-full relative transition-colors ${item.available ? 'bg-green-500' : 'bg-slate-200'}`}>
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${item.available ? 'right-1' : 'left-1'}`}></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-black/5 flex justify-between items-center bg-[#f48c25]/5">
              <h3 className="text-xl font-bold text-slate-900">{editingItem ? 'Edit Item' : 'Add New Item'}</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Item Name</label>
                  <input 
                    type="text" required
                    className="w-full h-12 px-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#f48c25]"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Category</label>
                  <select 
                    required
                    className="w-full h-12 px-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#f48c25]"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Price ($)</label>
                  <input 
                    type="number" step="0.01" required
                    className="w-full h-12 px-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#f48c25]"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Description</label>
                <textarea 
                  className="w-full h-24 p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#f48c25] resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Image URL</label>
                <input 
                  type="text"
                  className="w-full h-12 px-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#f48c25]"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <input 
                  type="checkbox" id="available"
                  className="w-5 h-5 text-[#f48c25] border-slate-300 rounded focus:ring-[#f48c25]"
                  checked={formData.available}
                  onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                />
                <label htmlFor="available" className="text-sm font-bold text-slate-700">Available for ordering</label>
              </div>
              <button 
                type="submit"
                className="w-full h-14 bg-[#f48c25] text-white font-bold rounded-2xl shadow-lg shadow-[#f48c25]/20 mt-4 active:scale-[0.98] transition-all"
              >
                {editingItem ? 'Update Item' : 'Create Item'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMenu;
