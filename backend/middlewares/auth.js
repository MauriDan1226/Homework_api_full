const jwt = require('jsonwebtoken');

const { UnauthorizedError } = require('../utils/errors');

const { JWT_SECRET } = process.env;

// Comprueba el token del encabezado Authorization y deja el id del usuario
// en req.user para que los controladores filtren por propietario.
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedError('Se requiere autorizacion'));
    return;
  }

  const token = authorization.replace('Bearer ', '');

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = { _id: payload._id };
    next();
  } catch (err) {
    next(new UnauthorizedError('El token no es valido o ha expirado'));
  }
};
