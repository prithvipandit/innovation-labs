import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '@/lib/api';
import * as auth from '@/lib/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => ({
    token: auth.getToken(),
    refreshToken: auth.getRefreshToken(),
    username: auth.getUsername(),
  }));

  const login = useCallback(({ token, refreshToken, username }) => {
    auth.setSession({ token, refreshToken, username });
    setSession({ token, refreshToken, username });
  }, []);

  const logout = useCallback(() => {
    auth.clearSession();
    setSession({ token: null, refreshToken: null, username: null });
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
      login,
      logout,
      refreshAccessToken,
    }),
    [session, login, logout, refreshAccessToken]
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
