import axios from 'axios';
import config from '../config/config';

const api = axios.create({
  baseURL: config.api,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isAuthEndpoint = error.config?.url?.startsWith('/auth/');
      if (!isAuthEndpoint) {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
