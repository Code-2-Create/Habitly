import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/authService';
import { Activity, ArrowRight, Lock, Mail, Target } from 'lucide-react';
import { motion } from 'motion/react';

const Login = () => {
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
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 selection:bg-cyan-100 selection:text-cyan-950">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto min-h-[calc(100vh-3rem)] max-w-6xl overflow-hidden border border-sky-100/70 bg-white/90 shadow-[0_24px_70px_-30px_rgba(14,165,233,0.45)] lg:grid lg:grid-cols-2"
      >
        <section className="relative flex flex-col justify-center border-b border-sky-100 bg-gradient-to-br from-sky-100 via-cyan-100 to-emerald-100 p-8 lg:border-b-0 lg:border-r lg:p-12">
          <div className="mb-6 inline-flex w-fit items-center gap-2 border border-sky-200 bg-white/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-sky-700">
            Habitly
          </div>
          <h2 className="max-w-md text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
            Every streak starts with one intentional day.
          </h2>
          <p className="mt-3 max-w-md text-sm text-slate-600 sm:text-base">
            Log in to keep your momentum and build habits that compound over time.
          </p>
          <div className="relative mt-8 h-56 w-full max-w-lg self-center">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-44 w-44 rounded-full bg-emerald-300/35 animate-pulse" />
            </div>
            <div className="absolute inset-6 flex items-center justify-center">
              <div className="h-36 w-36 rounded-full bg-emerald-200/50 animate-pulse [animation-delay:200ms]" />
            </div>
            <div className="absolute inset-12 flex items-center justify-center">
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
                <Target className="h-12 w-12" />
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center p-6 sm:p-10 lg:p-12">
          <div className="w-full max-w-md">
            <div className="mb-8 flex flex-col items-center">
              <div className="mb-5 flex h-12 w-12 items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25">
                <Activity className="h-6 w-6" />
              </div>
              <h1 className="text-center text-3xl font-bold tracking-tight text-slate-900">Welcome back</h1>
              <p className="mt-2 text-center text-slate-500">Sign in to continue your habit journey</p>
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
                    className="w-full border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 font-medium text-slate-900 transition-all placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/35"
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
                    className="w-full border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 font-medium text-slate-900 transition-all placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/35"
                    placeholder="********"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex w-full items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 py-3.5 font-bold text-white transition-all hover:brightness-105 disabled:opacity-60"
              >
                {loading ? 'Signing in...' : (
                  <>
                    Sign In <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <p className="mt-7 text-center text-sm font-medium text-slate-500">
              Do not have an account?
              <Link to="/signup" className="ml-1 font-bold text-cyan-700 transition-colors hover:text-cyan-800">
                Sign up
              </Link>
            </p>
          </div>
        </section>
      </motion.div>
    </div>
  );
};

export default Login;
