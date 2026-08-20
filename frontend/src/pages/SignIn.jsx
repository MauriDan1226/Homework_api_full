import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import AuthForm from '../components/AuthForm';
import { useAuth } from '../contexts/AuthContext';

function SignIn() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Vuelve a la ruta que intentaba abrir antes de que le pidieramos entrar
  const redirectTo = location.state?.from?.pathname || '/tareas';

  async function handleSubmit(credentials) {
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await signIn(credentials);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthForm
      isSignUp={false}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      errorMessage={errorMessage}
      onDismissError={() => setErrorMessage('')}
    />
  );
}

export default SignIn;
