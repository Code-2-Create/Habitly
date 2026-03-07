import React, { useState } from 'react';
import { useHabits } from '../context/HabitContext';
import { useAuth } from '../context/AuthContext';
import { logout } from '../services/authService';
import WeeklyGrid from '../components/weekly/WeeklyGrid';
import AddHabitModal from '../components/modals/AddHabitModal';
import TimeProgressBento from '../components/dashboard/TimeProgressBento';
import { Plus, LogOut, UserCircle, Activity, Flame, Trophy, Pencil, Check, X, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

const Dashboard = () => {
  const { habits, loading } = useHabits();
  const { currentUser } = useAuth();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditingQuote, setIsEditingQuote] = useState(false);
  const [dailyQuote, setDailyQuote] = useState<{ text: string; author: string }>(() => {
    const fallback = {
      text: 'Small disciplines repeated with consistency every day lead to lasting change.',
      author: 'John C. Maxwell',
    };

    if (typeof window === 'undefined') return fallback;

    const savedQuote = localStorage.getItem('habitly_daily_motivation_quote');
    if (!savedQuote) return fallback;

    try {
      const parsed = JSON.parse(savedQuote);
      if (typeof parsed?.text === 'string' && typeof parsed?.author === 'string') {
        return parsed;
      }
      return fallback;
    } catch {
      return fallback;
    }
  });
  const [quoteDraft, setQuoteDraft] = useState(dailyQuote);

  const handleEditQuote = () => {
    setQuoteDraft(dailyQuote);
    setIsEditingQuote(true);
  };

  const handleSaveQuote = () => {
    const text = quoteDraft.text.trim();
    const author = quoteDraft.author.trim() || 'Unknown';

    if (!text) return;

    const nextQuote = { text, author };
    setDailyQuote(nextQuote);
    localStorage.setItem('habitly_daily_motivation_quote', JSON.stringify(nextQuote));
    setIsEditingQuote(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sky-50">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <Activity className="w-8 h-8 text-cyan-500 animate-spin" />
          <p className="text-slate-500 font-medium">Loading your habits...</p>
        </div>
      </div>
    );
  }

  const totalHabits = habits.length;
  const activeStreaks = habits.filter((h) => h.currentStreak > 0).length;
  const longestOverallStreak = Math.max(0, ...habits.map((h) => h.longestStreak));

  const todayStr = new Date().toISOString().split('T')[0];
  const completedToday = habits.filter((h) => h.logs[todayStr]).length;
  const completionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

  return (
    <div className="min-h-screen pb-20 text-slate-900 selection:bg-cyan-100 selection:text-cyan-950">
      <header className="sticky top-0 z-30 border-b border-sky-100 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-sm shadow-cyan-500/25">
              <Activity className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Habitly</h1>
          </div>

          <div className="flex items-center gap-4">
            {currentUser ? (
              <>
                <div className="hidden items-center gap-2 rounded-full bg-sky-50 px-3 py-1.5 sm:flex">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-100 text-xs font-bold text-cyan-700">
                    {currentUser.email?.[0].toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-slate-600">{currentUser.email}</span>
                </div>
                <button
                  onClick={logout}
                  className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900"
                  title="Log out"
                >
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <Link to="/login" className="flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900">
                <UserCircle size={24} />
                <span className="hidden sm:inline">Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {habits.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-4xl border border-sky-100 bg-white/85 p-8 text-center shadow-[0_20px_60px_-35px_rgba(14,165,233,0.55)] sm:p-12"
          >
            <div className="relative mx-auto mb-2 h-52 w-52">
              <div className="absolute inset-0 rounded-full bg-emerald-300/35 animate-pulse" />
              <div className="absolute inset-6 rounded-full bg-emerald-200/50 animate-pulse [animation-delay:200ms]" />
              <div className="absolute inset-12 flex items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
                <Target className="h-14 w-14" />
              </div>
            </div>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-900">Your journey starts today</h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-600">
              Add your first habit to unlock streaks, weekly consistency, and long-term growth.
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="mx-auto mt-7 flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 font-semibold text-white transition-all hover:brightness-105"
            >
              <Plus size={20} />
              Create First Habit
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-8">
              <div className="overflow-hidden border border-sky-100 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-sky-50/70 to-cyan-50/70 p-6">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">Weekly Tracker</h2>
                    <p className="mt-1 text-sm text-slate-500">Build momentum one day at a time.</p>
                  </div>
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-105"
                  >
                    <Plus size={16} />
                    <span className="hidden sm:inline">New Habit</span>
                  </button>
                </div>

                <div className="overflow-x-auto p-6">
                  <WeeklyGrid habits={habits} />
                </div>
              </div>
            </div>

            <div className="space-y-6 lg:col-span-4">
              <div className="border border-sky-100 bg-white p-6 shadow-sm text-center">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-400 text-center">Today&apos;s Progress</h3>
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:justify-center">
                  <div className="relative h-20 w-20 flex-shrink-0">
                    <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#e2e8f0"
                        strokeWidth="3"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#06b6d4"
                        strokeWidth="3"
                        strokeDasharray={`${completionRate}, 100`}
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-bold text-slate-900">{completionRate}%</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-slate-900">
                      {completedToday} of {totalHabits}
                    </p>
                    <p className="text-sm text-slate-500">habits completed</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center justify-center border border-amber-100 bg-white p-5 text-center shadow-sm">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                    <Flame className="h-5 w-5 text-amber-600" />
                  </div>
                  <span className="font-mono text-2xl font-bold text-slate-900">{activeStreaks}</span>
                  <span className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">Active Streaks</span>
                </div>
                <div className="flex flex-col items-center justify-center border border-yellow-100 bg-white p-5 text-center shadow-sm">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
                    <Trophy className="h-5 w-5 text-yellow-600" />
                  </div>
                  <span className="font-mono text-2xl font-bold text-slate-900">{longestOverallStreak}</span>
                  <span className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">Best Streak</span>
                </div>
              </div>

              <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 p-6 text-white shadow-sm">
                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-cyan-400/20 blur-2xl" />
                <button
                  onClick={handleEditQuote}
                  className="absolute right-3 top-3 z-20 rounded-md bg-white/10 p-1.5 text-slate-300 transition hover:bg-white/20 hover:text-white"
                  title="Edit quote"
                  aria-label="Edit quote"
                >
                  <Pencil size={14} />
                </button>
                <h3 className="relative z-10 mb-3 text-sm font-bold uppercase tracking-wider text-slate-300">Daily Motivation</h3>
                {isEditingQuote ? (
                  <div className="relative z-10 space-y-3">
                    <textarea
                      value={quoteDraft.text}
                      onChange={(e) => setQuoteDraft((prev) => ({ ...prev, text: e.target.value }))}
                      className="w-full resize-none border border-slate-500/60 bg-slate-900/70 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                      rows={3}
                      placeholder="Enter your daily quote"
                    />
                    <input
                      type="text"
                      value={quoteDraft.author}
                      onChange={(e) => setQuoteDraft((prev) => ({ ...prev, author: e.target.value }))}
                      className="w-full border border-slate-500/60 bg-slate-900/70 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                      placeholder="Author"
                    />
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setIsEditingQuote(false)}
                        className="inline-flex items-center gap-1 rounded-md border border-slate-500 px-2.5 py-1.5 text-xs font-semibold text-slate-200 transition hover:bg-slate-700"
                      >
                        <X size={12} />
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveQuote}
                        className="inline-flex items-center gap-1 rounded-md bg-cyan-500 px-2.5 py-1.5 text-xs font-semibold text-white transition hover:bg-cyan-400"
                      >
                        <Check size={12} />
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="relative z-10 text-lg font-medium leading-snug">
                      "{dailyQuote.text}"
                    </p>
                    <p className="relative z-10 mt-4 text-sm text-slate-400">{dailyQuote.author}</p>
                  </>
                )}
              </div>

              <TimeProgressBento />
            </div>
          </div>
        )}
      </main>

      {isAddModalOpen && <AddHabitModal onClose={() => setIsAddModalOpen(false)} />}
    </div>
  );
};

export default Dashboard;
