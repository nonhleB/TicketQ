const express = require('express');
const { body } = require('express-validator');
const {
  createTicket,
  getTickets,
  getTicketById,
  updateTicketStatus,
} = require('../controllers/ticketController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All ticket routes require a valid token
router.use(protect);

router
  .route('/')
  .get(getTickets)
  .post(
    authorize('Employee'),
    [
      body('title').trim().notEmpty().withMessage('Title is required'),
      body('description').trim().notEmpty().withMessage('Description is required'),
      body('priority')
        .isIn(['Low', 'Medium', 'High'])
        .withMessage('Priority must be Low, Medium, or High'),
    ],
    createTicket
  );

router
  .route('/:id')
  .get(getTicketById)
  .put(
    authorize('Admin'),
    [
      body('status')
        .isIn(['Open', 'In Progress', 'Resolved'])
        .withMessage('Status must be Open, In Progress, or Resolved'),
    ],
    updateTicketStatus
  );

module.exports = router;
