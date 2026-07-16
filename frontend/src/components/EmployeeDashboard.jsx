import React, { useState } from 'react';
import TicketForm from './TicketForm.jsx';
import TicketList from './TicketList.jsx';
import { placeholderTickets } from '../data/placeholderTickets';

// TODO (Day 4): fetch real tickets from GET /api/tickets on mount instead of
// seeding from placeholderTickets, and POST new tickets to the API in handleCreate.
export default function EmployeeDashboard() {
  const [tickets, setTickets] = useState(placeholderTickets);

  const handleCreate = (form) => {
    const newTicket = {
      _id: `local-${Date.now()}`,
      title: form.title,
      description: form.description,
      priority: form.priority,
      status: 'Open',
      createdAt: new Date().toISOString(),
      createdBy: { name: 'Alex Employee' },
    };
    setTickets((prev) => [newTicket, ...prev]);
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
          <TicketList tickets={tickets} loading={false} isAdmin={false} />
        </div>
      </div>
    </div>
  );
}
