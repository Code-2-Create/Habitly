import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup } from '../services/authService';
import { Activity, ArrowRight, Lock, Mail } from 'lucide-react';
import { motion } from 'motion/react';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-4 selection:bg-emerald-100 selection:text-emerald-900">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl shadow-zinc-200/50 border border-zinc-200/60 w-full max-w-md relative overflow-hidden"
      >
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-emerald-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        
        <div className="flex flex-col items-center mb-8 relative z-10">
          <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30 mb-6">
            <Activity className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight text-center">Create account</h1>
          <p className="text-zinc-500 mt-2 text-center">Start tracking your habits today</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm mb-6 border border-red-100 flex items-start gap-3">
            <div className="mt-0.5">⚠️</div>
            <p className="font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-2 uppercase tracking-wide">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-zinc-400" />
              </div>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-zinc-900 font-medium placeholder-zinc-400"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-2 uppercase tracking-wide">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-zinc-400" />
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-zinc-900 font-medium placeholder-zinc-400"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-zinc-900 text-white py-4 rounded-2xl font-bold hover:bg-zinc-800 transition-all disabled:opacity-50 active:scale-95 shadow-sm flex items-center justify-center gap-2 mt-2"
          >
            {loading ? 'Creating account...' : (
              <>
                Sign Up <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
        
        <p className="mt-8 text-center text-sm text-zinc-500 font-medium relative z-10">
          Already have an account? <Link to="/login" className="text-emerald-600 hover:text-emerald-700 font-bold ml-1 transition-colors">Log in</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
