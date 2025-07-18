const logger = require('../config/logger');

const errorHandler = (err, req, res, next) => {

  let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message || 'Ha ocurrido un error en el servidor.';


  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Recurso no encontrado';
  }


  else if (err.name === 'ValidationError') {
      statusCode = 400;
          if (err.details && err.details.length > 0) { 
       const errors = err.details.map((detail) => detail.message);
       message = `Datos de entrada inválidos: ${errors.join('; ')}.`;
    } else if (err.errors) { 
        const errors = Object.values(err.errors).map(el => el.message);
        message = `Datos de entrada inválidos: ${errors.join('. ')}.`;
    }
  }

  else if (err.code === 11000) {
      statusCode = 400;
      const field = Object.keys(err.keyValue).join(', ');
      message = `El campo ${field} ya existe.`;
  }
  

  logger.error(`Error en la ruta ${req.method} ${req.originalUrl}: ${err.message}`, {
    stack: err.stack,
    body: req.body,
    query: req.query,
    params: req.params,
    ip: req.ip,
    statusCode: res.statusCode || 500,
  });

    res.status(statusCode).json({
        success: false,
        message: message,
    });
};

module.exports = errorHandler;
