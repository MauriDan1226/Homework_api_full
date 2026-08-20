const router = require('express').Router();

const auth = require('../middlewares/auth');
const { signup, signin, getCurrentUser } = require('../controllers/users');
const { validateSignup, validateSignin } = require('../middlewares/validators');

router.post('/signup', validateSignup, signup);
router.post('/signin', validateSignin, signin);
router.get('/me', auth, getCurrentUser);

module.exports = router;
