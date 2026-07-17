import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const STATUS_COLORS = {
  Open: '#2563EB',
  'In Progress': '#B45309',
  Resolved: '#16A34A',
};

const PRIORITY_COLORS = {
  Low: '#16A34A',
  Medium: '#B45309',
  High: '#DC2626',
};

// Formats a duration in milliseconds as a short human-readable string,
// e.g. 45 minutes -> "45m", 3.2 hours -> "3.2h", 30 hours -> "1d 6h".
function formatDuration(ms) {
  if (!Number.isFinite(ms) || ms < 0) return '—';

  const minutes = ms / (1000 * 60);
  if (minutes < 60) return `${Math.round(minutes)}m`;

  const hours = minutes / 60;
  if (hours < 24) return `${hours.toFixed(1)}h`;

  const days = Math.floor(hours / 24);
  const remainingHours = Math.round(hours % 24);
  return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
}

function useTicketStats(tickets) {
  return useMemo(() => {
    const byStatus = { Open: 0, 'In Progress': 0, Resolved: 0 };
    const byPriority = { Low: 0, Medium: 0, High: 0 };

    tickets.forEach((t) => {
      if (byStatus[t.status] !== undefined) byStatus[t.status] += 1;
      if (byPriority[t.priority] !== undefined) byPriority[t.priority] += 1;
    });

    const statusData = Object.entries(byStatus).map(([name, value]) => ({ name, value }));
    const priorityData = Object.entries(byPriority).map(([name, value]) => ({ name, value }));

    // Average resolution time: time between creation and last update for
    // tickets currently marked Resolved. This is an approximation — it
    // assumes the most recent update on a resolved ticket was the resolution
    // itself, which holds true given the app's current single-status-change workflow.
    const resolvedTickets = tickets.filter((t) => t.status === 'Resolved' && t.createdAt && t.updatedAt);
    const avgResolutionMs = resolvedTickets.length
      ? resolvedTickets.reduce((sum, t) => sum + (new Date(t.updatedAt) - new Date(t.createdAt)), 0) /
        resolvedTickets.length
      : null;

    return {
      total: tickets.length,
      byStatus,
      byPriority,
      statusData,
      priorityData,
      avgResolutionLabel: avgResolutionMs === null ? '—' : formatDuration(avgResolutionMs),
    };
  }, [tickets]);
}

export default function AnalyticsBar({ tickets }) {
  const stats = useTicketStats(tickets);

  return (
    <div className="analytics-bar">
      <div className="analytics-stats">
        <div className="analytics-stat">
          <span className="analytics-stat-value">{stats.total}</span>
          <span className="analytics-stat-label">Total tickets</span>
        </div>
        <div className="analytics-stat">
          <span className="analytics-stat-value" style={{ color: STATUS_COLORS.Open }}>
            {stats.byStatus.Open}
          </span>
          <span className="analytics-stat-label">Open</span>
        </div>
        <div className="analytics-stat">
          <span className="analytics-stat-value" style={{ color: STATUS_COLORS['In Progress'] }}>
            {stats.byStatus['In Progress']}
          </span>
          <span className="analytics-stat-label">In Progress</span>
        </div>
        <div className="analytics-stat">
          <span className="analytics-stat-value" style={{ color: STATUS_COLORS.Resolved }}>
            {stats.byStatus.Resolved}
          </span>
          <span className="analytics-stat-label">Resolved</span>
        </div>
        <div className="analytics-stat">
          <span className="analytics-stat-value">{stats.avgResolutionLabel}</span>
          <span className="analytics-stat-label">Avg. resolution time</span>
        </div>
      </div>

      {stats.total > 0 && (
        <div className="analytics-charts">
          <div className="analytics-chart-block">
            <ResponsiveContainer width="100%" height={92}>
              <PieChart>
                <Pie
                  data={stats.statusData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={22}
                  outerRadius={40}
                  paddingAngle={2}
                  isAnimationActive={false}
                >
                  {stats.statusData.map((entry) => (
                    <Cell key={entry.name} fill={STATUS_COLORS[entry.name]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [value, name]}
                  contentStyle={{ fontSize: 12, borderRadius: 6 }}
                />
              </PieChart>
            </ResponsiveContainer>
            <span className="analytics-chart-label">By status</span>
          </div>

          <div className="analytics-chart-block">
            <ResponsiveContainer width="100%" height={92}>
              <BarChart data={stats.priorityData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} width={24} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6 }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {stats.priorityData.map((entry) => (
                    <Cell key={entry.name} fill={PRIORITY_COLORS[entry.name]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <span className="analytics-chart-label">By priority</span>
          </div>
        </div>
      )}
    </div>
  );
}
