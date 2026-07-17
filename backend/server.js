require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

connectDB();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*' }));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'DeskFlow API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`DeskFlow API listening on port ${PORT}`);
});

// Safety nets: log unexpected errors instead of letting the process die
// silently, and shut down cleanly on process signals (e.g. Ctrl+C, deploy restarts).
process.on('unhandledRejection', (err) => {
  console.error('Unhandled promise rejection:', err);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => process.exit(0));
});

module.exports = app;
