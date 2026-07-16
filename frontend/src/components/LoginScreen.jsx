import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

// TODO (Day 4): replace this simulated login with a real form (email + password)
// that POSTs to /api/auth/login via axios and handles real server errors.
export default function LoginScreen() {
  const { login } = useAuth();
  const [role, setRole] = useState('Employee');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(role);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-brand">
          <div className="navbar-brand-mark">D</div>
          <span className="navbar-brand-name">DeskFlow</span>
        </div>
        <h1 className="login-title">Sign in</h1>
        <p className="login-subtitle">Choose a role to preview its dashboard.</p>

        <div className="role-toggle">
          <button
            type="button"
            className={`role-toggle-btn ${role === 'Employee' ? 'active' : ''}`}
            onClick={() => setRole('Employee')}
          >
            Employee
          </button>
          <button
            type="button"
            className={`role-toggle-btn ${role === 'Admin' ? 'active' : ''}`}
            onClick={() => setRole('Admin')}
          >
            Admin
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Signing in…' : `Sign in as ${role}`}
          </button>
        </form>

        <div className="login-hint-box">
          This is a simulated login for Day 3 — role toggle only, no real credentials yet.
          Real email/password auth against the API lands on Day 4.
        </div>
      </div>
    </div>
  );
}
