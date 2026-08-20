import { createContext, useContext } from 'react';

export const TasksContext = createContext(null);

export function useTasks() {
  const context = useContext(TasksContext);

  if (!context) {
    throw new Error('useTasks debe usarse dentro de un TasksProvider');
  }

  return context;
}
