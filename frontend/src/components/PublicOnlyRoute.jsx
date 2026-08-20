import { Navigate } from 'react-router-dom';

import { useAuth } from '../contexts/AuthContext';
import Spinner from './Spinner';

// Evita que un usuario ya autenticado vuelva a las pantallas de acceso
function PublicOnlyRoute({ children }) {
  const { isAuthenticated, isCheckingSession } = useAuth();

  if (isCheckingSession) {
    return <Spinner fullPage label="Comprobando tu sesion..." />;
  }

  if (isAuthenticated) {
    return <Navigate to="/tareas" replace />;
  }

  return children;
}

export default PublicOnlyRoute;
