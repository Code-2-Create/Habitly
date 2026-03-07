import React, { useState } from 'react';
import { useHabits } from '../../context/HabitContext';
import { X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const PASTEL_COLORS = [
  '#fb7185', '#fb923c', '#facc15', '#4ade80', '#22d3ee',
  '#38bdf8', '#60a5fa', '#818cf8', '#a78bfa', '#f472b6'
];

interface AddHabitModalProps {
  onClose: () => void;
}

const AddHabitModal: React.FC<AddHabitModalProps> = ({ onClose }) => {
  const { addHabit } = useHabits();
  const [title, setTitle] = useState('');
  const [type, setType] = useState<"habit_maker" | "habit_breaker">('habit_maker');
  const [color, setColor] = useState(PASTEL_COLORS[4]); // Default to emerald-ish
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    setLoading(true);
    await addHabit({ title, type, color });
    setLoading(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white shadow-2xl w-full max-w-md overflow-hidden border border-sky-100/70"
        >
          <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-gradient-to-r from-sky-50/70 to-cyan-50/70">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">New Habit</h2>
            <button onClick={onClose} className="p-2.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors active:scale-95">
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Habit Name</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Morning Exercise"
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all text-slate-900 font-medium placeholder-slate-400"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Habit Type</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setType('habit_maker')}
                  className={`py-3.5 px-4 rounded-2xl border-2 text-sm font-bold transition-all active:scale-95 ${
                    type === 'habit_maker' 
                      ? 'bg-cyan-50 text-cyan-700 border-cyan-500 shadow-sm shadow-cyan-500/20' 
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  Habit Maker
                </button>
                <button
                  type="button"
                  onClick={() => setType('habit_breaker')}
                  className={`py-3.5 px-4 rounded-2xl border-2 text-sm font-bold transition-all active:scale-95 ${
                    type === 'habit_breaker' 
                      ? 'bg-orange-50 text-orange-700 border-orange-500 shadow-sm shadow-orange-500/20' 
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  Habit Breaker
                </button>
              </div>
              <p className="mt-2.5 text-xs font-medium text-slate-500">
                {type === 'habit_maker' ? 'Build a positive routine.' : 'Eliminate a negative behavior.'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">Select Color</label>
              <div className="flex flex-wrap gap-3">
                {PASTEL_COLORS.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-10 h-10 rounded-full transition-all flex items-center justify-center ${color === c ? 'scale-110 ring-2 ring-offset-2 ring-cyan-500 shadow-sm' : 'hover:scale-110 shadow-sm'}`}
                    style={{ backgroundColor: c }}
                    aria-label={`Select color ${c}`}
                  >
                    {color === c && <Check size={16} className="text-slate-900/80" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-4 rounded-2xl font-bold transition-all hover:brightness-105 disabled:opacity-50 active:scale-95 shadow-sm"
              >
                {loading ? 'Creating...' : 'Create Habit'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddHabitModal;
