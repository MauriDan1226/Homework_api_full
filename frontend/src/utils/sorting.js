// Mismo criterio de ordenacion que aplica el servidor en GET /tasks. Se repite
// aqui para que la lista siga ordenada tras crear o editar una tarea, sin tener
// que volver a pedirla.
const PRIORITY_WEIGHT = { alta: 3, media: 2, baja: 1 };

function toTime(value) {
  return value ? new Date(value).getTime() : null;
}

// Las tareas sin fecha limite siempre van al final, sin importar la direccion
// del orden: no tener fecha no deberia adelantarlas en la lista.
function compareDueDate(a, b) {
  const dateA = toTime(a.dueDate);
  const dateB = toTime(b.dueDate);

  if (!dateA && !dateB) return 0;
  if (!dateA) return 1;
  if (!dateB) return -1;
  return dateA - dateB;
}

function buildComparator(sort) {
  const descending = sort.startsWith('-');
  const field = descending ? sort.slice(1) : sort;
  const direction = descending ? -1 : 1;

  if (field === 'dueDate') {
    return (a, b) => {
      if (!a.dueDate || !b.dueDate) return compareDueDate(a, b);
      return compareDueDate(a, b) * direction;
    };
  }

  if (field === 'priority') {
    return (a, b) => (PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority]) * direction;
  }

  return (a, b) => (toTime(a.createdAt) - toTime(b.createdAt)) * direction;
}

// Por defecto: primero lo que vence antes y, a igualdad, lo mas reciente.
function defaultComparator(a, b) {
  const byDueDate = compareDueDate(a, b);
  if (byDueDate !== 0) return byDueDate;
  return toTime(b.createdAt) - toTime(a.createdAt);
}

export function sortTasks(tasks, sort) {
  return [...tasks].sort(sort ? buildComparator(sort) : defaultComparator);
}
