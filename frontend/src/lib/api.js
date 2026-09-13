import axios from 'axios';
import { toast } from 'sonner';
import { getToken, getRefreshToken, setTokens, clearSession } from '@/lib/auth';

export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// Routes that must never be retried with a refreshed token — hitting them
// unauthenticated (or during the refresh call itself) is expected, not a 401 to recover from.
const AUTH_ROUTES = ['/login', '/register', '/verify-registration-otp', '/forgot-password', '/reset-password', '/refresh-token'];
const isAuthRoute = (url = '') => AUTH_ROUTES.some((path) => url.includes(path));

export const api = axios.create({ baseURL: BACKEND_URL });

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let pendingQueue = [];

const resolveQueue = (error, token = null) => {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  pendingQueue = [];
};

let sessionExpiredNoticeShown = false;

const redirectToLogin = () => {
  clearSession();
  if (!sessionExpiredNoticeShown) {
    sessionExpiredNoticeShown = true;
    toast.error('Session expired. Please log in again.');
  }
  const loginPath = window.location.pathname.startsWith('/admin') ? '/admin/login' : '/login';
  window.location.href = loginPath;
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;

    if (response?.status !== 401 || !config || config._retry || isAuthRoute(config.url || '')) {
      return Promise.reject(error);
    }

    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      if (window.location.pathname !== '/admin/login' && window.location.pathname !== '/login') {
        redirectToLogin();
      }
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push({ resolve, reject });
      }).then((newToken) => {
        config.headers.Authorization = `Bearer ${newToken}`;
        config._retry = true;
        return api(config);
      });
    }

    config._retry = true;
    isRefreshing = true;

    try {
      // Plain axios, not the api instance — this call must go out with the
      // refresh token only, never a stale (possibly expired) access token.
      const { data } = await axios.post(`${BACKEND_URL}/refresh-token`, { refreshToken });
      setTokens({ token: data.token, refreshToken: data.refreshToken || refreshToken });
      resolveQueue(null, data.token);
      config.headers.Authorization = `Bearer ${data.token}`;
      return api(config);
    } catch (refreshError) {
      resolveQueue(refreshError, null);
      redirectToLogin();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
