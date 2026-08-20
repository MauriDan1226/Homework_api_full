const mongoose = require('mongoose');

const { TASK_STATUSES, TASK_PRIORITIES } = require('../utils/constants');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'El titulo es obligatorio'],
      minlength: [2, 'El titulo debe tener al menos 2 caracteres'],
      maxlength: [100, 'El titulo no puede superar los 100 caracteres'],
      trim: true,
    },
    description: {
      type: String,
      maxlength: [1000, 'La descripcion no puede superar los 1000 caracteres'],
      trim: true,
      default: '',
    },
    priority: {
      type: String,
      enum: {
        values: TASK_PRIORITIES,
        message: 'La prioridad debe ser baja, media o alta',
      },
      default: 'media',
    },
    status: {
      type: String,
      enum: {
        values: TASK_STATUSES,
        message: 'El estado debe ser pendiente, en progreso o completada',
      },
      default: 'pendiente',
    },
    dueDate: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
      select: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Las consultas siempre filtran por owner y suelen ordenar por fecha limite
taskSchema.index({ owner: 1, status: 1 });
taskSchema.index({ owner: 1, dueDate: 1 });

// Mantiene completedAt sincronizado con el estado
taskSchema.pre('save', function syncCompletedAt(next) {
  if (this.isModified('status')) {
    this.completedAt = this.status === 'completada' ? new Date() : null;
  }
  next();
});

module.exports = mongoose.model('task', taskSchema);
