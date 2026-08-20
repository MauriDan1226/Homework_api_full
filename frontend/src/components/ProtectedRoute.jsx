import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '../contexts/AuthContext';
import Spinner from './Spinner';

// Bloquea el acceso mientras se valida el token y redirige al login si no hay
// sesion, guardando la ruta de origen para volver a ella tras entrar.
function ProtectedRoute({ children }) {
  const { isAuthenticated, isCheckingSession } = useAuth();
  const location = useLocation();

  if (isCheckingSession) {
    return <Spinner fullPage label="Comprobando tu sesion..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
