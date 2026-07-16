import React from 'react';
import { useAuth } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import LoginScreen from './components/LoginScreen.jsx';
import EmployeeDashboard from './components/EmployeeDashboard.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';

export default function App() {
  const { user, initializing } = useAuth();

  if (initializing) {
    return <div className="loading-state">Loading DeskFlow…</div>;
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <div className="app-shell">
      <Navbar />
      {user.role === 'Admin' ? <AdminDashboard /> : <EmployeeDashboard />}
    </div>
  );
}
