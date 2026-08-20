const jwt = require('jsonwebtoken');

const User = require('../models/user');
const { NotFoundError, ConflictError } = require('../utils/errors');

const { JWT_SECRET, JWT_EXPIRES_IN = '7d' } = process.env;

function signToken(user) {
  return jwt.sign({ _id: user._id.toString() }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      throw new ConflictError('Ya existe una cuenta con ese correo electronico');
    }

    const user = await User.create({ name, email, password });

    res.status(201).send({
      user: { _id: user._id, name: user.name, email: user.email },
      token: signToken(user),
    });
  } catch (err) {
    next(err);
  }
};

const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findUserByCredentials(email, password);

    res.send({
      user: { _id: user._id, name: user.name, email: user.email },
      token: signToken(user),
    });
  } catch (err) {
    next(err);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      throw new NotFoundError('No se ha encontrado el usuario');
    }

    res.send({ user });
  } catch (err) {
    next(err);
  }
};

module.exports = { signup, signin, getCurrentUser };
