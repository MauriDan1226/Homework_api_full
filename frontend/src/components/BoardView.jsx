import { useState } from 'react';

import TaskCard from './TaskCard';
import { STATUS_META, TASK_STATUSES } from '../utils/constants';
import '../styles/board.css';

function BoardView({ tasks, pendingIds, onToggle, onEdit, onDelete, onMove, onCreate }) {
  // Columna sobre la que se esta soltando una tarjeta (solo raton)
  const [dropTarget, setDropTarget] = useState(null);
  const [draggedId, setDraggedId] = useState(null);

  function handleDrop(event, status) {
    event.preventDefault();
    setDropTarget(null);

    const taskId = event.dataTransfer.getData('text/plain');
    setDraggedId(null);
    if (!taskId) return;

    const task = tasks.find((item) => item._id === taskId);
    if (task && task.status !== status) onMove(taskId, status);
  }

  return (
    <div className="board">
      {TASK_STATUSES.map((status) => {
        const meta = STATUS_META[status];
        const columnTasks = tasks.filter((task) => task.status === status);

        return (
          <section
            key={status}
            className={`board__column board__column_${meta.modifier}${
              dropTarget === status ? ' board__column_drop' : ''
            }`}
            onDragOver={(event) => {
              event.preventDefault();
              setDropTarget(status);
            }}
            onDragLeave={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) setDropTarget(null);
            }}
            onDrop={(event) => handleDrop(event, status)}
          >
            <header className="board__header">
              <span className="board__dot" aria-hidden="true" />
              <h2 className="board__title">{meta.label}</h2>
              <span className="board__count">{columnTasks.length}</span>
            </header>

            <div className="board__list">
              {columnTasks.map((task) => (
                <div
                  key={task._id}
                  className={`board__item${draggedId === task._id ? ' board__item_dragging' : ''}`}
                  draggable
                  onDragStart={(event) => {
                    event.dataTransfer.setData('text/plain', task._id);
                    event.dataTransfer.effectAllowed = 'move';
                    setDraggedId(task._id);
                  }}
                  onDragEnd={() => {
                    setDraggedId(null);
                    setDropTarget(null);
                  }}
                >
                  <TaskCard
                    task={task}
                    isPending={pendingIds.includes(task._id)}
                    onToggle={onToggle}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                </div>
              ))}

              {columnTasks.length === 0 && (
                <p className="board__empty">
                  {status === 'pendiente' ? (
                    <button type="button" className="board__empty-action" onClick={onCreate}>
                      Anade tu primera tarea
                    </button>
                  ) : (
                    'Nada por aqui'
                  )}
                </p>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}

export default BoardView;
