import React, { useState } from 'react';
import { useHabits } from '../context/HabitContext';
import { useAuth } from '../context/AuthContext';
import { logout } from '../services/authService';
import WeeklyGrid from '../components/weekly/WeeklyGrid';
import AddHabitModal from '../components/modals/AddHabitModal';
import TimeProgressBento from '../components/dashboard/TimeProgressBento';
import { Plus, LogOut, UserCircle, Activity, Flame, Trophy, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

const Dashboard = () => {
  const { habits, loading } = useHabits();
  const { currentUser } = useAuth();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <Activity className="w-8 h-8 text-emerald-500 animate-spin" />
          <p className="text-zinc-500 font-medium">Loading your habits...</p>
        </div>
      </div>
    );
  }

  // Calculate some stats for the sidebar
  const totalHabits = habits.length;
  const activeStreaks = habits.filter(h => h.currentStreak > 0).length;
  const longestOverallStreak = Math.max(0, ...habits.map(h => h.longestStreak));
  
  // Today's completion
  const todayStr = new Date().toISOString().split('T')[0];
  const completedToday = habits.filter(h => h.logs[todayStr]).length;
  const completionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans pb-20 selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center shadow-sm shadow-emerald-500/20">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-900">Habitly</h1>
          </div>
          
          <div className="flex items-center gap-4">
            {currentUser ? (
              <>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-zinc-100 rounded-full">
                  <div className="w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xs font-bold">
                    {currentUser.email?.[0].toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-zinc-600">{currentUser.email}</span>
                </div>
                <button 
                  onClick={logout}
                  className="p-2 text-zinc-400 hover:text-zinc-900 transition-colors rounded-full hover:bg-zinc-100"
                  title="Log out"
                >
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <Link 
                to="/login"
                className="flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
              >
                <UserCircle size={24} />
                <span className="hidden sm:inline">Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {habits.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-48 h-48 mb-8 relative">
              <div className="absolute inset-0 bg-emerald-100 rounded-full animate-pulse opacity-50"></div>
              <div className="absolute inset-4 bg-emerald-50 rounded-full flex items-center justify-center">
                <Target className="w-16 h-16 text-emerald-500" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-zinc-900 mb-4 tracking-tight">Your journey starts today</h2>
            <p className="text-zinc-500 max-w-md mb-8 text-lg">
              Build consistency, track your progress, and achieve your goals with daily habits.
            </p>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 bg-emerald-500 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/20 transition-all active:scale-95"
            >
              <Plus size={20} />
              Create Your First Habit
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Section: Weekly Grid */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white rounded-3xl shadow-sm border border-zinc-200/60 overflow-hidden">
                <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                  <div>
                    <h2 className="text-xl font-semibold text-zinc-900">Weekly Tracker</h2>
                    <p className="text-sm text-zinc-500 mt-1">Stay consistent with your daily goals</p>
                  </div>
                  <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 text-sm font-semibold bg-zinc-900 text-white px-4 py-2.5 rounded-xl hover:bg-zinc-800 transition-all active:scale-95 shadow-sm"
                  >
                    <Plus size={16} />
                    <span className="hidden sm:inline">New Habit</span>
                  </button>
                </div>
                
                <div className="p-6 overflow-x-auto">
                  <WeeklyGrid habits={habits} />
                </div>
              </div>
            </div>

            {/* Right Sidebar: Stats & Motivation */}
            <div className="lg:col-span-4 space-y-6">
              {/* Today's Progress */}
              <div className="bg-white rounded-3xl shadow-sm border border-zinc-200/60 p-6">
                <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4">Today's Progress</h3>
                <div className="flex items-center gap-6">
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#f4f4f5"
                        strokeWidth="3"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="3"
                        strokeDasharray={`${completionRate}, 100`}
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-xl font-bold text-zinc-900">{completionRate}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-zinc-900 font-semibold text-lg">{completedToday} of {totalHabits}</p>
                    <p className="text-zinc-500 text-sm">habits completed</p>
                  </div>
                </div>
              </div>

              {/* Streak Summary */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-3xl shadow-sm border border-zinc-200/60 p-5 flex flex-col items-center justify-center text-center">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mb-3">
                    <Flame className="w-5 h-5 text-orange-500" />
                  </div>
                  <span className="text-2xl font-bold text-zinc-900 font-mono">{activeStreaks}</span>
                  <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide mt-1">Active Streaks</span>
                </div>
                <div className="bg-white rounded-3xl shadow-sm border border-zinc-200/60 p-5 flex flex-col items-center justify-center text-center">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mb-3">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                  </div>
                  <span className="text-2xl font-bold text-zinc-900 font-mono">{longestOverallStreak}</span>
                  <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide mt-1">Best Streak</span>
                </div>
              </div>

              {/* Motivation Quote */}
              <div className="bg-zinc-900 rounded-3xl shadow-sm p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-zinc-800 rounded-full opacity-50 blur-2xl"></div>
                <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-3 relative z-10">Daily Motivation</h3>
                <p className="text-lg font-medium leading-snug relative z-10">
                  "Small disciplines repeated with consistency every day lead to great achievements gained slowly over time."
                </p>
                <p className="text-zinc-400 text-sm mt-4 relative z-10">— John C. Maxwell</p>
              </div>

              {/* Time Progress Bento */}
              <TimeProgressBento />
            </div>

          </div>
        )}
      </main>

      {isAddModalOpen && (
        <AddHabitModal onClose={() => setIsAddModalOpen(false)} />
      )}
    </div>
  );
};

export default Dashboard;
