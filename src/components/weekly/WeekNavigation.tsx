import React from 'react';
import { formatWeekRange } from '../../utils/dateUtils';
import { Calendar } from 'lucide-react';

interface WeekNavigationProps {
  weekDays: { date: string }[];
  isCurrentWeek: boolean;
  onCurrentWeek: () => void;
}

const WeekNavigation: React.FC<WeekNavigationProps> = ({ 
  weekDays, 
  isCurrentWeek,
  onCurrentWeek
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-slate-900">
          <Calendar className="w-5 h-5 text-cyan-600" />
          <h2 className="text-base font-bold">
            {formatWeekRange(weekDays)}
          </h2>
        </div>
        {!isCurrentWeek && (
          <button 
            onClick={onCurrentWeek}
            className="text-[11px] font-bold text-slate-500 hover:text-slate-900 transition-colors px-2.5 py-1 bg-sky-100 hover:bg-sky-200 rounded-md uppercase tracking-wider caret-transparent"
          >
            Today
          </button>
        )}
      </div>
    </div>
  );
};

export default WeekNavigation;
