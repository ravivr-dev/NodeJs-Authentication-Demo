const { model } = require("mongoose");
const uploadToCloudinary = require("../helper/CloudinaryHelper");
const Image = require("../models/Image");
const fs = require("fs");
const cloudinary = require("../config/cloudinary");

const uploadImage = async (req, res) => {
  try {
    // Check if file is missing in req object

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File not found! Please upload an Image",
      });
    }

    /// upload to cloudinary
    const { url, publicId } = await uploadToCloudinary(req.file.path);

    /// Store the image url and public Id and user ID
    const newImage = await Image.create({
      url,
      publicId,
      uploadedBy: req.userId,
    });

    /// Delete the file from the local storage
    fs.unlinkSync(req.file.path);

    return res.status(201).json({
      success: true,
      message: "Image upload successfully!",
      image: newImage,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const fetchImageController = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
    const totalImages = await Image.countDocuments();
    const totalPages = Math.ceil(totalImages / limit);
    const sortObj = {};
    sortBy[sortBy] = sortOrder;

    const allImage = await Image.find().sort(sortObj).skip(skip).limit(limit);

    if (allImage) {
      return res.status(200).json({
        success: true,
        message: "Fetched Images successfully",
        currentPage: page,
        totalPages: totalPages,
        totalImages: totalImages,
        images: allImage,
      });
    }
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong! Please try" });
  }
};

const daleteImageController = async (req, res) => {
  try {
    const imageId = req.params.id;

    const userId = req.userId;

    const image = await Image.findById(imageId);

    if (!image) {
      return res.status(400).json({
        success: false,
        message: "Image not found!",
      });
    }

    if (image.uploadedBy.toString() !== userId) {
      return res.status(400).json({
        success: false,
        message: "You don't have the rights to delete the image",
      });
    }

    /// delete this image from cloudinary
    await cloudinary.uploader.destroy(image.publicId);

    /// Now you can delete the imageId from the MOngoDb
    await Image.findByIdAndDelete(imageId);

    return res.status(200).json({
      success: true,
      message: "Image deleted successfully",
    });

    if (allImage) {
      return res.status(200).json({
        success: true,
        message: "Fetched Images successfully",
        images: allImage,
      });
    }
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong! Please try" });
  }
};

module.exports = { uploadImage, fetchImageController, daleteImageController };
