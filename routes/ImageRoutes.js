const express = require("express");
const AuthMiddleware = require("../middleware/AuthMiddleware");
const isAdminUser = require("../middleware/IsAdminMiddleware");
const {
  uploadImage,
  fetchImageController,
  daleteImageController,
} = require("../controllers/ImageController");
const uploadMiddleware = require("../middleware/UploadMiddleware");

const router = express.Router();

/// Upload the image
router.post(
  "/upload",
  AuthMiddleware,
  isAdminUser,
  uploadMiddleware.single("image"),
  uploadImage
);

router.get("/get", AuthMiddleware, fetchImageController);

// Delete specific image
// 68b89575a6fd48c8d862f849
router.delete("/:id", AuthMiddleware, isAdminUser, daleteImageController);

module.exports = router;
