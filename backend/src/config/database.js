const mongoose = require('mongoose');
const logger = require('../config/logger');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    logger.info(`MongoDB Conectado: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`Error en la conexión a MongoDB: ${error.message}`, error);
    process.exit(1);
  }
};

module.exports = connectDB;