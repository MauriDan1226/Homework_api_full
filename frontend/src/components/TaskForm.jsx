import { useState } from 'react';

import Alert from './Alert';
import { PRIORITY_META, STATUS_META, TASK_PRIORITIES, TASK_STATUSES } from '../utils/constants';
import { toInputDate } from '../utils/formatters';
import '../styles/task-form.css';

function buildInitialValues(task) {
  return {
    title: task?.title || '',
    description: task?.description || '',
    priority: task?.priority || 'media',
    status: task?.status || 'pendiente',
    dueDate: toInputDate(task?.dueDate),
  };
}

function TaskForm({ task, onSubmit, onCancel }) {
  const [values, setValues] = useState(() => buildInitialValues(task));
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const isEditing = Boolean(task);

  function validate() {
    const errors = {};
    const title = values.title.trim();

    if (title.length < 2) {
      errors.title = 'El titulo debe tener al menos 2 caracteres';
    } else if (title.length > 100) {
      errors.title = 'El titulo no puede superar los 100 caracteres';
    }

    if (values.description.length > 1000) {
      errors.description = 'La descripcion no puede superar los 1000 caracteres';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError('');

    try {
      await onSubmit({
        title: values.title.trim(),
        description: values.description.trim(),
        priority: values.priority,
        status: values.status,
        dueDate: values.dueDate || null,
      });
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <Alert onDismiss={() => setSubmitError('')}>{submitError}</Alert>

      <label className="field">
        <span className="field__label">Titulo</span>
        <input
          className={`field__input${fieldErrors.title ? ' field__input_invalid' : ''}`}
          type="text"
          name="title"
          value={values.title}
          onChange={handleChange}
          placeholder="Que hay que hacer?"
          maxLength={120}
          disabled={isSubmitting}
          autoFocus
        />
        {fieldErrors.title && <span className="field__error">{fieldErrors.title}</span>}
      </label>

      <label className="field">
        <span className="field__label">Descripcion</span>
        <textarea
          className={`field__textarea${fieldErrors.description ? ' field__textarea_invalid' : ''}`}
          name="description"
          value={values.description}
          onChange={handleChange}
          placeholder="Detalles, enlaces o pasos a seguir (opcional)"
          maxLength={1000}
          disabled={isSubmitting}
        />
        <span className="task-form__counter">{values.description.length}/1000</span>
        {fieldErrors.description && <span className="field__error">{fieldErrors.description}</span>}
      </label>

      <div className="task-form__row">
        <label className="field">
          <span className="field__label">Prioridad</span>
          <select
            className="field__select"
            name="priority"
            value={values.priority}
            onChange={handleChange}
            disabled={isSubmitting}
          >
            {TASK_PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {PRIORITY_META[priority].label}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span className="field__label">Estado</span>
          <select
            className="field__select"
            name="status"
            value={values.status}
            onChange={handleChange}
            disabled={isSubmitting}
          >
            {TASK_STATUSES.map((status) => (
              <option key={status} value={status}>
                {STATUS_META[status].label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="field">
        <span className="field__label">Fecha limite</span>
        <input
          className="field__input"
          type="date"
          name="dueDate"
          value={values.dueDate}
          onChange={handleChange}
          disabled={isSubmitting}
        />
      </label>

      <div className="task-form__actions">
        <button
          type="button"
          className="button button_ghost"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        <button type="submit" className="button button_primary" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear tarea'}
        </button>
      </div>
    </form>
  );
}

export default TaskForm;
