const User = require('../models/userModel');

const createUser = async (userData) => {
  const user = await User.create(userData);
  return user;
};

const getAllUsers = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const users = await User.find({}).select('-password').skip(skip).limit(limit);
  const totalUsers = await User.countDocuments();
  return {
    users,
    totalPages: Math.ceil(totalUsers / limit),
    currentPage: page,
  };
};

const getUserById = async (userId) => {
  const user = await User.findById(userId).select('-password');
  return user;
};

const updateUserById = async (userId, updateData) => {
  const user = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  }).select('-password');
  return user;
};

const deleteUserById = async (userId) => {
  await User.findByIdAndDelete(userId);
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};