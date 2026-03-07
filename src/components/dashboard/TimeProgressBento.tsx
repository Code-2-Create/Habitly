import React, { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';

const TimeProgressBento = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [yearProgress, setYearProgress] = useState(0);

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      
      // Calculate time remaining in current month
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();
      const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999);
      
      const diff = lastDayOfMonth.getTime() - now.getTime();
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeLeft({ days, hours, minutes, seconds });

      // Calculate year progress
      const startOfYear = new Date(currentYear, 0, 1).getTime();
      const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59, 999).getTime();
      const totalYearTime = endOfYear - startOfYear;
      const elapsedYearTime = now.getTime() - startOfYear;
      
      const progress = (elapsedYearTime / totalYearTime) * 100;
      setYearProgress(Math.min(100, Math.max(0, progress)));
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="border border-sky-100 bg-white p-6 shadow-sm flex flex-col gap-6">
      {/* Time Remaining in Month */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-cyan-600" />
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Time Left in Month</h3>
        </div>
        
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="bg-cyan-50 p-3 border border-cyan-100">
            <div className="text-2xl font-bold text-slate-900 font-mono">{timeLeft.days}</div>
            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-1">Days</div>
          </div>
          <div className="bg-blue-50 p-3 border border-blue-100">
            <div className="text-2xl font-bold text-slate-900 font-mono">{timeLeft.hours.toString().padStart(2, '0')}</div>
            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-1">Hrs</div>
          </div>
          <div className="bg-violet-50 p-3 border border-violet-100">
            <div className="text-2xl font-bold text-slate-900 font-mono">{timeLeft.minutes.toString().padStart(2, '0')}</div>
            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-1">Mins</div>
          </div>
          <div className="bg-emerald-50 p-3 border border-emerald-100">
            <div className="text-2xl font-bold text-slate-900 font-mono">{timeLeft.seconds.toString().padStart(2, '0')}</div>
            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-1">Secs</div>
          </div>
        </div>
      </div>

      {/* Year Progress */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Year Progress</h3>
          </div>
          <span className="text-sm font-bold text-slate-900">{yearProgress.toFixed(1)}%</span>
        </div>
        
        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${yearProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default TimeProgressBento;
