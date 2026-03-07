import React from 'react';
import { Habit } from '../../services/habitService';
import { Flame, Trophy } from 'lucide-react';

interface HabitStatsProps {
  habit: Habit;
  weekDays: { date: string }[];
}

const HabitStats: React.FC<HabitStatsProps> = ({ habit, weekDays }) => {
  let weeklyCount = 0;
  weekDays.forEach(day => {
    if (habit.logs[day.date]) weeklyCount++;
  });

  return (
    <div className="flex gap-1 md:gap-3 text-[10px] md:text-sm font-medium md:w-[132px] justify-end items-center caret-transparent">
      <div className="flex items-center justify-center bg-orange-50 text-orange-600 px-1 md:px-2.5 py-0.5 md:py-1 rounded md:rounded-lg border border-orange-100/50 min-w-[32px] md:min-w-[60px]" title="Current Streak">
        <Flame size={10} className="md:hidden mr-0.5" />
        <span className="font-mono">{habit.currentStreak}</span>
      </div>
      <div className="flex items-center justify-center bg-yellow-50 text-yellow-600 px-1 md:px-2.5 py-0.5 md:py-1 rounded md:rounded-lg border border-yellow-100/50 min-w-[32px] md:min-w-[60px]" title="Longest Streak">
        <Trophy size={10} className="md:hidden mr-0.5" />
        <span className="font-mono">{habit.longestStreak}</span>
      </div>
    </div>
  );
};

export default HabitStats;
