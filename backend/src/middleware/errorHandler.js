const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Datos de entrada inválidos. ${errors.join('. ')}`;
    return res.status(400).json({ success: false, message });
  }

  res.status(500).json({
    success: false,
    message: 'Ha ocurrido un error en el servidor.',
  });
};

module.exports = errorHandler;