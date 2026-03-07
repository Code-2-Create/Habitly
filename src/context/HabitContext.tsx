import React, { createContext, useContext, useState, useEffect } from 'react';
import { Habit, getUserHabits, createHabit, deleteHabit, toggleHabitCompletion } from '../services/habitService';
import { useAuth } from './AuthContext';
import { calculateStreak } from '../utils/streakUtils';

interface HabitContextType {
  habits: Habit[];
  loading: boolean;
  fetchHabits: () => Promise<void>;
  addHabit: (habitData: Omit<Habit, "id" | "userId" | "createdAt" | "currentStreak" | "longestStreak" | "logs">) => Promise<void>;
  updateHabit: (habitId: string, updates: Partial<Habit>) => Promise<void>;
  removeHabit: (habitId: string) => Promise<void>;
  toggleHabit: (habitId: string, date: string, completed: boolean) => Promise<void>;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export const useHabits = () => {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error("useHabits must be used within a HabitProvider");
  }
  return context;
};

export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  const fetchHabits = async (showLoader = true) => {
    if (!currentUser) {
      const local = localStorage.getItem('habitly_local_habits');
      if (local) {
        setHabits(JSON.parse(local));
      } else {
        setHabits([]);
      }
      if (showLoader) setLoading(false);
      return;
    }
    if (showLoader) setLoading(true);
    try {
      const fetchedHabits = await getUserHabits(currentUser.uid);
      setHabits(fetchedHabits);
    } catch (error) {
      console.error("Error fetching habits:", error);
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, [currentUser]);

  const addHabit = async (habitData: Omit<Habit, "id" | "userId" | "createdAt" | "currentStreak" | "longestStreak" | "logs">) => {
    if (!currentUser) {
      const newHabit: Habit = {
        id: Math.random().toString(36).substr(2, 9),
        userId: 'local',
        ...habitData,
        createdAt: new Date().toISOString(),
        currentStreak: 0,
        longestStreak: 0,
        logs: {}
      };
      const updated = [...habits, newHabit];
      setHabits(updated);
      localStorage.setItem('habitly_local_habits', JSON.stringify(updated));
      return;
    }
    try {
      const newHabit = await createHabit(currentUser.uid, habitData);
      setHabits(prev => [...prev, newHabit]);
    } catch (error) {
      console.error("Error adding habit:", error);
    }
  };

  const removeHabit = async (habitId: string) => {
    if (!currentUser) {
      const updated = habits.filter(h => h.id !== habitId);
      setHabits(updated);
      localStorage.setItem('habitly_local_habits', JSON.stringify(updated));
      return;
    }
    try {
      await deleteHabit(currentUser.uid, habitId);
      setHabits(prev => prev.filter(h => h.id !== habitId));
    } catch (error) {
      console.error("Error deleting habit:", error);
    }
  };

  const updateHabit = async (habitId: string, updates: Partial<Habit>) => {
    if (!currentUser) {
      const updated = habits.map(h => h.id === habitId ? { ...h, ...updates } : h);
      setHabits(updated);
      localStorage.setItem('habitly_local_habits', JSON.stringify(updated));
      return;
    }
    try {
      await import('../services/habitService').then(m => m.updateHabit(currentUser.uid, habitId, updates));
      setHabits(prev => prev.map(h => h.id === habitId ? { ...h, ...updates } : h));
    } catch (error) {
      console.error("Error updating habit:", error);
    }
  };

  const toggleHabit = async (habitId: string, date: string, completed: boolean) => {
    if (!currentUser) {
      const updated = habits.map(habit => {
        if (habit.id === habitId) {
          const newLogs = { ...habit.logs, [date]: !completed };
          const { currentStreak, longestStreak } = calculateStreak(newLogs);
          return { ...habit, logs: newLogs, currentStreak, longestStreak };
        }
        return habit;
      });
      setHabits(updated);
      localStorage.setItem('habitly_local_habits', JSON.stringify(updated));
      return;
    }
    try {
      // Optimistic update
      setHabits(prev => prev.map(habit => {
        if (habit.id === habitId) {
          const newLogs = { ...habit.logs, [date]: !completed };
          const { currentStreak, longestStreak } = calculateStreak(newLogs);
          
          // Background update
          toggleHabitCompletion(currentUser.uid, habitId, date, completed, currentStreak, longestStreak).catch(e => {
            console.error("Failed to sync toggle:", e);
            fetchHabits(false); // Revert on failure without global loading flicker
          });

          return { ...habit, logs: newLogs, currentStreak, longestStreak };
        }
        return habit;
      }));
    } catch (error) {
      console.error("Error toggling habit:", error);
    }
  };

  return (
    <HabitContext.Provider value={{ habits, loading, fetchHabits, addHabit, updateHabit, removeHabit, toggleHabit }}>
      {children}
    </HabitContext.Provider>
  );
};
