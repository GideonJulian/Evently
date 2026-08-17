const express = require("express");
const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  addFavourite,
  removeFavourite,
  getFavourites,
} = require("../controllers/eventController");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// Favourite routes (must be before :id routes to avoid conflicts)
router.get("/favourites", authMiddleware, getFavourites);
router.post("/:id/favourite", authMiddleware, addFavourite);
router.delete("/:id/favourite", authMiddleware, removeFavourite);

// Public routes
router.get("/", getAllEvents);
router.get("/:id", getEventById);

// Admin routes
router.post("/", authMiddleware, adminMiddleware, createEvent);
router.put("/:id", authMiddleware, adminMiddleware, updateEvent);
router.delete("/:id", authMiddleware, adminMiddleware, deleteEvent);

module.exports = router;
