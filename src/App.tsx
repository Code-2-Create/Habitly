import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { HabitProvider } from './context/HabitContext';
import AppRouter from './router/AppRouter';

export default function App() {
  return (
    <AuthProvider>
      <HabitProvider>
        <AppRouter />
      </HabitProvider>
    </AuthProvider>
  );
}
