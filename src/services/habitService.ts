import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  getDocs, 
  updateDoc, 
  query, 
  where,
  serverTimestamp,
  getDoc
} from "firebase/firestore";
import { db } from "./firebaseConfig";

export interface Habit {
  id: string;
  userId: string;
  title: string;
  type: "habit_maker" | "habit_breaker";
  color: string;
  createdAt: any;
  currentStreak: number;
  longestStreak: number;
  logs: Record<string, boolean>;
}

export const createHabit = async (userId: string, habitData: Omit<Habit, "id" | "userId" | "createdAt" | "currentStreak" | "longestStreak" | "logs">) => {
  const habitRef = doc(collection(db, "habits"));
  const newHabit: Habit = {
    id: habitRef.id,
    userId,
    ...habitData,
    createdAt: serverTimestamp(),
    currentStreak: 0,
    longestStreak: 0,
    logs: {}
  };
  await setDoc(habitRef, newHabit);
  return newHabit;
};

export const deleteHabit = async (userId: string, habitId: string) => {
  const habitRef = doc(db, "habits", habitId);
  await deleteDoc(habitRef);
};

export const getUserHabits = async (userId: string): Promise<Habit[]> => {
  const habitsRef = collection(db, "habits");
  const q = query(habitsRef, where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  const habits: Habit[] = [];
  querySnapshot.forEach((doc) => {
    habits.push(doc.data() as Habit);
  });
  return habits;
};

export const updateHabit = async (userId: string, habitId: string, updates: Partial<Habit>) => {
  const habitRef = doc(db, "habits", habitId);
  await updateDoc(habitRef, updates);
};

export const toggleHabitCompletion = async (userId: string, habitId: string, date: string, completed: boolean, currentStreak: number, longestStreak: number) => {
  const habitRef = doc(db, "habits", habitId);
  await updateDoc(habitRef, {
    [`logs.${date}`]: !completed,
    currentStreak,
    longestStreak
  });
};
