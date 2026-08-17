const Ticket = require("../models/Ticket");
const Event = require("../models/Event");
const User = require("../models/User");

const purchaseTicket = async (req, res) => {
  try {
    const { eventId, quantity } = req.body;
    const userId = req.user.userId;

    // Validation
    if (!eventId || !quantity) {
      return res
        .status(400)
        .json({ error: "Please provide eventId and quantity" });
    }

    if (quantity <= 0 || !Number.isInteger(quantity)) {
      return res
        .status(400)
        .json({ error: "Quantity must be a positive integer" });
    }

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Check if enough tickets available
    if (event.availableTickets < quantity) {
      return res
        .status(400)
        .json({
          error: `Not enough tickets available. Only ${event.availableTickets} tickets left`,
        });
    }

    // Calculate total amount
    const totalAmount = event.ticketPrice * quantity;

    // Create ticket
    const ticket = new Ticket({
      user: userId,
      event: eventId,
      quantity,
      totalAmount,
      status: "pending",
    });

    await ticket.save();

    // Reduce available tickets
    event.availableTickets -= quantity;
    await event.save();

    // Populate references
    await ticket.populate(["user", "event"]);

    return res.status(201).json(ticket);
  } catch (error) {
    console.error("Purchase ticket error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

const getMyTickets = async (req, res) => {
  try {
    const userId = req.user.userId;

    const tickets = await Ticket.find({ user: userId })
      .populate("event")
      .populate("user", "name email");

    return res.status(200).json(tickets);
  } catch (error) {
    console.error("Get my tickets error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

const getTicketById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const ticket = await Ticket.findById(id)
      .populate("event")
      .populate("user", "name email");

    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    // Users can only view their own tickets (unless admin)
    if (req.user.role !== "admin" && ticket.user._id.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "Access denied" });
    }

    return res.status(200).json(ticket);
  } catch (error) {
    console.error("Get ticket by ID error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .populate("user", "name email")
      .populate("event");

    return res.status(200).json(tickets);
  } catch (error) {
    console.error("Get all tickets error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  purchaseTicket,
  getMyTickets,
  getTicketById,
  getAllTickets,
};
