import express from "express";
import {
  createAlbum,
  addImagesToAlbum,
  updateAlbum,
  deleteAlbum,
  deleteImageFromAlbum,
  getAllAlbums,
  getAlbumById,
} from "../../controllers/galleryController.js";

import { verifyToken } from "../../middlewares/auth.js";

const router = express.Router();

// BASE URL = /api/admin/gallery
// Only admin can access these routes

router.post("/", verifyToken("admin", "superAdmin"), createAlbum);
router.post("/:id/images", verifyToken("admin", "superAdmin"), addImagesToAlbum);
router.put("/:id", verifyToken("admin", "superAdmin"), updateAlbum);
router.delete("/:id", verifyToken("admin", "superAdmin"), deleteAlbum);
router.delete(
  "/:albumId/images/:imageIndex",
  verifyToken("admin", "superAdmin"),
  deleteImageFromAlbum
);

router.get("/", verifyToken("admin", "superAdmin"), getAllAlbums);
router.get("/:id", verifyToken("admin", "superAdmin"), getAlbumById);

export default router;
