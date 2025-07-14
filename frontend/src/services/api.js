import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, 
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token'); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          toast.error(data.message || 'Sesión expirada o no autorizada. Por favor, inicia sesión de nuevo.');
          localStorage.removeItem('jwt_token');
          break;
        case 404:
          toast.error(data.message || 'Recurso no encontrado.');
          break;
        case 400:
          toast.error(data.message || 'Solicitud inválida. Verifica los datos.');
          break;
        case 500:
          toast.error(data.message || 'Error interno del servidor. Inténtalo de nuevo más tarde.');
          break;
        default:
          toast.error(data.message || `Ocurrió un error inesperado: ${status}`);
      }
    } else if (error.request) {
      toast.error('No se pudo conectar al servidor. Verifica tu conexión o el estado del backend.');
    } else {
      toast.error('Error al configurar la petición: ' + error.message);
    }
    return Promise.reject(error);
  }
);

export default api;