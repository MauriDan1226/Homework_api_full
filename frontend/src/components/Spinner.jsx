import '../styles/spinner.css';

function Spinner({ label = 'Cargando...', fullPage = false }) {
  return (
    <div className={`spinner${fullPage ? ' spinner_full-page' : ''}`} role="status">
      <span className="spinner__ring" aria-hidden="true" />
      <span className="spinner__label">{label}</span>
    </div>
  );
}

export default Spinner;
