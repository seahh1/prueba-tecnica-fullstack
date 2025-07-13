const authService = require('../services/authService');
const asyncHandler = require('../utils/asyncHandler');

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Por favor, proporcione email y contraseña');
  }

  const token = await authService.loginUser(email, password);

  res.status(200).json({
    success: true,
    token,
  });
});

module.exports = {
  login,
};