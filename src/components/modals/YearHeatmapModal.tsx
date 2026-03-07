import React, { useState, useMemo } from 'react';
import { Habit } from '../../services/habitService';
import { X, Trash2, AlertTriangle, Flame, Trophy } from 'lucide-react';
import YearSelector from './YearSelector';
import HeatmapGrid from './HeatmapGrid';
import { useHabits } from '../../context/HabitContext';
import { generateGradientShades } from '../../utils/colorUtils';
import { motion, AnimatePresence } from 'motion/react';

interface YearHeatmapModalProps {
  habit: Habit;
  onClose: () => void;
}

const YearHeatmapModal: React.FC<YearHeatmapModalProps> = ({ habit, onClose }) => {
  const { removeHabit } = useHabits();
  const currentYear = new Date().getFullYear();
  
  let startYear = currentYear;
  if (habit.createdAt) {
    const d = typeof habit.createdAt === 'string' 
      ? new Date(habit.createdAt) 
      : new Date(habit.createdAt.seconds * 1000);
    startYear = d.getFullYear();
  }
  
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const handleDelete = async () => {
    await removeHabit(habit.id);
    onClose();
  };

  const legendShades = useMemo(() => {
    const allShades = generateGradientShades(habit.type, habit.color);
    // Pick 4 representative shades for the legend (levels 1, 7, 14, 21).
    // For habit_breaker, color scale is inverted in cells, so reverse legend
    // samples to keep Less -> More visually consistent left-to-right.
    const sampledShades = [
      allShades[0],
      allShades[6],
      allShades[13],
      allShades[20]
    ];
    return habit.type === 'habit_breaker' ? [...sampledShades].reverse() : sampledShades;
  }, [habit.type, habit.color]);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden border border-zinc-200/60 flex flex-col max-h-[90vh] relative"
        >
          <div className="flex justify-between items-center p-4 md:p-6 border-b border-zinc-100 bg-zinc-50/50">
            <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
              <div 
                className="w-5 h-5 rounded-full shadow-sm flex-shrink-0" 
                style={{ backgroundColor: habit.color }}
              />
              <h2 className="text-lg md:text-2xl font-bold text-zinc-900 tracking-tight truncate">{habit.title}</h2>
              <div className="flex-shrink-0">
                <YearSelector 
                  startYear={startYear} 
                  currentYear={currentYear} 
                  selectedYear={selectedYear} 
                  onChange={setSelectedYear} 
                />
              </div>
            </div>
            <div className="flex items-center gap-1 md:gap-2 flex-shrink-0 ml-2">
              <button 
                onClick={() => setIsDeleteConfirmOpen(true)}
                className="p-2 md:p-2.5 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors active:scale-95"
                title="Delete Habit"
              >
                <Trash2 size={18} className="md:w-5 md:h-5" />
              </button>
              <div className="w-px h-6 bg-zinc-200 mx-0.5 md:mx-1"></div>
              <button 
                onClick={onClose} 
                className="p-2 md:p-2.5 text-zinc-400 hover:text-zinc-600 rounded-full hover:bg-zinc-100 transition-colors active:scale-95"
              >
                <X size={18} className="md:w-5 md:h-5" />
              </button>
            </div>
          </div>
          
          <div className="p-4 md:p-8 overflow-y-auto custom-scrollbar">
            <div className="bg-zinc-50 rounded-2xl p-4 md:p-6 border border-zinc-100 mb-6 md:mb-8 flex justify-center">
              <HeatmapGrid habit={habit} year={selectedYear} />
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
              <div className="flex flex-wrap justify-center gap-2 md:gap-4 w-full md:w-auto">
                <div className="flex items-center gap-2 bg-orange-50 text-orange-700 px-3 md:px-4 py-2 rounded-xl border border-orange-100/50">
                  <Flame size={16} className="text-orange-500 fill-orange-500" />
                  <span className="font-semibold">{habit.currentStreak}</span> 
                  <span className="text-orange-600/80 hidden sm:inline">Current Streak</span>
                </div>
                <div className="flex items-center gap-2 bg-yellow-50 text-yellow-700 px-3 md:px-4 py-2 rounded-xl border border-yellow-100/50">
                  <Trophy size={16} className="text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold">{habit.longestStreak}</span> 
                  <span className="text-yellow-600/80 hidden sm:inline">Best Streak</span>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-zinc-200/60 shadow-sm w-full md:w-auto justify-center">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Less</span>
                <div className="flex gap-1">
                  <div className="w-3.5 h-3.5 rounded-[3px] bg-zinc-100" />
                  {legendShades.map((shade, i) => (
                    <div key={i} className="w-3.5 h-3.5 rounded-[3px]" style={{ backgroundColor: shade }} />
                  ))}
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">More</span>
              </div>
            </div>
          </div>

          {/* Delete Confirmation Modal */}
          {isDeleteConfirmOpen && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-10">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full mx-4 border border-zinc-200/60 text-center"
              >
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <AlertTriangle size={32} />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 mb-3">Delete this habit?</h3>
                <p className="text-zinc-500 mb-8 leading-relaxed">
                  All your tracked data for this habit will be lost forever. This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsDeleteConfirmOpen(false)}
                    className="flex-1 py-3 px-4 rounded-xl font-semibold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 transition-colors active:scale-95"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex-1 py-3 px-4 rounded-xl font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors active:scale-95 shadow-sm shadow-red-500/20"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default YearHeatmapModal;
