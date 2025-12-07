import Gallery from "../models/galleryModel.js";

// Utility for consistent error messages
const sendError = (res, status, message) => {
  return res.status(status).json({ success: false, message });
};




// CREATE NEW ALBUM
export const createAlbum = async (req, res) => {
  try {
    const { title, description, department } = req.body;

    if (!title) return sendError(res, 400, "Album title is required");

    const album = await Gallery.create({
      title,
      description,
      department,
      createdBy: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Album created successfully",
      data: album,
    });
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "Failed to create album");
  }
};




// ADD IMAGES TO ALBUM
export const addImagesToAlbum = async (req, res) => {
  try {
    const albumId = req.params.id;
    const { images } = req.body;

    if (!images || !Array.isArray(images) || images.length === 0) {
      return sendError(res, 400, "No images provided");
    }

    const album = await Gallery.findById(albumId);

    if (!album) return sendError(res, 404, "Album not found");

    album.images.push(...images);

    // If cover image is not set, set the first uploaded image
    if (!album.coverImage && images.length > 0) {
      album.coverImage = images[0];
    }

    await album.save();

    return res.status(200).json({
      success: true,
      message: "Images added successfully",
      data: album,
    });
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "Failed to add images");
  }
};



// UPDATE ALBUM INFO
export const updateAlbum = async (req, res) => {
  try {
    const albumId = req.params.id;

    const album = await Gallery.findByIdAndUpdate(albumId, req.body, {
      new: true,
    });

    if (!album) return sendError(res, 404, "Album not found");

    return res.status(200).json({
      success: true,
      message: "Album updated",
      data: album,
    });
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "Failed to update album");
  }
};




// DELETE SPECIFIC IMAGE
export const deleteImageFromAlbum = async (req, res) => {
  try {
    const { albumId, imageIndex } = req.params;

    const album = await Gallery.findById(albumId);

    if (!album) return sendError(res, 404, "Album not found");

    if (!album.images[imageIndex]) {
      return sendError(res, 404, "Image not found");
    }

    album.images.splice(imageIndex, 1);

    // If deleted image was the cover image → remove it
    if (
      album.coverImage &&
      album.coverImage.fileUrl === album.images[imageIndex]?.fileUrl
    ) {
      album.coverImage = null;
    }

    await album.save();

    return res.status(200).json({
      success: true,
      message: "Image removed",
      data: album,
    });
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "Failed to delete image");
  }
};




// DELETE ALBUM
export const deleteAlbum = async (req, res) => {
  try {
    const id = req.params.id;

    const album = await Gallery.findByIdAndDelete(id);

    if (!album) return sendError(res, 404, "Album not found");

    return res.status(200).json({
      success: true,
      message: "Album deleted successfully",
    });
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "Failed to delete album");
  }
};


// GET ALL ALBUMS 
export const getAllAlbums = async (req, res) => {
  try {
    const albums = await Gallery.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: albums.length,
      data: albums,
    });
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "Failed to fetch albums");
  }
};

// ==============================
// GET SINGLE ALBUM
// GET /api/admin/gallery/:id
// ==============================
export const getAlbumById = async (req, res) => {
  try {
    const id = req.params.id;

    const album = await Gallery.findById(id);

    if (!album) return sendError(res, 404, "Album not found");

    return res.status(200).json({
      success: true,
      data: album,
    });
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "Failed to fetch album");
  }
};
