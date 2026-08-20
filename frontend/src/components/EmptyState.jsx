import '../styles/empty-state.css';

function EmptyState({ title, message, actionLabel, onAction }) {
  return (
    <div className="empty-state">
      <img
        className="empty-state__art"
        src="/empty-tasks.jpg"
        alt=""
        width="640"
        height="640"
        aria-hidden="true"
      />
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
