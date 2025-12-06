import express from "express";
import {
  getAllAlbums,
  getAlbumById,
} from "../../controllers/galleryController.js";

const router = express.Router();

// BASE URL = /api/gallery

// Get all albums (public)
router.get("/", getAllAlbums);

// Get single album (public)
router.get("/:id", getAlbumById);

export default router;
