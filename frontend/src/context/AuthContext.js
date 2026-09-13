import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import axios from 'axios';
import { api, BACKEND_URL } from '@/lib/api';
import * as auth from '@/lib/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => ({
    token: auth.getToken(),
    refreshToken: auth.getRefreshToken(),
    username: auth.getUsername(),
    user: auth.getUser(),
  }));

  const fetchProfile = useCallback(async () => {
    try {
      const { data } = await api.get('/api/users/me');
      auth.setUser(data);
      setSession((prev) => ({ ...prev, user: data }));
      return data;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    if (session.token && !session.user) {
      fetchProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.token]);

  const login = useCallback(({ token, refreshToken, username }) => {
    auth.setSession({ token, refreshToken, username });
    setSession({ token, refreshToken, username, user: null });
  }, []);

  const logout = useCallback(() => {
    auth.clearSession();
    setSession({ token: null, refreshToken: null, username: null, user: null });
  }, []);

  const refreshAccessToken = useCallback(async () => {
    const refreshToken = auth.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    // Plain axios — must go out with the refresh token only, not a stale access token.
    const { data } = await axios.post(`${BACKEND_URL}/refresh-token`, { refreshToken });
    const nextRefreshToken = data.refreshToken || refreshToken;
    auth.setTokens({ token: data.token, refreshToken: nextRefreshToken });
    setSession((prev) => ({ ...prev, token: data.token, refreshToken: nextRefreshToken }));
    return data.token;
  }, []);

  const value = useMemo(
    () => ({
      ...session,
      isAuthenticated: Boolean(session.token),
      role: session.user?.role || null,
      isAdmin: session.user?.role === 'ADMIN',
      login,
      logout,
      refreshAccessToken,
      fetchProfile,
    }),
    [session, login, logout, refreshAccessToken, fetchProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
