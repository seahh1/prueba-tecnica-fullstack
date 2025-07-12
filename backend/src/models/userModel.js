const mongoose = require('mongoose');
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
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', UserSchema);

module.exports = User;