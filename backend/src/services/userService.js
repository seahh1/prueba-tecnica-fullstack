const User = require('../models/userModel');

const createUser = async (userData) => {
  const user = await User.create(userData);
  return user;
};

const getAllUsers = async (queryOptions) => {
  const{page = 1, limit = 10,  search = '', sort = '-createdAt' } = queryOptions;
  const qery = {};
  if(search){qery.$or = [
    { name: { $regex: search, $options: 'i' } },
    { email: { $regex: search, $options: 'i' } },
    ]}

  const skip = (page - 1) * limit;

  const users = await User.find(qery)
  .sort(sort)
  .skip(skip)
  .limit(limit)
  .select('-password');

  const totalUsers = await User.countDocuments(qery);
  return {
    users,
    totalPages: Math.ceil(totalUsers / limit),
    currentPage: page,
    totalUsers,
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