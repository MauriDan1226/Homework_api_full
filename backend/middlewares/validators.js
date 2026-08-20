const { celebrate, Joi, Segments } = require('celebrate');

const { TASK_STATUSES, TASK_PRIORITIES } = require('../utils/constants');

const objectId = Joi.string().hex().length(24);

const validateSignup = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      'string.min': 'El nombre debe tener al menos 2 caracteres',
      'string.max': 'El nombre no puede superar los 30 caracteres',
      'any.required': 'El nombre es obligatorio',
    }),
    email: Joi.string().required().email().messages({
      'string.email': 'El correo electronico no tiene un formato valido',
      'any.required': 'El correo es obligatorio',
    }),
    password: Joi.string().required().min(8).messages({
      'string.min': 'La contrasena debe tener al menos 8 caracteres',
      'any.required': 'La contrasena es obligatoria',
    }),
  }),
});

const validateSignin = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validateCreateTask = celebrate({
  [Segments.BODY]: Joi.object().keys({
    title: Joi.string().required().min(2).max(100).messages({
      'any.required': 'El titulo es obligatorio',
      'string.empty': 'El titulo es obligatorio',
    }),
    description: Joi.string().allow('').max(1000),
    priority: Joi.string().valid(...TASK_PRIORITIES),
    status: Joi.string().valid(...TASK_STATUSES),
    dueDate: Joi.date().allow(null, ''),
  }),
});

const validateUpdateTask = celebrate({
  [Segments.PARAMS]: Joi.object().keys({ id: objectId.required() }),
  [Segments.BODY]: Joi.object()
    .keys({
      title: Joi.string().min(2).max(100),
      description: Joi.string().allow('').max(1000),
      priority: Joi.string().valid(...TASK_PRIORITIES),
      status: Joi.string().valid(...TASK_STATUSES),
      dueDate: Joi.date().allow(null, ''),
    })
    .min(1)
    .messages({ 'object.min': 'Debes enviar al menos un campo para actualizar' }),
});

const validateTaskId = celebrate({
  [Segments.PARAMS]: Joi.object().keys({ id: objectId.required() }),
});

const validateTaskQuery = celebrate({
  [Segments.QUERY]: Joi.object().keys({
    status: Joi.string().valid(...TASK_STATUSES),
    priority: Joi.string().valid(...TASK_PRIORITIES),
    sort: Joi.string().valid('dueDate', '-dueDate', 'createdAt', '-createdAt', 'priority', '-priority'),
  }),
});

module.exports = {
  validateSignup,
  validateSignin,
  validateCreateTask,
  validateUpdateTask,
  validateTaskId,
  validateTaskQuery,
};
