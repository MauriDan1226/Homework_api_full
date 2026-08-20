const router = require('express').Router();

const auth = require('../middlewares/auth');
const userRoutes = require('./users');
const taskRoutes = require('./tasks');
const { NotFoundError } = require('../utils/errors');

router.use('/users', userRoutes);
router.use('/tasks', auth, taskRoutes);

router.use((req, res, next) => {
  next(new NotFoundError('No se ha encontrado el recurso solicitado'));
});

module.exports = router;
