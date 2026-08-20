import { PRIORITY_META, STATUS_META } from '../utils/constants';
import { getDueLabel } from '../utils/formatters';
import '../styles/task-card.css';

function TaskCard({ task, isPending, onToggle, onEdit, onDelete, showStatus = false }) {
  const priority = PRIORITY_META[task.priority];
  const status = STATUS_META[task.status];
  const isDone = task.status === 'completada';
  const due = getDueLabel(task.dueDate);
  // Una tarea completada ya no se marca como vencida aunque pasara la fecha
  const dueTone = isDone && due.tone === 'overdue' ? 'neutral' : due.tone;

  return (
    <article
      className={`task-card task-card_priority-${priority.modifier}${
        isDone ? ' task-card_done' : ''
      }${isPending ? ' task-card_pending' : ''}`}
    >
      <div className="task-card__top">
        <button
          type="button"
          className={`task-card__check${isDone ? ' task-card__check_done' : ''}`}
          onClick={() => onToggle(task)}
          disabled={isPending}
          aria-pressed={isDone}
          aria-label={isDone ? 'Marcar como pendiente' : 'Marcar como completada'}
          title={isDone ? 'Marcar como pendiente' : 'Marcar como completada'}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <polyline points="4 12.5 9.5 18 20 6.5" />
          </svg>
        </button>

        <h3 className="task-card__title">{task.title}</h3>

        <span className={`badge badge_priority-${priority.modifier}`}>{priority.label}</span>
      </div>

      {task.description && <p className="task-card__description">{task.description}</p>}

      <div className="task-card__meta">
        <span className={`task-card__due task-card__due_${dueTone}`}>
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path d="M3 10h18M8 3v4M16 3v4" />
          </svg>
          {due.text}
        </span>

        {showStatus && <span className={`badge badge_status-${status.modifier}`}>{status.label}</span>}
      </div>

      <div className="task-card__actions">
        <button
          type="button"
          className="button button_ghost button_small"
          onClick={() => onEdit(task)}
          disabled={isPending}
        >
          Editar
        </button>
        <button
          type="button"
          className="button button_danger button_small"
          onClick={() => onDelete(task)}
          disabled={isPending}
        >
          Eliminar
        </button>
      </div>
    </article>
  );
}

export default TaskCard;
