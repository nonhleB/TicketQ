import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

const DEMO_CREDENTIALS = {
  Employee: { email: 'employee@deskflow.com', password: 'password123' },
  Admin: { email: 'admin@deskflow.com', password: 'password123' },
};

// Day 4: real login form — posts to /api/auth/login through AuthContext,
// and surfaces actual server-side errors instead of always succeeding.
export default function LoginScreen() {
  const { login } = useAuth();
  const [role, setRole] = useState('Employee');
  const [email, setEmail] = useState(DEMO_CREDENTIALS.Employee.email);
  const [password, setPassword] = useState(DEMO_CREDENTIALS.Employee.password);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleRoleToggle = (nextRole) => {
    setRole(nextRole);
    setEmail(DEMO_CREDENTIALS[nextRole].email);
    setPassword(DEMO_CREDENTIALS[nextRole].password);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed. Check your credentials and that the API is running.');
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
            onClick={() => handleRoleToggle('Employee')}
          >
            Employee
          </button>
          <button
            type="button"
            className={`role-toggle-btn ${role === 'Admin' ? 'active' : ''}`}
            onClick={() => handleRoleToggle('Admin')}
          >
            Admin
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {error && <div className="form-banner-error">{error}</div>}

          <div className="form-field">
            <label className="form-label" htmlFor="email">Email</label>
            <input
              id="email"
              className="form-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              className="form-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Signing in…' : `Sign in as ${role}`}
          </button>
        </form>

        <div className="login-hint-box">
          Demo accounts (seeded via `npm run seed` on the backend):<br />
          employee@deskflow.com / password123<br />
          admin@deskflow.com / password123
        </div>
      </div>
    </div>
  );
}
