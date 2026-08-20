export const TASK_STATUSES = ['pendiente', 'en progreso', 'completada'];

export const TASK_PRIORITIES = ['baja', 'media', 'alta'];

// Clave de la que cuelgan los modificadores de CSS de cada estado/prioridad
export const STATUS_META = {
  pendiente: { label: 'Pendiente', modifier: 'pending' },
  'en progreso': { label: 'En progreso', modifier: 'progress' },
  completada: { label: 'Completada', modifier: 'done' },
};

export const PRIORITY_META = {
  baja: { label: 'Baja', modifier: 'low' },
  media: { label: 'Media', modifier: 'medium' },
  alta: { label: 'Alta', modifier: 'high' },
};

export const SORT_OPTIONS = [
  { value: 'dueDate', label: 'Fecha limite (mas proxima)' },
  { value: '-dueDate', label: 'Fecha limite (mas lejana)' },
  { value: '-priority', label: 'Prioridad (alta primero)' },
  { value: 'priority', label: 'Prioridad (baja primero)' },
  { value: '-createdAt', label: 'Creacion (mas reciente)' },
  { value: 'createdAt', label: 'Creacion (mas antigua)' },
];

export const TOKEN_STORAGE_KEY = 'taskmanager.token';
