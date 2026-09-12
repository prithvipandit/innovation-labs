import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const adminApi = axios.create({ baseURL: BACKEND_URL });

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let sessionExpiredNoticeShown = false;

adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname !== '/admin/login') {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_username');
      if (!sessionExpiredNoticeShown) {
        sessionExpiredNoticeShown = true;
        toast.error('Session expired. Please log in again.');
      }
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default adminApi;
