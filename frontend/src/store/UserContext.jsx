import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import * as userService from '../services/userService';
import { toast } from 'react-toastify';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1 });
  const [searchTerm, setSearchTerm] = useState('');
  const [permissionFilter, setPermissionFilter] = useState('');

  const fetchUsers = useCallback(async (page = 1, limit = 10, search = '', permission = '') => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await userService.getAllUsers(page, limit, search, permission);
      setUsers(data.users);
      setPagination({ page: data.currentPage, limit, totalPages: data.totalPages });
    } catch (err) {
      setError(err);
      console.error('Error fetching users:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers(pagination.page, pagination.limit, searchTerm, permissionFilter);
  }, [fetchUsers, pagination.page, pagination.limit, searchTerm, permissionFilter]);


  const createUser = async (userData) => {
    try {
      await userService.createUser(userData);
      toast.success('Usuario creado exitosamente!');
      fetchUsers(pagination.page, pagination.limit, searchTerm, permissionFilter);
    } catch (err) {
      console.error('Error creating user:', err);
      throw err;
    }
  };

  const updateUser = async (id, updateData) => {
    try {
      await userService.updateUser(id, updateData);
      toast.success('Usuario actualizado exitosamente!');
      fetchUsers(pagination.page, pagination.limit, searchTerm, permissionFilter);
    } catch (err) {
      console.error('Error updating user:', err);
      throw err;
    }
  };

  const deleteUser = async (id) => {
    try {
      await userService.deleteUser(id);
      toast.success('Usuario eliminado exitosamente!');
      fetchUsers(pagination.page, pagination.limit, searchTerm, permissionFilter); 
    } catch (err) {
      console.error('Error deleting user:', err);
      throw err;
    }
  };

  const value = {
    users,
    isLoading,
    error,
    pagination,
    searchTerm,
    permissionFilter,
    setPagination,
    setSearchTerm,
    setPermissionFilter,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUsers = () => {
  return useContext(UserContext);
};