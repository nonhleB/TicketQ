// Placeholder data so dashboard layouts can be built and visually verified
// before Day 4 wires these lists up to real GET /api/tickets responses.
export const placeholderTickets = [
  {
    _id: 'placeholder-000001',
    title: "Laptop won't connect to VPN",
    description: 'VPN client fails with error 619 since this morning\'s update.',
    priority: 'High',
    status: 'Open',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    createdBy: { name: 'Alex Employee' },
  },
  {
    _id: 'placeholder-000002',
    title: 'Monitor flickering intermittently',
    description: 'Second monitor flickers every few minutes, especially under load.',
    priority: 'Medium',
    status: 'In Progress',
    createdAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
    createdBy: { name: 'Alex Employee' },
  },
  {
    _id: 'placeholder-000003',
    title: 'Request access to shared drive',
    description: 'Need read/write access to the Finance shared drive for Q3 reporting.',
    priority: 'Low',
    status: 'Resolved',
    createdAt: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString(),
    createdBy: { name: 'Sam Employee' },
  },
];
