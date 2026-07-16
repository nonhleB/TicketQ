import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <div className="navbar-brand-mark">D</div>
        <span className="navbar-brand-name">DeskFlow</span>
      </div>
      {user && (
        <div className="navbar-user">
          <span>{user.name}</span>
          <span className="navbar-role-chip">{user.role}</span>
          <button type="button" className="navbar-logout" onClick={logout}>
            Log out
          </button>
        </div>
      )}
    </header>
  );
}
