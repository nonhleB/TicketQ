import React, { useState } from 'react';

const initialState = { title: '', description: '', priority: 'Medium' };

// TODO (Day 4): replace the simulated onSubmit behavior with a real
// POST /api/tickets call via axios, and surface real server-side errors.
export default function TicketForm({ onSubmit }) {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const nextErrors = {};
    if (!form.title.trim()) nextErrors.title = 'Title is required';
    else if (form.title.trim().length > 120) nextErrors.title = 'Keep the title under 120 characters';

    if (!form.description.trim()) nextErrors.description = 'Description is required';
    else if (form.description.trim().length > 2000) nextErrors.description = 'Keep the description under 2000 characters';

    return nextErrors;
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(false);

    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    // Simulated async submit so the loading state behaves like the real Day 4 version will.
    setTimeout(() => {
      onSubmit(form);
      setForm(initialState);
      setSubmitting(false);
      setSuccess(true);
    }, 300);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {success && <div className="form-banner-success">Ticket submitted (simulated — not yet saved to a server).</div>}

      <div className="form-field">
        <label className="form-label" htmlFor="title">Title</label>
        <input
          id="title"
          className="form-input"
          type="text"
          placeholder="e.g. Laptop won't connect to VPN"
          value={form.title}
          onChange={handleChange('title')}
          maxLength={120}
        />
        {errors.title && <div className="form-error">{errors.title}</div>}
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="description">Description</label>
        <textarea
          id="description"
          className="form-textarea"
          placeholder="Describe what's happening, when it started, and any error messages"
          value={form.description}
          onChange={handleChange('description')}
          maxLength={2000}
        />
        {errors.description && <div className="form-error">{errors.description}</div>}
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="priority">Priority</label>
        <select id="priority" className="form-select" value={form.priority} onChange={handleChange('priority')}>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <div className="form-hint">Choose High only for issues blocking your work entirely.</div>
      </div>

      <button type="submit" className="btn-primary" disabled={submitting}>
        {submitting ? 'Submitting…' : 'Submit ticket'}
      </button>
    </form>
  );
}
