const userService = require('../services/userService');
const asyncHandler = require('../utils/asyncHandler');
const logger = require('../config/logger');


const createNewUser = async (req, res) => {
  const { name, email, password, permisos, estatus } = req.body;

  const newUser = await userService.createUser({ 
    name,
    email,
    password,
    permisos,
    estatus, 
  });

  logger.info(`Usuario creado exitosamente: ID ${newUser._id}, Email: ${email}.`);
  res.status(201).json({
    success: true,
    message: 'Usuario creado exitosamente.',
    userId: newUser._id
  });
};

const getUsers = asyncHandler(async (req, res) => {
  const queryOptions = {
    page: parseInt(req.query.page, 10),
    limit: parseInt(req.query.limit, 10),
    search: req.query.search,
    sort: req.query.sort,
  };

  const result = await userService.getAllUsers(queryOptions);
  logger.debug(`Usuarios recuperados. Página: ${queryOptions.page}, Límite: ${queryOptions.limit}, Total: ${result.totalCount}.`);
  res.status(200).json({ success: true, ...result });
})


const getUser = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  if (!user) {
    logger.warn(`Intento de acceso a usuario no encontrado: ID ${req.params.id}. IP: ${req.ip}`);
    res.status(404);
    throw new Error('Usuario no encontrado');
  }
  logger.info(`Usuario recuperado exitosamente: ID ${req.params.id}.`);
  res.status(200).json({ success: true, data: user });
});


const updateUser = asyncHandler(async (req, res) => {
  const updatedUser = await userService.updateUserById(req.params.id, req.body);
  if (!updatedUser) {
    logger.warn(`Intento de actualización de usuario no encontrado: ID ${req.params.id}. IP: ${req.ip}`);
    res.status(404);
    throw new Error('Usuario no encontrado');
  }
  logger.info(`Usuario actualizado exitosamente: ID ${req.params.id}.`);
  res.status(200).json({ success: true, data: updatedUser });
});


const deleteUser = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  if (!user) {
    logger.warn(`Intento de eliminación de usuario no encontrado: ID ${req.params.id}. IP: ${req.ip}`);
    res.status(404);
    throw new Error('Usuario no encontrado');
  }
  await userService.deleteUserById(req.params.id);
  logger.info(`Usuario eliminado exitosamente: ID ${req.params.id}, Email: ${user.email}.`);
  res.status(200).json({ success: true, message: 'Usuario eliminado' });
});

module.exports = {
  createNewUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};