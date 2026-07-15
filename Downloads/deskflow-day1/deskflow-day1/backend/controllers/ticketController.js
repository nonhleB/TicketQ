const { validationResult } = require('express-validator');
const ApiError = require('../middleware/ApiError');
const asyncHandler = require('../middleware/asyncHandler');
const Ticket = require('../models/Ticket');

// @route  POST /api/tickets
// @access Employee
const createTicket = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(400, errors.array().map((e) => e.msg).join(', '));
  }

  const { title, description, priority } = req.body;

  const ticket = await Ticket.create({
    title,
    description,
    priority,
    createdBy: req.user._id,
  });

  res.status(201).json({ success: true, data: ticket });
});

// @route  GET /api/tickets
// @access Employee (own tickets) | Admin (all tickets)
const getTickets = asyncHandler(async (req, res) => {
  const filter = req.user.role === 'Admin' ? {} : { createdBy: req.user._id };

  const tickets = await Ticket.find(filter)
    .populate('createdBy', 'name email role')
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: tickets.length, data: tickets });
});

// @route  GET /api/tickets/:id
// @access Employee (own ticket) | Admin (any ticket)
const getTicketById = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findById(req.params.id).populate('createdBy', 'name email role');

  if (!ticket) {
    throw new ApiError(404, 'Ticket not found');
  }

  const isOwner = ticket.createdBy._id.toString() === req.user._id.toString();
  if (req.user.role !== 'Admin' && !isOwner) {
    throw new ApiError(403, 'You do not have access to this ticket');
  }

  res.status(200).json({ success: true, data: ticket });
});

// @route  PUT /api/tickets/:id
// @access Admin
const updateTicketStatus = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(400, errors.array().map((e) => e.msg).join(', '));
  }

  const { status } = req.body;

  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) {
    throw new ApiError(404, 'Ticket not found');
  }

  ticket.status = status;
  await ticket.save();

  res.status(200).json({ success: true, data: ticket });
});

module.exports = { createTicket, getTickets, getTicketById, updateTicketStatus };
