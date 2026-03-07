import React, { useMemo } from 'react';
import { Habit } from '../../services/habitService';
import { getColorShade } from '../../utils/colorUtils';

interface HeatmapCellProps {
  habit: Habit;
  dateStr: string;
  streak: number;
}

const HeatmapCell: React.FC<HeatmapCellProps> = ({ habit, dateStr, streak }) => {
  const color = useMemo(() => {
    if (!dateStr) return 'transparent';
    if (!habit.logs[dateStr]) return '#f4f4f5'; // zinc-100
    return getColorShade(streak, habit.type, habit.color);
  }, [habit, dateStr, streak]);

  if (!dateStr) {
    return <div className="w-4 h-4 md:w-3.5 md:h-3.5 rounded-[3px] select-none" />;
  }

  return (
    <div 
      className="w-4 h-4 md:w-3.5 md:h-3.5 rounded-[3px] select-none outline-none focus:outline-none caret-transparent transition-transform hover:scale-125 hover:z-10 relative cursor-pointer"
      style={{ backgroundColor: color }}
      title={`${dateStr}: ${habit.logs[dateStr] ? `Completed (Streak: ${streak})` : 'Missed'}`}
    />
  );
};

export default HeatmapCell;
