import { Habit } from '../services/habitService';

export const getMonthsForYear = (year: number) => {
  const months = [];
  
  for (let m = 0; m < 12; m++) {
    const days = [];
    const start = new Date(year, m, 1);
    const end = new Date(year, m + 1, 0); // last day of month
    
    // Pad beginning
    const startDayOfWeek = start.getDay(); // 0 = Sunday
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push('');
    }
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const y = d.getFullYear();
      const monthStr = String(d.getMonth() + 1).padStart(2, '0');
      const dayStr = String(d.getDate()).padStart(2, '0');
      days.push(`${y}-${monthStr}-${dayStr}`);
    }
    
    // Pad end to make it a multiple of 7
    const remainder = days.length % 7;
    if (remainder !== 0) {
      for (let i = 0; i < 7 - remainder; i++) {
        days.push('');
      }
    }
    
    months.push({
      name: start.toLocaleString('default', { month: 'short' }),
      days
    });
  }
  
  return months;
};

export const getPaddedYearDays = (year: number) => {
  const days = [];
  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31);
  
  // Pad beginning
  const startDayOfWeek = start.getDay(); // 0 = Sunday
  for (let i = 0; i < startDayOfWeek; i++) {
    days.push('');
  }
  
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    days.push(`${y}-${m}-${day}`);
  }
  
  return days;
};

export const calculateStreaksForYear = (habit: Habit) => {
  const streaks: Record<string, number> = {};
  
  const dates = Object.keys(habit.logs).sort();
  let currentStreak = 0;
  let lastDate: Date | null = null;
  
  for (const dateStr of dates) {
    if (!habit.logs[dateStr]) continue;
    
    // Parse date safely
    const [y, m, d] = dateStr.split('-').map(Number);
    const currentDate = new Date(y, m - 1, d);
    
    if (lastDate) {
      const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        currentStreak++;
      } else {
        currentStreak = 1;
      }
    } else {
      currentStreak = 1;
    }
    
    streaks[dateStr] = currentStreak;
    lastDate = currentDate;
  }
  
  return streaks;
};
