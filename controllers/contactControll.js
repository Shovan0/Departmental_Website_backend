import Contact from "../models/contactModel.js";

// Utility for consistent error responses
const sendError = (res, status, message) => {
  return res.status(status).json({ success: false, message });
};


// GET ALL CONTACT MESSAGES
// GET /api/admin/contact
export const getAllContacts = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;

    let filter = {};

    if (status) filter.status = status;

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } },
      ];
    }

    const total = await Contact.countDocuments(filter);

    const contacts = await Contact.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalContacts: total,
      data: contacts,
    });
  } catch (err) {
    console.error("Error fetching contacts:", err);
    sendError(res, 500, "Failed to fetch contact messages");
  }
};

// GET SINGLE CONTACT MESSAGE
// GET /api/admin/contact/:id
export const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) return sendError(res, 404, "Contact message not found");

    res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (err) {
    console.error("Error fetching contact:", err);
    sendError(res, 500, "Failed to fetch contact message");
  }
};

// UPDATE CONTACT STATUS
// PUT /api/admin/contact/:id
export const updateContactStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !["new", "read", "closed"].includes(status)) {
      return sendError(res, 400, "Invalid status value");
    }

    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedContact)
      return sendError(res, 404, "Contact message not found");

    res.status(200).json({
      success: true,
      message: "Contact status updated",
      data: updatedContact,
    });
  } catch (err) {
    console.error("Error updating contact status:", err);
    sendError(res, 500, "Failed to update contact status");
  }
};

// DELETE CONTACT MESSAGE
// DELETE /api/admin/contact/:id
export const deleteContact = async (req, res) => {
  try {
    const deleted = await Contact.findByIdAndDelete(req.params.id);

    if (!deleted) return sendError(res, 404, "Contact message not found");

    res.status(200).json({
      success: true,
      message: "Contact message deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting contact:", err);
    sendError(res, 500, "Failed to delete contact message");
  }
};
