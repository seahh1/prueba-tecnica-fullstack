const authService = require('../services/authService');
const asyncHandler = require('../utils/asyncHandler');

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Por favor, proporcione email y contraseña');
  }

  const { accessToken, refreshToken } = await authService.loginUser(email, password);
  
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
    res.status(401);
    throw new Error('No se proporcionó un refresh token.');
  }
  
  const newAccessToken = await authService.refreshAccessToken(refreshToken);
  
  res.json({ success: true, accessToken: newAccessToken });
});

module.exports = {
  login,
  refresh,
};