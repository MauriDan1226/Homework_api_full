import { PRIORITY_META, SORT_OPTIONS, STATUS_META, TASK_PRIORITIES, TASK_STATUSES } from '../utils/constants';
import '../styles/toolbar.css';

function Toolbar({
  view,
  onViewChange,
  filters,
  onFilterChange,
  onResetFilters,
  hasActiveFilters,
  sort,
  onSortChange,
  onCreate,
}) {
  return (
    <div className="toolbar">
      <div className="toolbar__group toolbar__group_filters">
        {/* En el tablero cada columna ya es un estado, asi que el filtro sobra */}
        {view === 'list' && (
          <label className="toolbar__field">
            <span className="toolbar__label">Estado</span>
            <select
              className="field__select"
              name="status"
              value={filters.status}
              onChange={(event) => onFilterChange({ status: event.target.value })}
            >
              <option value="">Todos</option>
              {TASK_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {STATUS_META[status].label}
                </option>
              ))}
            </select>
          </label>
        )}

        <label className="toolbar__field">
          <span className="toolbar__label">Prioridad</span>
          <select
            className="field__select"
            name="priority"
            value={filters.priority}
            onChange={(event) => onFilterChange({ priority: event.target.value })}
          >
            <option value="">Todas</option>
            {TASK_PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {PRIORITY_META[priority].label}
              </option>
            ))}
          </select>
        </label>

        <label className="toolbar__field toolbar__field_wide">
          <span className="toolbar__label">Ordenar por</span>
          <select
            className="field__select"
            name="sort"
            value={sort}
            onChange={(event) => onSortChange(event.target.value)}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        {hasActiveFilters && (
          <button type="button" className="button button_ghost button_small" onClick={onResetFilters}>
            Limpiar filtros
          </button>
        )}
      </div>

      <div className="toolbar__group toolbar__group_actions">
        <div className="toolbar__switch" role="group" aria-label="Cambiar vista">
          <button
            type="button"
            className={`toolbar__switch-button${view === 'board' ? ' toolbar__switch-button_active' : ''}`}
            onClick={() => onViewChange('board')}
            aria-pressed={view === 'board'}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <rect x="3" y="4" width="5" height="16" rx="1.5" />
              <rect x="9.5" y="4" width="5" height="11" rx="1.5" />
              <rect x="16" y="4" width="5" height="14" rx="1.5" />
            </svg>
            Tablero
          </button>
          <button
            type="button"
            className={`toolbar__switch-button${view === 'list' ? ' toolbar__switch-button_active' : ''}`}
            onClick={() => onViewChange('list')}
            aria-pressed={view === 'list'}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
            Lista
          </button>
        </div>

        <button type="button" className="button button_primary" onClick={onCreate}>
          <span aria-hidden="true">+</span> Nueva tarea
        </button>
      </div>
    </div>
  );
}

export default Toolbar;
