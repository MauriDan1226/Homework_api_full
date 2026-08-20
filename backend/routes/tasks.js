const router = require('express').Router();

const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/tasks');
const {
  validateCreateTask,
  validateUpdateTask,
  validateTaskId,
  validateTaskQuery,
} = require('../middlewares/validators');

router.get('/', validateTaskQuery, getTasks);
router.post('/', validateCreateTask, createTask);
router.get('/:id', validateTaskId, getTaskById);
router.patch('/:id', validateUpdateTask, updateTask);
router.delete('/:id', validateTaskId, deleteTask);

module.exports = router;
