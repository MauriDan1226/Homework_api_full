import { useState } from 'react';
import { Link } from 'react-router-dom';

import Alert from './Alert';
import BrandMark from './BrandMark';
import '../styles/auth.css';

// Formulario compartido por registro e inicio de sesion: cambia el modo con la
// prop isSignUp para no duplicar validacion ni maquetado.
function AuthForm({ isSignUp, onSubmit, isSubmitting, errorMessage, onDismissError }) {
  const [values, setValues] = useState({ name: '', email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});

  function validate() {
    const errors = {};

    if (isSignUp && values.name.trim().length < 2) {
      errors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      errors.email = 'Introduce un correo electronico valido';
    }

    if (values.password.length < 8) {
      errors.password = 'La contrasena debe tener al menos 8 caracteres';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!validate()) return;

    const payload = isSignUp
      ? { name: values.name.trim(), email: values.email.trim(), password: values.password }
      : { email: values.email.trim(), password: values.password };

    onSubmit(payload);
  }

  function renderSubmitLabel() {
    if (isSubmitting) return 'Un momento...';
    return isSignUp ? 'Crear cuenta' : 'Iniciar sesion';
  }

  return (
    <div className="auth">
      <section className="auth__panel">
        <div className="auth__brand">
          <BrandMark size={32} />
          <span className="auth__brand-name">Tareas</span>
        </div>

        <h1 className="auth__title">{isSignUp ? 'Crea tu cuenta' : 'Bienvenido de nuevo'}</h1>
        <p className="auth__subtitle">
          {isSignUp
            ? 'Organiza tu trabajo en un tablero claro y sin ruido.'
            : 'Entra para retomar tus tareas donde las dejaste.'}
        </p>

        <Alert onDismiss={onDismissError}>{errorMessage}</Alert>

        <form className="auth__form" onSubmit={handleSubmit} noValidate>
          {isSignUp && (
            <label className="field">
              <span className="field__label">Nombre</span>
              <input
                className={`field__input${fieldErrors.name ? ' field__input_invalid' : ''}`}
                type="text"
                name="name"
                value={values.name}
                onChange={handleChange}
                placeholder="Como quieres que te llamemos"
                autoComplete="name"
                disabled={isSubmitting}
              />
              {fieldErrors.name && <span className="field__error">{fieldErrors.name}</span>}
            </label>
          )}

          <label className="field">
            <span className="field__label">Correo electronico</span>
            <input
              className={`field__input${fieldErrors.email ? ' field__input_invalid' : ''}`}
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              placeholder="tucorreo@ejemplo.com"
              autoComplete="email"
              disabled={isSubmitting}
            />
            {fieldErrors.email && <span className="field__error">{fieldErrors.email}</span>}
          </label>

          <label className="field">
            <span className="field__label">Contrasena</span>
            <input
              className={`field__input${fieldErrors.password ? ' field__input_invalid' : ''}`}
              type="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              placeholder="Minimo 8 caracteres"
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
              disabled={isSubmitting}
            />
            {fieldErrors.password && <span className="field__error">{fieldErrors.password}</span>}
          </label>

          <button
            type="submit"
            className="button button_primary auth__submit"
            disabled={isSubmitting}
          >
            {renderSubmitLabel()}
          </button>
        </form>

        <p className="auth__switch">
          {isSignUp ? (
            <>
              Ya tienes cuenta? <Link to="/signin">Inicia sesion</Link>
            </>
          ) : (
            <>
              Aun no tienes cuenta? <Link to="/signup">Registrate</Link>
            </>
          )}
        </p>
      </section>

      <aside className="auth__aside" aria-hidden="true">
        {/* En movil este panel es el fondo de toda la pantalla; en escritorio,
            la columna decorativa. El poster es el primer fotograma del propio
            video, para que no se note el relevo cuando arranca. */}
        <video
          className="auth__video"
          src="/aurora-loop.mp4"
          poster="/aurora-poster.jpg"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          tabIndex={-1}
        />
        <div className="auth__aside-glow" />
        <blockquote className="auth__quote">
          Un tablero, tres columnas y todo tu trabajo bajo control.
        </blockquote>
        <ul className="auth__highlights">
          <li>Tablero Kanban y vista de lista</li>
          <li>Prioridades y fechas limite</li>
          <li>Filtros y orden a tu medida</li>
        </ul>
      </aside>
    </div>
  );
}

export default AuthForm;
