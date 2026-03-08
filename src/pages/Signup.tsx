import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup } from '../services/authService';
import { Activity, ArrowRight, Lock, Mail } from 'lucide-react';
import { motion } from 'motion/react';
import AppIllustration from '../components/illustrations/AppIllustration';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
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
    <div className="min-h-screen px-4 py-6 sm:px-6 selection:bg-violet-100 selection:text-violet-950">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto min-h-[calc(100vh-3rem)] max-w-6xl overflow-hidden border border-violet-100/70 bg-white/90 shadow-[0_24px_70px_-30px_rgba(124,58,237,0.4)] lg:grid lg:grid-cols-2"
      >
        <section className="relative flex flex-col justify-center border-b border-violet-100 bg-gradient-to-br from-violet-100 via-fuchsia-100 to-sky-100 p-8 lg:border-b-0 lg:border-r lg:p-12">
          <h2 className="max-w-md text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
            Start building better habits today.
          </h2>
          <p className="mt-3 max-w-md text-sm text-slate-600 sm:text-base">
            Create your account and turn daily actions into long-term progress.
          </p>
          <AppIllustration
            variant="signup"
            alt="Stylized illustration for signup"
            className="mt-8 h-60 w-60 self-center rounded-3xl border border-white/60 bg-white/55 p-8 shadow-lg shadow-violet-300/30 object-contain backdrop-blur-sm sm:h-64 sm:w-64"
          />
        </section>

        <section className="flex items-center justify-center p-6 sm:p-10 lg:p-12">
          <div className="w-full max-w-md">
            <div className="mb-8 flex flex-col items-center">
              <div className="mb-5 flex h-12 w-12 items-center justify-center bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white shadow-lg shadow-violet-500/25">
                <Activity className="h-6 w-6" />
              </div>
              <h1 className="text-center text-3xl font-bold tracking-tight text-slate-900">Create account</h1>
              <p className="mt-2 text-center text-slate-500">Begin your consistency journey now</p>
            </div>

            {error && (
              <div className="mb-6 flex items-start gap-3 border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                <div className="mt-0.5 text-base">!</div>
                <p className="font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-700">Email Address</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 font-medium text-slate-900 transition-all placeholder:text-slate-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-400/35"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-700">Password</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 font-medium text-slate-900 transition-all placeholder:text-slate-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-400/35"
                    placeholder="At least 6 characters"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex w-full items-center justify-center gap-2 bg-gradient-to-r from-violet-500 to-fuchsia-600 py-3.5 font-bold text-white transition-all hover:brightness-105 disabled:opacity-60"
              >
                {loading ? 'Creating account...' : (
                  <>
                    Sign Up <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <p className="mt-7 text-center text-sm font-medium text-slate-500">
              Already have an account?
              <Link to="/login" className="ml-1 font-bold text-violet-700 transition-colors hover:text-violet-800">
                Log in
              </Link>
            </p>
          </div>
        </section>
      </motion.div>
    </div>
  );
};

export default Signup;
