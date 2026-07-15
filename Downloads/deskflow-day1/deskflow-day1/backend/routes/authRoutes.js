const express = require('express');

const router = express.Router();

// POST /api/auth/login
// TODO (Day 2): validate credentials, compare password hash, sign and return JWT.
router.post('/login', (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Not implemented yet — auth controller logic lands on Day 2.',
  });
});

module.exports = router;
