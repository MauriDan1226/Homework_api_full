import { useCallback, useEffect, useMemo, useState } from 'react';

import * as api from '../utils/api';
import { TASK_STATUSES } from '../utils/constants';
import { useAuth } from './AuthContext';
import { TasksContext } from './TasksContext';

const INITIAL_FILTERS = { status: '', priority: '' };

export function TasksProvider({ children }) {
  const { token, signOut } = useAuth();

  // El servidor devuelve la lista ya ordenada; el filtrado se resuelve aqui
  // para que los contadores sigan reflejando el total real de tareas.
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [sort, setSort] = useState('dueDate');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  // Ids con una operacion en curso, para deshabilitar sus controles
  const [pendingIds, setPendingIds] = useState([]);

  const handleApiError = useCallback(
    (err) => {
      // Un 401 significa que el token dejo de ser valido: cerramos sesion
      if (err.status === 401) {
        signOut();
        return;
      }
      setError(err.message);
    },
    [signOut]
  );

  const loadTasks = useCallback(async () => {
    if (!token) return;

    setIsLoading(true);
    setError('');

    try {
      const data = await api.getTasks(token, { sort });
      setTasks(data.tasks);
    } catch (err) {
      handleApiError(err);
    } finally {
      setIsLoading(false);
    }
  }, [token, sort, handleApiError]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const markPending = useCallback((id, isPending) => {
    setPendingIds((prev) => {
      if (isPending) return prev.includes(id) ? prev : [...prev, id];
      return prev.filter((pendingId) => pendingId !== id);
    });
  }, []);

  const addTask = useCallback(
    async (values) => {
      setError('');
      try {
        const data = await api.createTask(token, values);
        setTasks((prev) => [data.task, ...prev]);
        return data.task;
      } catch (err) {
        handleApiError(err);
        throw err;
      }
    },
    [token, handleApiError]
  );

  const editTask = useCallback(
    async (id, updates) => {
      setError('');
      markPending(id, true);

      try {
        const data = await api.updateTask(token, id, updates);
        setTasks((prev) => prev.map((task) => (task._id === id ? data.task : task)));
        return data.task;
      } catch (err) {
        handleApiError(err);
        throw err;
      } finally {
        markPending(id, false);
      }
    },
    [token, handleApiError, markPending]
  );

  const removeTask = useCallback(
    async (id) => {
      setError('');
      markPending(id, true);

      try {
        await api.deleteTask(token, id);
        setTasks((prev) => prev.filter((task) => task._id !== id));
      } catch (err) {
        handleApiError(err);
        throw err;
      } finally {
        markPending(id, false);
      }
    },
    [token, handleApiError, markPending]
  );

  // Un clic alterna entre completada y pendiente
  const toggleComplete = useCallback(
    (task) => editTask(task._id, { status: task.status === 'completada' ? 'pendiente' : 'completada' }),
    [editTask]
  );

  const moveTask = useCallback((id, status) => editTask(id, { status }), [editTask]);

  const visibleTasks = useMemo(
    () =>
      tasks.filter((task) => {
        if (filters.status && task.status !== filters.status) return false;
        if (filters.priority && task.priority !== filters.priority) return false;
        return true;
      }),
    [tasks, filters]
  );

  // Los contadores se calculan sobre el total, no sobre lo filtrado
  const counts = useMemo(() => {
    const base = TASK_STATUSES.reduce((acc, status) => ({ ...acc, [status]: 0 }), {});

    tasks.forEach((task) => {
      base[task.status] += 1;
    });

    return { ...base, total: tasks.length };
  }, [tasks]);

  const resetFilters = useCallback(() => setFilters(INITIAL_FILTERS), []);

  const hasActiveFilters = Boolean(filters.status || filters.priority);

  const value = useMemo(
    () => ({
      tasks,
      visibleTasks,
      counts,
      filters,
      setFilters,
      resetFilters,
      hasActiveFilters,
      sort,
      setSort,
      isLoading,
      error,
      setError,
      pendingIds,
      reload: loadTasks,
      addTask,
      editTask,
      removeTask,
      toggleComplete,
      moveTask,
    }),
    [
      tasks,
      visibleTasks,
      counts,
      filters,
      resetFilters,
      hasActiveFilters,
      sort,
      isLoading,
      error,
      pendingIds,
      loadTasks,
      addTask,
      editTask,
      removeTask,
      toggleComplete,
      moveTask,
    ]
  );

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
}
