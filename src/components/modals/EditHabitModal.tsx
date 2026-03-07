import React, { useState } from 'react';
import { Habit } from '../../services/habitService';
import { useHabits } from '../../context/HabitContext';
import { X, TrendingUp, TrendingDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const PASTEL_COLORS = [
  '#fecaca', '#fed7aa', '#fef08a', '#d9f99d', '#a7f3d0',
  '#99f6e4', '#bae6fd', '#c7d2fe', '#e9d5ff', '#fbcfe8'
];

interface EditHabitModalProps {
  habit: Habit;
  onClose: () => void;
}

const EditHabitModal: React.FC<EditHabitModalProps> = ({ habit, onClose }) => {
  const { updateHabit } = useHabits();
  const [type, setType] = useState<"habit_maker" | "habit_breaker">(habit.type);
  const [color, setColor] = useState(habit.color);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (type === habit.type && color === habit.color) {
      onClose();
      return;
    }
    
    setLoading(true);
    await updateHabit(habit.id, { type, color });
    setLoading(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-zinc-200/60"
        >
          <div className="flex justify-between items-center p-6 border-b border-zinc-100 bg-zinc-50/50">
            <h2 className="text-xl font-bold text-zinc-900 tracking-tight">Edit {habit.title}</h2>
            <button onClick={onClose} className="p-2.5 text-zinc-400 hover:text-zinc-600 rounded-full hover:bg-zinc-100 transition-colors active:scale-95">
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-2 uppercase tracking-wide">Habit Type</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setType('habit_maker')}
                  className={`py-3.5 px-4 rounded-2xl border-2 text-sm font-bold transition-all flex items-center justify-center gap-2 active:scale-95 ${
                    type === 'habit_maker' 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-500 shadow-sm shadow-emerald-500/20' 
                      : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
                  }`}
                >
                  <TrendingUp size={18} />
                  Maker
                </button>
                <button
                  type="button"
                  onClick={() => setType('habit_breaker')}
                  className={`py-3.5 px-4 rounded-2xl border-2 text-sm font-bold transition-all flex items-center justify-center gap-2 active:scale-95 ${
                    type === 'habit_breaker' 
                      ? 'bg-orange-50 text-orange-700 border-orange-500 shadow-sm shadow-orange-500/20' 
                      : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
                  }`}
                >
                  <TrendingDown size={18} />
                  Breaker
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-3 uppercase tracking-wide">Select Color</label>
              <div className="flex flex-wrap gap-3">
                {PASTEL_COLORS.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-10 h-10 rounded-full transition-all flex items-center justify-center ${color === c ? 'scale-110 ring-2 ring-offset-2 ring-emerald-500 shadow-sm' : 'hover:scale-110 shadow-sm'}`}
                    style={{ backgroundColor: c }}
                    aria-label={`Select color ${c}`}
                  >
                    {color === c && <Check size={16} className="text-zinc-800/70" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-zinc-900 text-white py-4 rounded-2xl font-bold hover:bg-zinc-800 transition-all disabled:opacity-50 active:scale-95 shadow-sm"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EditHabitModal;
