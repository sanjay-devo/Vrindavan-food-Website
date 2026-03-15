import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { toast } from 'react-hot-toast';
import { UserPlus, Mail, Lock, User, Phone, AlertCircle } from 'lucide-react';
import { handleFirestoreError, OperationType } from '../utils/firestoreErrorHandler';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { user } = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      
      const userProfile = {
        uid: user.uid,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: 'consumer',
        createdAt: new Date().toISOString(),
      };

      const path = `users/${user.uid}`;
      try {
        await setDoc(doc(db, 'users', user.uid), userProfile);
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, path);
      }
      
      toast.success('Account created successfully!');
      navigate('/home');
    } catch (error: any) {
      let errorMessage = error.message || 'Failed to register';
      
      // Provide helpful messages for common errors
      if (error.code === 'auth/operation-not-allowed') {
        errorMessage = 'Email/Password authentication is not enabled. Contact admin to enable it in Firebase.';
      } else if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Use at least 6 characters.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7f5] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-sm border border-black/5 p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#f48c25]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <UserPlus className="text-[#f48c25] w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Create Account</h1>
          <p className="text-slate-500 mt-2">Join our community of food lovers</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-700 font-medium">{error}</p>
              {error.includes('not enabled') && (
                <p className="text-xs text-red-600 mt-2">
                  📄 See FIREBASE_SETUP_GUIDE.md for how to enable Email/Password authentication
                </p>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700 ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                required
                className="w-full h-12 pl-12 pr-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#f48c25] transition-all"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="email"
                required
                className="w-full h-12 pl-12 pr-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#f48c25] transition-all"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700 ml-1">Mobile Number</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="tel"
                required
                className="w-full h-12 pl-12 pr-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#f48c25] transition-all"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="password"
                required
                className="w-full h-12 pl-12 pr-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#f48c25] transition-all"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-[#f48c25] hover:bg-[#f48c25]/90 text-white font-bold rounded-2xl shadow-lg shadow-[#f48c25]/20 transition-all disabled:opacity-50 mt-4 active:scale-[0.98]"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-[#f48c25] font-bold hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
