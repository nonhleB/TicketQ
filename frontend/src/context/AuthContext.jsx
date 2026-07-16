import React, { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

// Day 3 scope: simulate authentication locally so the role-based UI can be
// built and tested end-to-end before the real API call is wired up on Day 4.
const MOCK_USERS = {
  Employee: { id: 'mock-employee-id', name: 'Alex Employee', email: 'employee@deskflow.com', role: 'Employee' },
  Admin: { id: 'mock-admin-id', name: 'Jordan Admin', email: 'admin@deskflow.com', role: 'Admin' },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // TODO (Day 4): replace this with a real POST /api/auth/login call via axios,
  // store the returned JWT, and set user from the response instead of MOCK_USERS.
  const login = useCallback((role) => {
    const mockUser = MOCK_USERS[role] || MOCK_USERS.Employee;
    setUser(mockUser);
    return Promise.resolve(mockUser);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, initializing: false }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
