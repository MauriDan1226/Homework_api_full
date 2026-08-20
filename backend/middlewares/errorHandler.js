const { isCelebrateError } = require('celebrate');

// Manejador central de errores: cualquier next(err) termina aqui y sale
// siempre con el mismo formato { message }.
module.exports = (err, req, res, next) => {
  if (res.headersSent) {
    next(err);
    return;
  }

  // Errores de validacion de celebrate/Joi
  if (isCelebrateError(err)) {
    const detail = err.details.get('body') || err.details.get('params') || err.details.get('query');
    res.status(400).send({
      message: detail ? detail.message : 'Los datos enviados no son validos',
    });
    return;
  }

  // Errores de validacion de Mongoose
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((error) => error.message)
      .join('. ');
    res.status(400).send({ message });
    return;
  }

  // Id con formato incorrecto
  if (err.name === 'CastError') {
    res.status(400).send({ message: 'El identificador proporcionado no es valido' });
    return;
  }

  // Indice unico duplicado (correo ya registrado)
  if (err.code === 11000) {
    res.status(409).send({ message: 'Ya existe una cuenta con ese correo electronico' });
    return;
  }

  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'Se ha producido un error en el servidor' : err.message;

  if (statusCode === 500) {
    console.error(err);
  }

  res.status(statusCode).send({ message });
};
