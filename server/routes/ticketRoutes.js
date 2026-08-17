const express = require("express");
const {
  purchaseTicket,
  getMyTickets,
  getTicketById,
  getAllTickets,
} = require("../controllers/ticketController");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// Admin route (must be before other GET routes)
router.get("/", authMiddleware, adminMiddleware, getAllTickets);

// User routes (authenticated)
router.post("/purchase", authMiddleware, purchaseTicket);
router.get("/my-tickets", authMiddleware, getMyTickets);
router.get("/:id", authMiddleware, getTicketById);

module.exports = router;
