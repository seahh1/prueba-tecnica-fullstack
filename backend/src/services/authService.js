const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Credenciales inválidas');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Credenciales inválidas');
  }

  const accessTokenPayload = { user: { id: user.id } };
  const accessToken = jwt.sign(accessTokenPayload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '15m',
  });
  
  const refreshTokenPayload = { user: { id: user.id } };
  const refreshToken = jwt.sign(refreshTokenPayload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRE || '7d',
  });

  return { accessToken, refreshToken };
};

const refreshAccessToken = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    
    const accessTokenPayload = { user: { id: decoded.user.id } };
    const newAccessToken = jwt.sign(accessTokenPayload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE || '15m',
    });
    
    return newAccessToken;
  } catch (error) {
    throw new Error('Refresh token inválido o expirado.');
  }
};

module.exports = {
  loginUser,
  refreshAccessToken,
  };