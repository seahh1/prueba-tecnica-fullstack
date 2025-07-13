const User = require('../models/userModel');


const createUser = async (userData) => {
  const user = await User.create(userData);
  return user;
};

module.exports = {
  createUser,
};