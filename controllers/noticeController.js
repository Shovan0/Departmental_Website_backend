import Notice from "../models/noticeModel.js";

// =======================================================
// ADMIN — CREATE NOTICE
// =======================================================
export const createNotice = async (req, res) => {
  try {
    const notice = await Notice.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Notice created successfully",
      notice,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message });
  }
};

// =======================================================
// ADMIN — GET ALL NOTICES (with filters)
// Example: ?department=CSE&category=exam&priority=urgent
// =======================================================
export const getAllNotices = async (req, res) => {
  try {
    let filter = { isDeleted: false };

    if (req.query.department) filter.department = req.query.department;
    if (req.query.category) filter.category = req.query.category;
    if (req.query.priority) filter.priority = req.query.priority;
    if (req.query.audience) filter.audience = req.query.audience;
    if (req.query.status) filter.status = req.query.status;

    // Remove expired notices if expired
    filter.$or = [
      { expiresAt: null },
      { expiresAt: { $gt: new Date() } },
    ];

    const notices = await Notice.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({ success: true, notices });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// =======================================================
// ADMIN — GET SINGLE NOTICE
// =======================================================
export const getNoticeById = async (req, res) => {
  try {
    const notice = await Notice.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!notice)
      return res.status(404).json({
        success: false,
        message: "Notice not found",
      });

    return res.status(200).json({ success: true, notice });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// =======================================================
// ADMIN — UPDATE NOTICE
// =======================================================
export const updateNotice = async (req, res) => {
  try {
    const notice = await Notice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!notice)
      return res.status(404).json({ success: false, message: "Notice not found" });

    return res.status(200).json({
      success: true,
      message: "Notice updated successfully",
      notice,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// =======================================================
// ADMIN — DELETE NOTICE (soft delete)
// =======================================================
export const deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );

    if (!notice)
      return res.status(404).json({ success: false, message: "Notice not found" });

    return res.status(200).json({
      success: true,
      message: "Notice deleted (soft delete)",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// =======================================================
// PUBLIC — GET ACTIVE NOTICES (Homepage)
// Returns latest 10 active notices
// =======================================================
export const getLatestNotices = async (req, res) => {
  try {
    const notices = await Notice.find({
      status: "active",
      isDeleted: false,
      $or: [
        { expiresAt: null },
        { expiresAt: { $gt: new Date() } },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(10);

    return res.status(200).json({ success: true, notices });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// =======================================================
// PUBLIC — GET NOTICE BY ID
// =======================================================
export const getPublicNoticeById = async (req, res) => {
  try {
    const notice = await Notice.findOne({
      _id: req.params.id,
      status: "active",
      isDeleted: false,
    });

    if (!notice)
      return res.status(404).json({ success: false, message: "Notice not found" });

    return res.status(200).json({ success: true, notice });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// =======================================================
// PUBLIC — FILTER NOTICES
// Example: ?department=CSE&category=exam
// =======================================================
export const filterPublicNotices = async (req, res) => {
  try {
    let filter = {
      status: "active",
      isDeleted: false,
      $or: [
        { expiresAt: null },
        { expiresAt: { $gt: new Date() } },
      ],
    };

    if (req.query.department) filter.department = req.query.department;
    if (req.query.category) filter.category = req.query.category;
    if (req.query.priority) filter.priority = req.query.priority;

    const notices = await Notice.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({ success: true, notices });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
