import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AuthForm from '../components/AuthForm';
import { useAuth } from '../contexts/AuthContext';

function SignUp() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(credentials) {
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await signUp(credentials);
      navigate('/tareas', { replace: true });
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthForm
      isSignUp
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      errorMessage={errorMessage}
      onDismissError={() => setErrorMessage('')}
    />
  );
}

export default SignUp;
