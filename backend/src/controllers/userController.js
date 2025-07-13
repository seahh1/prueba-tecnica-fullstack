const userService = require('../services/userService');

const createNewUser = async (req, res) => {
  const { name, email, password } = req.body;

  const newUser = await userService.createUser({ name, email, password });

  res.status(201).json({
    success: true,
    message: 'Usuario creado exitosamente.',
    userId: newUser._id
  });
};

module.exports = {
  createNewUser,
};