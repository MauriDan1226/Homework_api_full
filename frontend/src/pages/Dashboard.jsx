import { useCallback, useEffect, useState } from 'react';

import Alert from '../components/Alert';
import BoardView from '../components/BoardView';
import ConfirmDialog from '../components/ConfirmDialog';
import EmptyState from '../components/EmptyState';
import Header from '../components/Header';
import ListView from '../components/ListView';
import Modal from '../components/Modal';
import Spinner from '../components/Spinner';
import TaskForm from '../components/TaskForm';
import TaskStats from '../components/TaskStats';
import Toolbar from '../components/Toolbar';
import { useAuth } from '../contexts/AuthContext';
import { useTasks } from '../contexts/TasksContext';
import '../styles/dashboard.css';

const VIEW_STORAGE_KEY = 'taskmanager.view';

function readStoredView() {
  try {
    return localStorage.getItem(VIEW_STORAGE_KEY) === 'list' ? 'list' : 'board';
  } catch {
    return 'board';
  }
}

function Dashboard() {
  const { user } = useAuth();
  const {
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
    reload,
    addTask,
    editTask,
    removeTask,
    toggleComplete,
    moveTask,
  } = useTasks();

  const [view, setView] = useState(readStoredView);
  const [editingTask, setEditingTask] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(VIEW_STORAGE_KEY, view);
    } catch {
      // La preferencia de vista no es critica si no se puede guardar
    }
  }, [view]);

  const handleViewChange = useCallback(
    (nextView) => {
      setView(nextView);
      // En el tablero el estado lo marcan las columnas, no un filtro
      if (nextView === 'board') setFilters((prev) => ({ ...prev, status: '' }));
    },
    [setFilters]
  );

  const handleFilterChange = useCallback(
    (patch) => setFilters((prev) => ({ ...prev, ...patch })),
    [setFilters]
  );

  const handleSelectStatus = useCallback(
    (status) => {
      // Filtrar por estado solo tiene sentido en la lista
      if (status) setView('list');
      setFilters((prev) => ({ ...prev, status }));
    },
    [setFilters]
  );

  function openCreateForm() {
    setEditingTask(null);
    setIsFormOpen(true);
  }

  function openEditForm(task) {
    setEditingTask(task);
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    setEditingTask(null);
  }

  async function handleSubmitTask(values) {
    if (editingTask) {
      await editTask(editingTask._id, values);
    } else {
      await addTask(values);
    }
    closeForm();
  }

  async function handleConfirmDelete() {
    try {
      await removeTask(taskToDelete._id);
    } finally {
      setTaskToDelete(null);
    }
  }

  function renderContent() {
    if (isLoading) {
      return <Spinner fullPage label="Cargando tus tareas..." />;
    }

    if (tasks.length === 0) {
      return (
        <EmptyState
          title="Todavia no tienes tareas"
          message="Crea la primera y empieza a organizar tu trabajo en el tablero."
          actionLabel="Crear mi primera tarea"
          onAction={openCreateForm}
        />
      );
    }

    if (visibleTasks.length === 0) {
      return (
        <EmptyState
          title="Ninguna tarea coincide"
          message="Prueba a ajustar los filtros para ver mas resultados."
          actionLabel="Limpiar filtros"
          onAction={resetFilters}
        />
      );
    }

    if (view === 'board') {
      return (
        <BoardView
          tasks={visibleTasks}
          pendingIds={pendingIds}
          onToggle={toggleComplete}
          onEdit={openEditForm}
          onDelete={setTaskToDelete}
          onMove={moveTask}
          onCreate={openCreateForm}
        />
      );
    }

    return (
      <ListView
        tasks={visibleTasks}
        pendingIds={pendingIds}
        onToggle={toggleComplete}
        onEdit={openEditForm}
        onDelete={setTaskToDelete}
      />
    );
  }

  return (
    <div className="dashboard">
      <Header />

      <main className="dashboard__main">
        <section className="dashboard__intro">
          <div>
            <h1 className="dashboard__title">Hola, {user?.name}</h1>
            <p className="dashboard__subtitle">
              {counts.total === 0
                ? 'Tu tablero esta listo para la primera tarea.'
                : `Tienes ${counts.pendiente + counts['en progreso']} tarea(s) por delante.`}
            </p>
          </div>
        </section>

        <TaskStats
          counts={counts}
          activeStatus={filters.status}
          onSelectStatus={handleSelectStatus}
        />

        <Toolbar
          view={view}
          onViewChange={handleViewChange}
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={resetFilters}
          hasActiveFilters={hasActiveFilters}
          sort={sort}
          onSortChange={setSort}
          onCreate={openCreateForm}
        />

        {error && (
          <div className="dashboard__alert">
            <Alert onDismiss={() => setError('')}>{error}</Alert>
            <button type="button" className="button button_secondary button_small" onClick={reload}>
              Reintentar
            </button>
          </div>
        )}

        {renderContent()}
      </main>

      <Modal
        title={editingTask ? 'Editar tarea' : 'Nueva tarea'}
        isOpen={isFormOpen}
        onClose={closeForm}
      >
        <TaskForm
          key={editingTask?._id || 'new'}
          task={editingTask}
          onSubmit={handleSubmitTask}
          onCancel={closeForm}
        />
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(taskToDelete)}
        title="Eliminar tarea"
        message={`Se eliminara "${taskToDelete?.title}" de forma permanente. Esta accion no se puede deshacer.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setTaskToDelete(null)}
      />
    </div>
  );
}

export default Dashboard;
