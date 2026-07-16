import React, { useCallback, useEffect, useState } from 'react';
import apiClient from '../api/client';
import TicketList from './TicketList.jsx';

const FILTERS = ['All', 'Open', 'In Progress', 'Resolved'];

// Day 4: fetches all tickets from GET /api/tickets, and calls
// PUT /api/tickets/:id to persist status changes to the server.
export default function AdminDashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [filter, setFilter] = useState('All');

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setFetchError('');
    try {
      const { data } = await apiClient.get('/tickets');
      setTickets(data.data);
    } catch (err) {
      setFetchError(err?.response?.data?.message || 'Could not load company tickets.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleStatusChange = async (ticketId, status) => {
    const { data } = await apiClient.put(`/tickets/${ticketId}`, { status });
    setTickets((prev) => prev.map((t) => (t._id === ticketId ? data.data : t)));
  };

  const visibleTickets = filter === 'All' ? tickets : tickets.filter((t) => t.status === filter);

  return (
    <div className="main-content">
      <div className="page-header">
        <h1 className="page-title">All company tickets</h1>
        <p className="page-subtitle">Review incoming requests and update their status as work progresses.</p>
      </div>

      <div className="panel">
        <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`role-toggle-btn ${filter === f ? 'active' : ''}`}
              style={{ width: 'auto', padding: '7px 14px' }}
            >
              {f}
            </button>
          ))}
        </div>

        {fetchError && <div className="form-banner-error">{fetchError}</div>}
        <TicketList
          tickets={visibleTickets}
          loading={loading}
          isAdmin
          onStatusChange={handleStatusChange}
        />
      </div>
    </div>
  );
}
