import { Link } from 'react-router-dom';

import '../styles/not-found.css';

function NotFound() {
  return (
    <div className="not-found">
      <p className="not-found__code">404</p>
      <h1 className="not-found__title">Esta pagina no existe</h1>
      <p className="not-found__text">
        Puede que el enlace este mal escrito o que la pagina se haya movido.
      </p>
      <Link className="button button_primary" to="/tareas">
        Volver a mis tareas
      </Link>
    </div>
  );
}

export default NotFound;
