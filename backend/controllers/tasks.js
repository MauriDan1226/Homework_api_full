const Task = require('../models/task');
const { NotFoundError, ForbiddenError } = require('../utils/errors');

const PRIORITY_WEIGHT = { alta: 3, media: 2, baja: 1 };

// Las tareas sin fecha limite siempre van al final, sin importar la direccion
// del orden: no tener fecha no deberia adelantarlas en la lista.
function compareDueDate(a, b) {
  if (!a.dueDate && !b.dueDate) return 0;
  if (!a.dueDate) return 1;
  if (!b.dueDate) return -1;
  return a.dueDate - b.dueDate;
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

  return (a, b) => (a.createdAt - b.createdAt) * direction;
}

// Por defecto: primero lo que vence antes y, a igualdad, lo mas reciente.
function defaultComparator(a, b) {
  const byDueDate = compareDueDate(a, b);
  if (byDueDate !== 0) return byDueDate;
  return b.createdAt - a.createdAt;
}

// Recupera la tarea y comprueba que pertenece a quien hace la peticion.
async function findOwnedTask(taskId, userId) {
  const task = await Task.findById(taskId).select('+owner');

  if (!task) {
    throw new NotFoundError('No se ha encontrado la tarea solicitada');
  }

  if (task.owner.toString() !== userId) {
    throw new ForbiddenError('No tienes permiso para gestionar esta tarea');
  }

  return task;
}

const getTasks = async (req, res, next) => {
  try {
    const { status, priority, sort } = req.query;

    const filter = { owner: req.user._id };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const tasks = await Task.find(filter);
    tasks.sort(sort ? buildComparator(sort) : defaultComparator);

    res.send({ tasks });
  } catch (err) {
    next(err);
  }
};

const getTaskById = async (req, res, next) => {
  try {
    const task = await findOwnedTask(req.params.id, req.user._id);
    res.send({ task });
  } catch (err) {
    next(err);
  }
};

const createTask = async (req, res, next) => {
  try {
    const { title, description, priority, status, dueDate } = req.body;

    const task = await Task.create({
      title,
      description,
      priority,
      status,
      dueDate: dueDate || null,
      owner: req.user._id,
    });

    res.status(201).send({ task });
  } catch (err) {
    next(err);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const task = await findOwnedTask(req.params.id, req.user._id);
    const { title, description, priority, status, dueDate } = req.body;

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (priority !== undefined) task.priority = priority;
    if (status !== undefined) task.status = status;
    if (dueDate !== undefined) task.dueDate = dueDate || null;

    // save() en lugar de findByIdAndUpdate para que corran los hooks del modelo
    await task.save();

    res.send({ task });
  } catch (err) {
    next(err);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const task = await findOwnedTask(req.params.id, req.user._id);
    await task.deleteOne();

    res.send({ message: 'Tarea eliminada correctamente', task });
  } catch (err) {
    next(err);
  }
};

module.exports = { getTasks, getTaskById, createTask, updateTask, deleteTask };
