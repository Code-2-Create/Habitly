import React from 'react';
import { Habit } from '../../services/habitService';
import { getColorShade } from '../../utils/colorUtils';
import { motion } from 'motion/react';

interface HabitCellProps {
  habit: Habit;
  date: string;
  completed: boolean;
  streak: number;
  onToggle: () => void;
}

const HabitCell: React.FC<HabitCellProps> = ({ habit, date, completed, streak, onToggle }) => {
  const shade = getColorShade(streak, habit.type, habit.color);

  return (
    <motion.button
      whileTap={{ scale: 0.85 }}
      whileHover={{ scale: 1.05 }}
      onClick={onToggle}
      className={`w-6 h-6 sm:w-7 sm:h-7 md:w-10 md:h-10 rounded-md md:rounded-[14px] border transition-colors duration-300 flex items-center justify-center select-none outline-none focus:outline-none caret-transparent relative
        ${completed ? 'border-transparent shadow-sm' : 'border-zinc-200 bg-white hover:bg-zinc-50'}
      `}
      style={{
        backgroundColor: completed ? shade : undefined
      }}
      aria-label={`Toggle habit for ${date}`}
    >
      {completed && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <svg className="w-3 h-3 md:w-5 md:h-5 text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
      )}
    </motion.button>
  );
};

export default HabitCell;
