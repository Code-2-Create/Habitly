import React from 'react';
import { ChevronLeft, ChevronRight, Flame, Trophy } from 'lucide-react';

interface WeekHeaderProps {
  weekDays: { date: string; label: string; day: number }[];
  onPrevious: () => void;
  onNext: () => void;
  isCurrentWeek: boolean;
}

const WeekHeader: React.FC<WeekHeaderProps> = ({ weekDays, onPrevious, onNext, isCurrentWeek }) => {
  return (
    <div className="flex flex-row items-center gap-1 md:gap-4 mb-2 md:mb-4 w-full">
      <div className="text-[10px] md:text-xs font-bold text-zinc-400 uppercase tracking-wider w-[70px] sm:w-[100px] md:w-[200px] flex-shrink-0 truncate">Habit</div>
      
      <div className="flex items-center justify-between flex-1 gap-0.5 sm:gap-1 md:gap-2">
        <button 
          onClick={onPrevious}
          className="w-4 sm:w-5 md:w-[30px] flex justify-center p-0.5 md:p-1.5 text-zinc-400 hover:text-zinc-800 transition-colors rounded-full hover:bg-zinc-100 active:scale-95 caret-transparent"
          aria-label="Previous week"
        >
          <ChevronLeft size={14} className="md:w-[18px] md:h-[18px]" />
        </button>
        
        {weekDays.map(day => {
          const isToday = day.date === new Date().toISOString().split('T')[0];
          return (
            <div key={day.date} className="w-6 sm:w-7 md:w-10 flex flex-col items-center justify-end gap-0.5 md:gap-1">
              <span className={`text-[8px] md:text-[10px] font-bold uppercase tracking-wider ${isToday ? 'text-emerald-500' : 'text-zinc-400'}`}>
                <span className="md:hidden">{day.label.charAt(0)}</span>
                <span className="hidden md:inline">{day.label}</span>
              </span>
              <span className={`text-[10px] md:text-sm font-semibold w-5 h-5 md:w-7 md:h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30' : 'text-zinc-600'}`}>
                {day.day}
              </span>
            </div>
          );
        })}

        <button 
          onClick={onNext}
          disabled={isCurrentWeek}
          className={`w-4 sm:w-5 md:w-[30px] flex justify-center p-0.5 md:p-1.5 rounded-full transition-all active:scale-95 caret-transparent ${
            isCurrentWeek 
              ? 'text-zinc-200 cursor-not-allowed' 
              : 'text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100'
          }`}
          aria-label="Next week"
        >
          <ChevronRight size={14} className="md:w-[18px] md:h-[18px]" />
        </button>
      </div>

      <div className="flex gap-1 md:gap-3 text-[8px] md:text-[10px] font-bold text-zinc-400 uppercase tracking-wider w-[68px] md:w-[132px] justify-end text-center items-center flex-shrink-0">
        <div className="w-[32px] md:w-[60px] flex items-center justify-center gap-0.5 md:gap-1">
          <Flame size={10} className="text-orange-500 md:w-3 md:h-3" />
          <span className="hidden md:inline">Streak</span>
        </div>
        <div className="w-[32px] md:w-[60px] flex items-center justify-center gap-0.5 md:gap-1">
          <Trophy size={10} className="text-yellow-500 md:w-3 md:h-3" />
          <span className="hidden md:inline">Best</span>
        </div>
      </div>
    </div>
  );
};

export default WeekHeader;
