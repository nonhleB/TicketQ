const jwt = require('jsonwebtoken');
const ApiError = require('./ApiError');
const asyncHandler = require('./asyncHandler');
const User = require('../models/User');

// Verifies the Bearer token and attaches the authenticated user to req.user
const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(401, 'Not authorized. No token provided.');
  }

  const token = authHeader.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.id);
  if (!user) {
    throw new ApiError(401, 'Not authorized. User no longer exists.');
  }

  req.user = user;
  next();
});

// Restricts a route to the given role(s), e.g. authorize('Admin')
const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    throw new ApiError(403, `Role '${req.user ? req.user.role : 'unknown'}' is not permitted to perform this action`);
  }
  next();
};

module.exports = { protect, authorize };
