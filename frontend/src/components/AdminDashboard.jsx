import React, { useState } from 'react';
import TicketList from './TicketList.jsx';
import { placeholderTickets } from '../data/placeholderTickets';

const FILTERS = ['All', 'Open', 'In Progress', 'Resolved'];

// TODO (Day 4): fetch real tickets from GET /api/tickets on mount, and call
// PUT /api/tickets/:id in handleStatusChange instead of updating local state only.
export default function AdminDashboard() {
  const [tickets, setTickets] = useState(placeholderTickets);
  const [filter, setFilter] = useState('All');

  const handleStatusChange = (ticketId, status) => {
    setTickets((prev) => prev.map((t) => (t._id === ticketId ? { ...t, status } : t)));
    return Promise.resolve();
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

        <TicketList
          tickets={visibleTickets}
          loading={false}
          isAdmin
          onStatusChange={handleStatusChange}
        />
      </div>
    </div>
  );
}
