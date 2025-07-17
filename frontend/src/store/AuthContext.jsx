import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as apiLogin } from '../services/userService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('jwt_token'));
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      setUser({ id: decoded.user.id, email: decoded.user.email });
    }
    setIsLoading(false);
  }, [token]);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const data = await apiLogin(email, password);
      localStorage.setItem('jwt_token', data.token);
      setToken(data.token);

      const decoded = JSON.parse(atob(data.token.split('.')[1]));
      setUser({ id: decoded.user.id, email: decoded.user.email });

      toast.success('¡Inicio de sesión exitoso!');
      navigate('/');
      return true;
    } catch (err) {
      toast.error(err.message || 'Error al iniciar sesión.');
      setToken(null);
      setUser(null);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('jwt_token');
    setToken(null);
    setUser(null);
    toast.info('Sesión cerrada.');
    navigate('/login');
  };

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: !!token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};