// Seeds two demo accounts so the login endpoint has something real to test against.
// Run with: npm run seed
require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User');

const demoUsers = [
  {
    name: 'Alex Employee',
    email: 'employee@deskflow.com',
    password: 'password123',
    role: 'Employee',
  },
  {
    name: 'Jordan Admin',
    email: 'admin@deskflow.com',
    password: 'password123',
    role: 'Admin',
  },
];

async function seed() {
  await connectDB();

  for (const demo of demoUsers) {
    const existing = await User.findOne({ email: demo.email });
    if (existing) {
      console.log(`Skipping (already exists): ${demo.email}`);
      continue;
    }
    await User.create(demo);
    console.log(`Created ${demo.role}: ${demo.email} / ${demo.password}`);
  }

  console.log('Seeding complete.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
