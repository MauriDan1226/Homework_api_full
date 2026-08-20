const router = require('express').Router();

const userRoutes = require('./users');
const { NotFoundError } = require('../utils/errors');

router.use('/users', userRoutes);

router.use((req, res, next) => {
  next(new NotFoundError('No se ha encontrado el recurso solicitado'));
});

module.exports = router;
