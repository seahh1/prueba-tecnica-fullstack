const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre es obligatorio.'],
      trim: true, 
    },
    email: {
      type: String,
      required: [true, 'El email es obligatorio.'],
      unique: true, 
      lowercase: true, 
      trim: true,
      match: [/.+\@.+\..+/, 'Por favor, introduce un email válido.'], 
    },
    password: {
      type: String,
      required: [true, 'La contraseña es obligatoria.'],
      minlength: [6, 'La contraseña debe tener al menos 6 caracteres.'],
    },
    estatus: {
      type: String,
      enum: ['Active', 'Inactive'], 
      default: 'Active',
    },
    permisos: {
      type: String,
      enum: ['Operational', 'Full', 'Basic'],
      default: 'Basic',
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.index({ email: 1 }, { unique: true });

UserSchema.index({ name: 1 });

UserSchema.index({ createdAt: -1 });

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;