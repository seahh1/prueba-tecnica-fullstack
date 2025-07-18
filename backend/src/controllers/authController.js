const authService = require('../services/authService');
const asyncHandler = require('../utils/asyncHandler');

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Por favor, proporcione email y contraseña');
  }

  const { accessToken, refreshToken } = await authService.loginUser(email, password);
  
  // Enviar el refresh token en una cookie segura
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true, // El navegador no puede acceder a la cookie vía JavaScript
    secure: process.env.NODE_ENV === 'production', // Solo enviar por HTTPS en producción
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días en milisegundos
    // sameSite: 'strict' // Opcional, para protección CSRF
  });

  res.status(200).json({
    success: true,
    accessToken,
  });
});

/**
 * Controlador para refrescar el access token.
 */
const refresh = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.cookies; // Obtiene el token de la cookie

  if (!refreshToken) {
    res.status(401);
    throw new Error('No se proporcionó un refresh token.');
  }
  
  const newAccessToken = await authService.refreshAccessToken(refreshToken);
  
  res.json({ success: true, accessToken: newAccessToken });
});

// Añadir a las exportaciones
module.exports = {
  login,
  refresh,
};