import React from 'react';

const CONFIG = {
  Open: { className: 'tag-status-open', label: 'Open' },
  'In Progress': { className: 'tag-status-progress', label: 'In Progress' },
  Resolved: { className: 'tag-status-resolved', label: 'Resolved' },
};

export default function StatusBadge({ status }) {
  const config = CONFIG[status] || CONFIG.Open;
  return (
    <span className={`tag ${config.className}`}>
      <span className="tag-dot" />
      {config.label}
    </span>
  );
}
