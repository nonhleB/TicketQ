const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All ticket routes require a valid token — auth middleware is already wired up
// so Day 2 controller logic can plug straight in.
router.use(protect);

// POST /api/tickets           -> Employee creates a ticket
// GET  /api/tickets           -> Employee: own tickets | Admin: all tickets
router
  .route('/')
  .post((req, res) => {
    res.status(501).json({
      success: false,
      message: 'Not implemented yet — ticket creation logic lands on Day 2.',
    });
  })
  .get((req, res) => {
    res.status(501).json({
      success: false,
      message: 'Not implemented yet — ticket retrieval logic lands on Day 2.',
    });
  });

// GET /api/tickets/:id        -> fetch a single ticket (owner or Admin)
// PUT /api/tickets/:id        -> Admin updates ticket status
router
  .route('/:id')
  .get((req, res) => {
    res.status(501).json({
      success: false,
      message: 'Not implemented yet — ticket lookup logic lands on Day 2.',
    });
  })
  .put((req, res) => {
    res.status(501).json({
      success: false,
      message: 'Not implemented yet — status update logic lands on Day 2.',
    });
  });

module.exports = router;
