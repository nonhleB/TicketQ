import React, { useCallback, useEffect, useState } from 'react';
import apiClient from '../api/client';
import TicketForm from './TicketForm.jsx';
import TicketList from './TicketList.jsx';

// Day 4: fetches real tickets from GET /api/tickets on mount, and posts new
// tickets to POST /api/tickets, then refetches to reflect the server's state.
export default function EmployeeDashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setFetchError('');
    try {
      const { data } = await apiClient.get('/tickets');
      setTickets(data.data);
    } catch (err) {
      setFetchError(err?.response?.data?.message || 'Could not load your tickets.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleCreate = async (form) => {
    await apiClient.post('/tickets', form);
    await fetchTickets();
  };

  return (
    <div className="main-content">
      <div className="page-header">
        <h1 className="page-title">My tickets</h1>
        <p className="page-subtitle">Submit a new IT request and track its resolution status.</p>
      </div>

      <div className="dashboard-grid">
        <div className="panel">
          <h2 className="panel-title">New ticket</h2>
          <TicketForm onSubmit={handleCreate} />
        </div>

        <div className="panel">
          <h2 className="panel-title">Submitted requests</h2>
          {fetchError && <div className="form-banner-error">{fetchError}</div>}
          <TicketList tickets={tickets} loading={loading} isAdmin={false} />
        </div>
      </div>
    </div>
  );
}
