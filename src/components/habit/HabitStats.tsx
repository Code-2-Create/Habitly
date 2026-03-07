import React from 'react';
import { Habit } from '../../services/habitService';

interface HabitStatsProps {
  habit: Habit;
}

const HabitStats: React.FC<HabitStatsProps> = ({ habit }) => {
  return (
    <div className="flex w-[68px] sm:w-[84px] md:w-[112px] justify-end items-center gap-1 sm:gap-2 md:gap-2 caret-transparent">
      <div className="flex w-[32px] sm:w-[40px] md:w-[52px] items-center justify-center gap-0.5 bg-orange-50 text-orange-600 py-0.5 md:py-1 rounded md:rounded-lg border border-orange-100/50" title="Current Streak">
        <span className="font-mono text-[10px] sm:text-xs md:text-sm font-semibold">{habit.currentStreak}</span>
      </div>
      <div className="flex w-[32px] sm:w-[40px] md:w-[52px] items-center justify-center gap-0.5 bg-yellow-50 text-yellow-600 py-0.5 md:py-1 rounded md:rounded-lg border border-yellow-100/50" title="Longest Streak">
        <span className="font-mono text-[10px] sm:text-xs md:text-sm font-semibold">{habit.longestStreak}</span>
      </div>
    </div>
  );
};

export default HabitStats;
