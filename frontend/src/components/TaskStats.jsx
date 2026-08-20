import { STATUS_META, TASK_STATUSES } from '../utils/constants';
import '../styles/stats.css';

// Los contadores tambien funcionan como filtro rapido por estado
function TaskStats({ counts, activeStatus, onSelectStatus }) {
  const completionRate = counts.total ? Math.round((counts.completada / counts.total) * 100) : 0;

  return (
    <div className="stats">
      <button
        type="button"
        className={`stats__card${!activeStatus ? ' stats__card_active' : ''}`}
        onClick={() => onSelectStatus('')}
      >
        <span className="stats__value">{counts.total}</span>
        <span className="stats__label">Todas</span>
      </button>

      {TASK_STATUSES.map((status) => {
        const meta = STATUS_META[status];

        return (
          <button
            key={status}
            type="button"
            className={`stats__card stats__card_${meta.modifier}${
              activeStatus === status ? ' stats__card_active' : ''
            }`}
            onClick={() => onSelectStatus(activeStatus === status ? '' : status)}
          >
            <span className="stats__value">{counts[status]}</span>
            <span className="stats__label">{meta.label}</span>
          </button>
        );
      })}

      <div className="stats__progress">
        <div className="stats__progress-head">
          <span className="stats__label">Progreso</span>
          <span className="stats__percent">{completionRate}%</span>
        </div>
        <div
          className="stats__bar"
          role="progressbar"
          aria-valuenow={completionRate}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Porcentaje de tareas completadas"
        >
          <span className="stats__bar-fill" style={{ width: `${completionRate}%` }} />
        </div>
      </div>
    </div>
  );
}

export default TaskStats;
