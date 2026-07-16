import React, { useState } from 'react';
import PriorityBadge from './PriorityBadge.jsx';
import StatusBadge from './StatusBadge.jsx';

const STATUS_OPTIONS = ['Open', 'In Progress', 'Resolved'];

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function shortId(id) {
  return `#${id.slice(-6).toUpperCase()}`;
}

export default function TicketCard({ ticket, isAdmin, onStatusChange }) {
  const [updating, setUpdating] = useState(false);

  const handleChange = async (e) => {
    const nextStatus = e.target.value;
    setUpdating(true);
    try {
      await onStatusChange(ticket._id, nextStatus);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="ticket-stub">
      <div className="ticket-stub-main">
        <div className="ticket-stub-id">{shortId(ticket._id)} &middot; {formatDate(ticket.createdAt)}</div>
        <h3 className="ticket-stub-title">{ticket.title}</h3>
        <p className="ticket-stub-desc">{ticket.description}</p>
        <div className="ticket-stub-tags">
          <PriorityBadge priority={ticket.priority} />
          <StatusBadge status={ticket.status} />
        </div>
        {isAdmin && ticket.createdBy && (
          <div className="ticket-stub-meta" style={{ marginTop: 10 }}>
            Submitted by {ticket.createdBy.name || 'Unknown employee'}
          </div>
        )}
      </div>

      <div className="ticket-stub-divider" />

      <div className="ticket-stub-side">
        {isAdmin ? (
          <>
            <span className="ticket-stub-side-label">Update status</span>
            <select
              className="form-select"
              value={ticket.status}
              onChange={handleChange}
              disabled={updating}
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </>
        ) : (
          <>
            <span className="ticket-stub-side-label">Current status</span>
            <StatusBadge status={ticket.status} />
          </>
        )}
      </div>
    </div>
  );
}
