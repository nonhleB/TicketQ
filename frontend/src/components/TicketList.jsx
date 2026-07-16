import React from 'react';
import TicketCard from './TicketCard.jsx';
import EmptyState from './EmptyState.jsx';

export default function TicketList({ tickets, loading, isAdmin, onStatusChange }) {
  if (loading) {
    return <div className="loading-state">Loading tickets…</div>;
  }

  if (!tickets.length) {
    return (
      <EmptyState
        title="No tickets yet"
        description={
          isAdmin
            ? 'Nothing has been submitted across the organization yet.'
            : 'Submit your first IT request using the form to get started.'
        }
      />
    );
  }

  return (
    <div className="ticket-list">
      {tickets.map((ticket) => (
        <TicketCard
          key={ticket._id}
          ticket={ticket}
          isAdmin={isAdmin}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
}
