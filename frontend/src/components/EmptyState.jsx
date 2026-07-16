import React from 'react';

export default function EmptyState({ title, description }) {
  return (
    <div className="empty-state">
      <div className="empty-state-title">{title}</div>
      <p style={{ margin: 0, fontSize: 13.5 }}>{description}</p>
    </div>
  );
}
