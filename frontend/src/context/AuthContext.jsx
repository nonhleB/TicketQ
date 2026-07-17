import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import apiClient from '../api/client';

const AuthContext = createContext(null);

const TOKEN_KEY = 'deskflow_token';
const USER_KEY = 'deskflow_user';

// Day 4: real authentication — POST /api/auth/login via axios, persist the JWT,
// and attach it to every subsequent request through the api client's interceptor.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem(USER_KEY);
    const storedToken = localStorage.getItem(TOKEN_KEY);
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setInitializing(false);
  }, []);

  // If any API call comes back 401 (expired/invalid token), the api client
  // clears storage and fires this event — react to it by clearing local state too.
  useEffect(() => {
    const handleUnauthorized = () => setUser(null);
    window.addEventListener('deskflow:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('deskflow:unauthorized', handleUnauthorized);
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await apiClient.post('/auth/login', { email, password });
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, initializing }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
