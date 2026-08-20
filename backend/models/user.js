const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const { UnauthorizedError } = require('../utils/errors');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
      maxlength: [30, 'El nombre no puede superar los 30 caracteres'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'El correo es obligatorio'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (value) => validator.isEmail(value),
        message: 'El correo electronico no tiene un formato valido',
      },
    },
    password: {
      type: String,
      required: [true, 'La contrasena es obligatoria'],
      minlength: [8, 'La contrasena debe tener al menos 8 caracteres'],
      // Nunca viaja en las respuestas salvo que se pida explicitamente
      select: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Hashea la contrasena solo cuando cambia, para no re-hashear en cada update
userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) {
    next();
    return;
  }

  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err);
  }
});

// Busca al usuario por correo y compara la contrasena. Devuelve el mismo error
// tanto si el correo no existe como si la contrasena falla, para no filtrar
// que correos estan registrados.
userSchema.statics.findUserByCredentials = async function findUserByCredentials(email, password) {
  const user = await this.findOne({ email }).select('+password');

  if (!user) {
    throw new UnauthorizedError('Correo o contrasena incorrectos');
  }

  const matched = await bcrypt.compare(password, user.password);

  if (!matched) {
    throw new UnauthorizedError('Correo o contrasena incorrectos');
  }

  return user;
};

userSchema.methods.toJSON = function toJSON() {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('user', userSchema);
