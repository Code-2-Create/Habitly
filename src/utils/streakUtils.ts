import { Habit } from '../services/habitService';

export const calculateStreak = (logs: Record<string, boolean>) => {
  let currentStreak = 0;
  let longestStreak = 0;

  if (!logs || typeof logs !== 'object') {
    return { currentStreak, longestStreak };
  }

  // 1. Calculate longest streak
  const sortedDates = Object.keys(logs)
    .filter(date => logs[date]) // Only consider completed days
    .sort(); // Sort ascending

  let tempLongest = 0;
  let lastDate: Date | null = null;

  for (const dateStr of sortedDates) {
    const [y, m, d] = dateStr.split('-').map(Number);
    const currentDate = new Date(y, m - 1, d);

    if (lastDate) {
      // Calculate difference in days using UTC to avoid DST issues
      const utcCurrent = Date.UTC(y, m - 1, d);
      const utcLast = Date.UTC(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate());
      const diffDays = Math.round((utcCurrent - utcLast) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        tempLongest++;
      } else {
        tempLongest = 1;
      }
    } else {
      tempLongest = 1;
    }

    if (tempLongest > longestStreak) {
      longestStreak = tempLongest;
    }
    lastDate = currentDate;
  }

  // 2. Calculate current streak
  const today = new Date();
  
  const getLocalDateString = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const todayStr = getLocalDateString(today);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = getLocalDateString(yesterday);

  let checkDate = new Date(today);
  let checkDateStr = todayStr;

  if (logs[todayStr]) {
    // start from today
  } else if (logs[yesterdayStr]) {
    // start from yesterday
    checkDate = yesterday;
    checkDateStr = yesterdayStr;
  } else {
    // neither today nor yesterday is completed
    return { currentStreak: 0, longestStreak };
  }

  while (logs[checkDateStr]) {
    currentStreak++;
    checkDate.setDate(checkDate.getDate() - 1);
    checkDateStr = getLocalDateString(checkDate);
  }

  return { currentStreak, longestStreak };
};

export const calculateAllStreaks = (habit: Habit) => {
  const streaks: Record<string, number> = {};
  
  const dates = Object.keys(habit.logs).sort();
  let currentStreak = 0;
  let lastDate: Date | null = null;
  
  for (const dateStr of dates) {
    if (!habit.logs[dateStr]) continue;
    
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

export const calculateStreakForDate = (habit: Habit, dateStr: string) => {
  const streaks = calculateAllStreaks(habit);
  return streaks[dateStr] || 0;
};
