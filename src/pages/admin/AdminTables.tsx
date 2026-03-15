import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Table } from '../../types';
import { Plus, Trash2, QrCode, Download, ExternalLink } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'react-hot-toast';

const AdminTables = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTableNumber, setNewTableNumber] = useState('');

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'tables'), (snapshot) => {
      setTables(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Table)));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAddTable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTableNumber) return;
    try {
      const qrUrl = `${window.location.origin}/menu?table=${newTableNumber}`;
      await addDoc(collection(db, 'tables'), {
        number: newTableNumber,
        qrCode: qrUrl
      });
      setNewTableNumber('');
      toast.success('Table added');
    } catch (error) {
      toast.error('Failed to add table');
    }
  };

  const handleDeleteTable = async (id: string) => {
    if (!window.confirm('Delete this table?')) return;
    try {
      await deleteDoc(doc(db, 'tables', id));
      toast.success('Table deleted');
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Table Management</h2>
          <p className="text-sm text-slate-500">Manage restaurant tables and QR codes</p>
        </div>
        <form onSubmit={handleAddTable} className="flex gap-2">
          <input 
            type="text" 
            placeholder="Table Number" 
            className="w-32 h-12 px-4 bg-white border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-[#f48c25]"
            value={newTableNumber}
            onChange={(e) => setNewTableNumber(e.target.value)}
          />
          <button 
            type="submit"
            className="bg-[#f48c25] text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-[#f48c25]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Plus className="w-5 h-5" />
            Add Table
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tables.map((table) => (
          <div key={table.id} className="bg-white rounded-3xl p-6 shadow-sm border border-black/5 flex flex-col items-center gap-6 group hover:border-[#f48c25]/30 transition-all">
            <div className="flex justify-between w-full items-center">
              <span className="text-lg font-black text-slate-900">Table #{table.number}</span>
              <button onClick={() => handleDeleteTable(table.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 bg-white rounded-2xl border-4 border-slate-50 shadow-inner">
              <QRCodeSVG value={table.qrCode} size={160} />
            </div>

            <div className="flex gap-2 w-full">
              <a 
                href={table.qrCode} 
                target="_blank" 
                rel="noreferrer"
                className="flex-1 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-all"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
              <button className="flex-1 h-10 bg-[#f48c25]/10 rounded-xl flex items-center justify-center text-[#f48c25] font-bold text-xs">
                Print QR
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminTables;
