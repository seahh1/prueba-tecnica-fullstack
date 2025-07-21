const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/userModel');
const logger = require('../config/logger');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.user.id).select('-password');
      if(!req.user) {
        logger.warn(`Autenticación fallida: Usuario no encontrado para el ID en token. ID: ${decoded.user.id}, IP: ${req.ip}`);
        res.status(401);
        throw new Error('No autorizado, usuario no encontrado');
      }

      logger.info(`Autenticación exitosa para el usuario: ID ${req.user._id}, Email: ${req.user.email}.`);

      next();
      
    } catch (error) {
      logger.error(`Autenticación fallida: Error en la verificación del token. IP: ${req.ip}, Error: ${error.message}`, { stack: error.stack });
      res.status(401);
      throw new Error('No autorizado, token fallido');
    }
  }

  if (!token) {
    logger.warn(`Autenticación fallida: No se proporcionó ningún token. IP: ${req.ip}`);
    res.status(401);
    throw new Error('No autorizado, no hay token');
  }
});

module.exports = { protect };