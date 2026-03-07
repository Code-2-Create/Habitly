import React, { useMemo } from 'react';
import { Habit } from '../../services/habitService';
import { getMonthsForYear } from '../../utils/heatmapUtils';
import { calculateAllStreaks } from '../../utils/streakUtils';
import HeatmapCell from './HeatmapCell';

interface HeatmapGridProps {
  habit: Habit;
  year: number;
}

const HeatmapGrid: React.FC<HeatmapGridProps> = ({ habit, year }) => {
  const months = useMemo(() => getMonthsForYear(year), [year]);
  const streaks = useMemo(() => calculateAllStreaks(habit), [habit]);
  
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="w-full">
      {/* Desktop Layout (Horizontal) */}
      <div className="hidden md:flex">
        {/* Day Labels */}
        <div className="flex flex-col gap-[3px] mr-3 text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">
          {dayLabels.map((label, i) => (
            <div key={i} className="h-3.5 flex items-center">{i % 2 === 0 ? label : ''}</div>
          ))}
        </div>
        
        <div className="flex gap-3.5 overflow-x-auto pb-4 custom-scrollbar">
          {months.map((month, mIndex) => (
            <div key={mIndex} className="flex flex-col">
              {/* Month Grid */}
              <div 
                className="grid gap-1" 
                style={{ 
                  gridTemplateRows: 'repeat(7, 1fr)', 
                  gridAutoFlow: 'column' 
                }}
              >
                {month.days.map((day, index) => (
                  <HeatmapCell 
                    key={`${day}-${index}`} 
                    habit={habit} 
                    dateStr={day} 
                    streak={day ? (streaks[day] || 0) : 0} 
                  />
                ))}
              </div>
              
              {/* Month Label */}
              <div className="mt-3 text-[10px] text-zinc-400 font-bold text-center uppercase tracking-wider">
                {month.name}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Layout (Vertical) */}
      <div className="flex flex-col md:hidden">
        {/* Day Labels (Top axis) */}
        <div className="flex mb-2 ml-[44px] gap-1">
          {dayLabels.map((label, i) => (
            <div key={i} className="w-4 flex justify-center text-[9px] text-zinc-400 font-bold uppercase tracking-wider">
              {label[0]}
            </div>
          ))}
        </div>
        
        <div className="flex flex-col gap-5">
          {months.map((month, mIndex) => {
            const weeks = [];
            for (let i = 0; i < month.days.length; i += 7) {
              weeks.push(month.days.slice(i, i + 7));
            }

            return (
              <div key={mIndex} className="flex gap-4">
                {/* Month Label (Vertical axis) */}
                <div className="w-[28px] text-[10px] text-zinc-400 font-bold uppercase tracking-wider pt-0.5 text-right">
                  {month.name.substring(0, 3)}
                </div>
                
                {/* Month Grid */}
                <div className="flex flex-col gap-1">
                  {weeks.map((week, wIndex) => (
                    <div key={wIndex} className="flex gap-1">
                      {week.map((day, index) => (
                        <HeatmapCell 
                          key={`${day}-${index}`} 
                          habit={habit} 
                          dateStr={day} 
                          streak={day ? (streaks[day] || 0) : 0} 
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HeatmapGrid;
