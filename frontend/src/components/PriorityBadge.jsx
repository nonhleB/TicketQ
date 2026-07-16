import React from 'react';

const CONFIG = {
  Low: { className: 'tag-priority-low', label: 'Low' },
  Medium: { className: 'tag-priority-medium', label: 'Medium' },
  High: { className: 'tag-priority-high', label: 'High' },
};

export default function PriorityBadge({ priority }) {
  const config = CONFIG[priority] || CONFIG.Low;
  return (
    <span className={`tag ${config.className}`}>
      <span className="tag-dot" />
      {config.label} priority
    </span>
  );
}
