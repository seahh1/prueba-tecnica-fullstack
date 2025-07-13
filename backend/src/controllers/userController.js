const userService = require('../services/userService');
const asyncHandler = require('../utils/asyncHandler');

const createNewUser = async (req, res) => {
  const { name, email, password } = req.body;

  const newUser = await userService.createUser({ name, email, password });

  res.status(201).json({
    success: true,
    message: 'Usuario creado exitosamente.',
    userId: newUser._id
  });
};

const getUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const result = await userService.getAllUsers(page, limit);
  res.status(200).json({ success: true, ...result });
});

const getUser = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('Usuario no encontrado');
  }
  res.status(200).json({ success: true, data: user });
});

const updateUser = asyncHandler(async (req, res) => {
  const updatedUser = await userService.updateUserById(req.params.id, req.body);
  if (!updatedUser) {
    res.status(404);
    throw new Error('Usuario no encontrado');
  }
  res.status(200).json({ success: true, data: updatedUser });
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('Usuario no encontrado');
  }
  await userService.deleteUserById(req.params.id);
  res.status(200).json({ success: true, message: 'Usuario eliminado' });
});

module.exports = {
  createNewUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};