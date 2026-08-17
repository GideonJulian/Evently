const Event = require("../models/Event");
const User = require("../models/User");

const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate("createdBy", "name email");
    return res.status(200).json(events);
  } catch (error) {
    console.error("Get events error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id).populate("createdBy", "name email");

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    return res.status(200).json(event);
  } catch (error) {
    console.error("Get event by ID error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

const createEvent = async (req, res) => {
  try {
    const { title, description, date, time, location, image, ticketPrice, totalTickets } =
      req.body;

    // Validation
    if (
      !title ||
      !description ||
      !date ||
      !time ||
      !location ||
      ticketPrice === undefined ||
      ticketPrice === null ||
      totalTickets === undefined ||
      totalTickets === null
    ) {
      return res
        .status(400)
        .json({ error: "Please provide all required fields" });
    }

    if (
      !Number.isFinite(ticketPrice) ||
      !Number.isInteger(totalTickets) ||
      ticketPrice < 0 ||
      totalTickets < 1
    ) {
      return res
        .status(400)
        .json({ error: "Invalid ticket price or total tickets" });
    }

    // Create event with authenticated admin as creator
    const event = new Event({
      title,
      description,
      date,
      time,
      location,
      image,
      ticketPrice,
      totalTickets,
      availableTickets: totalTickets, // Initially all tickets available
      createdBy: req.user.userId,
    });

    await event.save();
    await event.populate("createdBy", "name email");

    return res.status(201).json(event);
  } catch (error) {
    console.error("Create event error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date, time, location, image, ticketPrice, totalTickets } =
      req.body;

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Update fields
    if (title) event.title = title;
    if (description) event.description = description;
    if (date) event.date = date;
    if (time) event.time = time;
    if (location) event.location = location;
    if (image) event.image = image;
    if (ticketPrice !== undefined) {
      if (!Number.isFinite(ticketPrice) || ticketPrice < 0) {
        return res.status(400).json({ error: "Invalid ticket price" });
      }
      event.ticketPrice = ticketPrice;
    }
    if (totalTickets !== undefined) {
      if (!Number.isInteger(totalTickets) || totalTickets < 1) {
        return res.status(400).json({ error: "Invalid ticket limit" });
      }

      const soldTickets = event.totalTickets - event.availableTickets;
      if (totalTickets < soldTickets) {
        return res.status(400).json({
          error: `Ticket limit cannot be less than ${soldTickets} tickets already sold`,
        });
      }

      event.totalTickets = totalTickets;
      event.availableTickets = totalTickets - soldTickets;
    }

    await event.save();
    await event.populate("createdBy", "name email");

    return res.status(200).json(event);
  } catch (error) {
    console.error("Update event error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByIdAndDelete(id);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    return res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Delete event error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

const addFavourite = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Check if event exists
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if event is already in favourites
    if (user.favourites.includes(id)) {
      return res.status(400).json({ error: "Event already in favourites" });
    }

    // Add to favourites
    user.favourites.push(id);
    await user.save();

    return res
      .status(200)
      .json({ message: "Event added to favourites", favourites: user.favourites });
  } catch (error) {
    console.error("Add favourite error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

const removeFavourite = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Remove from favourites
    user.favourites = user.favourites.filter((fav) => fav.toString() !== id);
    await user.save();

    return res
      .status(200)
      .json({ message: "Event removed from favourites", favourites: user.favourites });
  } catch (error) {
    console.error("Remove favourite error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

const getFavourites = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId).populate("favourites");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(user.favourites);
  } catch (error) {
    console.error("Get favourites error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  addFavourite,
  removeFavourite,
  getFavourites,
};
