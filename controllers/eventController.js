import Event from "../models/eventModel.js";

// Utility for consistent error messages
const sendError = (res, status, message) => {
  return res.status(status).json({ success: false, message });
};

// ===========================
// CREATE EVENT (ADMIN)
// POST /api/admin/event
// ===========================
export const createEvent = async (req, res) => {
  try {
    const { title, description, image, date, location, createdBy } = req.body;

    if (!title || !description) {
      return sendError(res, 400, "Title and description are mandatory.");
    }

    const newEvent = new Event({
      title,
      description,
      image,
      date,
      location,
      createdBy: req.user.id,
    });

    await newEvent.save();

    return res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: newEvent,
    });
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "Error creating event");
  }
};

// ===========================
// GET ALL EVENTS (ADMIN)
// GET /api/admin/event
// ===========================
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "Error fetching events");
  }
};

// ===========================
// GET SINGLE EVENT (ADMIN)
// GET /api/admin/event/:id
// ===========================
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) return sendError(res, 404, "Event not found");

    return res.status(200).json({
      success: true,
      data: event,
    });
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "Error fetching event");
  }
};

// ===========================
// UPDATE EVENT (ADMIN)
// PUT /api/admin/event/:id
// ===========================
export const updateEvent = async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedEvent) return sendError(res, 404, "Event not found");

    return res.status(200).json({
      success: true,
      message: "Event updated successfully",
      data: updatedEvent,
    });
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "Error updating event");
  }
};

// ===========================
// DELETE EVENT (ADMIN)
// DELETE /api/admin/event/:id
// ===========================
export const deleteEvent = async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);

    if (!deletedEvent) return sendError(res, 404, "Event not found");

    return res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "Error deleting event");
  }
};
