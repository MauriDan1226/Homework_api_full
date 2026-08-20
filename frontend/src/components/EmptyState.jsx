import '../styles/empty-state.css';

function EmptyState({ title, message, actionLabel, onAction }) {
  return (
    <div className="empty-state">
      <span className="empty-state__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false">
          <rect x="3" y="4" width="18" height="17" rx="3" />
          <path d="M8 3v3M16 3v3M7.5 12.5l2.5 2.5 5-5" />
        </svg>
      </span>
      <h2 className="empty-state__title">{title}</h2>
      <p className="empty-state__message">{message}</p>
      {actionLabel && (
        <button type="button" className="button button_primary" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
