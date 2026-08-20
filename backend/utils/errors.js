// Errores HTTP reutilizables. Todos llevan statusCode para que el manejador
// central sepa que responder sin tener que inspeccionar el mensaje.
class HttpError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

class BadRequestError extends HttpError {
  constructor(message = 'Los datos enviados no son validos') {
    super(400, message);
  }
}

class UnauthorizedError extends HttpError {
  constructor(message = 'Se requiere autorizacion') {
    super(401, message);
  }
}

class ForbiddenError extends HttpError {
  constructor(message = 'No tienes permiso para realizar esta accion') {
    super(403, message);
  }
}

class NotFoundError extends HttpError {
  constructor(message = 'El recurso solicitado no existe') {
    super(404, message);
  }
}

class ConflictError extends HttpError {
  constructor(message = 'El recurso ya existe') {
    super(409, message);
  }
}

module.exports = {
  HttpError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
};
