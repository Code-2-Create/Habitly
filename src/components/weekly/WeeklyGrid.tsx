import React, { useState } from 'react';
import { Habit } from '../../services/habitService';
import { getWeekDates } from '../../utils/dateUtils';
import HabitRow from '../habit/HabitRow';
import { useHabits } from '../../context/HabitContext';
import WeekNavigation from './WeekNavigation';
import WeekHeader from './WeekHeader';
import { motion, AnimatePresence } from 'motion/react';

interface WeeklyGridProps {
  habits: Habit[];
}

const WeeklyGrid: React.FC<WeeklyGridProps> = ({ habits }) => {
  const [weekOffset, setWeekOffset] = useState(0);
  const [direction, setDirection] = useState(0);
  const { toggleHabit } = useHabits();

  const weekDays = getWeekDates(weekOffset);

  const handlePrevious = () => {
    setDirection(-1);
    setWeekOffset(prev => prev - 1);
  };

  const handleNext = () => {
    setDirection(1);
    setWeekOffset(prev => prev + 1);
  };

  const handleCurrentWeek = () => {
    setDirection(weekOffset > 0 ? -1 : 1);
    setWeekOffset(0);
  };

  // Calculate daily summary
  const dailySummary = weekDays.map(day => {
    let completedCount = 0;
    habits.forEach(habit => {
      if (habit.logs[day.date]) completedCount++;
    });
    return {
      date: day.date,
      count: completedCount,
      total: habits.length
    };
  });

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 50 : -50,
      opacity: 0
    })
  };

  return (
    <div className="w-full overflow-hidden">
      <WeekNavigation 
        weekDays={weekDays} 
        isCurrentWeek={weekOffset === 0}
        onCurrentWeek={handleCurrentWeek}
      />

      <WeekHeader 
        weekDays={weekDays} 
        onPrevious={handlePrevious} 
        onNext={handleNext} 
        isCurrentWeek={weekOffset === 0}
      />

      <div className="relative min-h-[200px]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={weekOffset}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="w-full"
          >
            {/* Habit Rows */}
            <div className="space-y-3">
              {habits.length === 0 ? (
                <div className="text-center py-8 text-zinc-400 text-sm">
                  No habits yet. Click "New Habit" to get started.
                </div>
              ) : (
                habits.map(habit => (
                  <HabitRow 
                    key={habit.id} 
                    habit={habit} 
                    weekDays={weekDays} 
                    onToggle={(date, completed) => toggleHabit(habit.id, date, completed)}
                  />
                ))
              )}
            </div>

            {/* Daily Summary */}
            {habits.length > 0 && (
              <div className="flex flex-row items-center gap-1 md:gap-4 mt-4 md:mt-6 pt-3 md:pt-4 border-t border-zinc-100 w-full">
                <div className="text-[10px] md:text-xs font-bold text-zinc-400 uppercase tracking-wider items-center w-[70px] sm:w-[100px] md:w-[200px] flex-shrink-0 truncate">
                  Summary
                </div>
                
                <div className="flex items-center justify-between flex-1 gap-0.5 sm:gap-1 md:gap-2">
                  <div className="w-4 sm:w-5 md:w-[30px]" /> {/* Spacer for left arrow */}
                  {dailySummary.map(day => {
                    const isAllDone = day.count === day.total && day.total > 0;
                    return (
                      <div key={day.date} className="w-6 sm:w-7 md:w-10 flex justify-center">
                        <span className={`text-[8px] md:text-xs font-semibold ${isAllDone ? 'text-emerald-500' : 'text-zinc-400'}`}>
                          {day.count}/{day.total}
                        </span>
                      </div>
                    );
                  })}
                  <div className="w-4 sm:w-5 md:w-[30px]" /> {/* Spacer for right arrow */}
                </div>
                
                <div className="w-[68px] md:w-[132px] flex-shrink-0"></div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default WeeklyGrid;
