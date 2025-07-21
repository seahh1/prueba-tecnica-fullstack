const mongoose = require('mongoose');
const User = require('../models/userModel');

const seedAdminUser = async () => {
  if (!process.env.MONGO_URI || !process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
      console.error('Seed script: Faltan variables de entorno críticas (MONGO_URI, ADMIN_EMAIL, ADMIN_PASSWORD). Abortando.');
      process.exit(1);
  }
  
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Seed script: Conectado a MongoDB...');

    const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (adminExists) {
      console.log('Seed script: El usuario administrador ya existe. No se necesita hacer nada.');
      return;
    }

    console.log('Seed script: Creando usuario administrador...');
    const adminUser = new User({
      name: process.env.ADMIN_NAME || 'Admin',
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      permisos: 'Full',
      estatus: 'Active',
    });
    await adminUser.save();
    console.log('Seed script: Usuario administrador creado exitosamente.');

  } catch (error) {
    console.error('Seed script: Error al insertar el usuario administrador:', error);
    process.exit(1); 
  } finally {
    await mongoose.disconnect();
    console.log('Seed script: Desconectado de MongoDB.');
  }
};

seedAdminUser();