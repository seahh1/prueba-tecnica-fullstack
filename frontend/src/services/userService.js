import api from './api';

const getAllUsers = async (page = 1, limit = 10, searchTerm = '', permissionFilter = '') => {
  const response = await api.get('/users', {
    params: {
      page,
      limit,
      search: searchTerm, 
      permission: permissionFilter,
    },
  });
  return response.data;
};

const createUser = async (userData) => {
  const response = await api.post('/users', userData);
  return response.data;
};

const updateUser = async (id, updateData) => {
  const response = await api.put(`/users/${id}`, updateData);
  return response.data;
};

const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  login,
};