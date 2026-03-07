import React, { useState, useRef, useMemo } from 'react';
import { Habit } from '../../services/habitService';
import HabitCell from './HabitCell';
import HabitStats from './HabitStats';
import YearHeatmapModal from '../modals/YearHeatmapModal';
import EditHabitModal from '../modals/EditHabitModal';
import { calculateAllStreaks } from '../../utils/streakUtils';
import { MoreVertical } from 'lucide-react';

interface HabitRowProps {
  habit: Habit;
  weekDays: { date: string; label: string; day: number }[];
  onToggle: (date: string, completed: boolean) => void;
}

const HabitRow: React.FC<HabitRowProps> = ({ habit, weekDays, onToggle }) => {
  const [isHeatmapOpen, setIsHeatmapOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  const streaks = useMemo(() => calculateAllStreaks(habit), [habit]);

  const handleTouchStart = () => {
    longPressTimer.current = setTimeout(() => {
      setIsHeatmapOpen(true);
    }, 600); // 600ms for long press
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  const handleTextClick = () => {
    setIsHeatmapOpen(true);
  };

  const handleCircleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditModalOpen(true);
  };

  return (
    <>
      <div 
        className="flex flex-row items-center gap-1 md:gap-4 group py-2 md:py-1 border-b border-zinc-100 md:border-none w-full"
      >
        {/* Habit Name */}
        <div className="flex items-center gap-1.5 md:gap-3 w-[76px] sm:w-[108px] md:w-[200px] flex-shrink-0">
          <div 
            className="w-2.5 h-2.5 md:w-4 md:h-4 rounded-full cursor-pointer hover:scale-110 transition-transform flex-shrink-0 shadow-sm" 
            style={{ backgroundColor: habit.color }}
            onClick={handleCircleClick}
            title="Edit Habit"
          />
          <span 
            className="text-[10px] sm:text-xs md:text-sm font-semibold text-zinc-700 truncate cursor-pointer hover:text-zinc-900 transition-colors"
            onClick={handleTextClick}
            title="View Heatmap"
          >
            {habit.title}
          </span>
          <button 
            onClick={handleCircleClick}
            className="opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-zinc-700 transition-all rounded-md hover:bg-zinc-100 hidden md:block ml-auto"
          >
            <MoreVertical size={14} />
          </button>
        </div>

        {/* Week Cells */}
        <div className="flex items-center justify-between flex-1 gap-0.5 sm:gap-1 md:gap-2">
          <div className="w-5 sm:w-6 md:w-[30px]" />
          {weekDays.map(day => {
            const completed = habit.logs[day.date] || false;
            const streak = completed ? (streaks[day.date] || 1) : 0;
            return (
              <HabitCell 
                key={day.date}
                habit={habit}
                date={day.date}
                completed={completed}
                streak={streak}
                onToggle={() => onToggle(day.date, completed)}
              />
            );
          })}
          <div className="w-5 sm:w-6 md:w-[30px]" />
        </div>

        {/* Stats */}
        <div className="flex-shrink-0">
          <HabitStats habit={habit} />
        </div>
      </div>

      {isHeatmapOpen && (
        <YearHeatmapModal habit={habit} onClose={() => setIsHeatmapOpen(false)} />
      )}
      {isEditModalOpen && (
        <EditHabitModal habit={habit} onClose={() => setIsEditModalOpen(false)} />
      )}
    </>
  );
};

export default HabitRow;
