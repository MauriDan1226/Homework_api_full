import '../styles/alert.css';

// Mensaje visible de error o confirmacion. Se apoya en role="alert" para que
// los lectores de pantalla lo anuncien al aparecer.
function Alert({ children, tone = 'error', onDismiss }) {
  if (!children) return null;

  return (
    <div className={`alert alert_${tone}`} role="alert">
      <span className="alert__text">{children}</span>
      {onDismiss && (
        <button type="button" className="alert__close" onClick={onDismiss} aria-label="Cerrar aviso">
          &times;
        </button>
      )}
    </div>
  );
}

export default Alert;
