const authService = require('../services/authService');
const asyncHandler = require('../utils/asyncHandler');
const logger = require('../config/logger');

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    logger.warn(`Intento de login fallido: Faltan credenciales. IP: ${req.ip}`);
    res.status(400);
    throw new Error('Por favor, proporcione email y contraseña');
  }

  const { accessToken, refreshToken } = await authService.loginUser(email, password);
  logger.info(`Usuario logueado exitosamente: ${email}.`);
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production', 
    maxAge: 7 * 24 * 60 * 60 * 1000, 
  });

  res.status(200).json({
    success: true,
    accessToken,
  });
});


const refresh = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    logger.warn(`Intento de refresco de token fallido: No se proporcionó refresh token. IP: ${req.ip}`);
    res.status(401);
    throw new Error('No se proporcionó un refresh token.');
  }
  
  const newAccessToken = await authService.refreshAccessToken(refreshToken);
  logger.info(`Refresh token exitoso. Nuevo access token emitido.`);
  res.json({ success: true, accessToken: newAccessToken });
});

module.exports = {
  login,
  refresh,
};