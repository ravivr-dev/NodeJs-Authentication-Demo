const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/// register controller
const registerUser = async (req, res) => {
  try {
    // Extract user info from req body
    const { username, email, password, role } = req.body;

    // check if user is already exist into DB
    const checkExistingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (checkExistingUser) {
      res.status(400).json({
        success: false,
        message:
          "User is already exist in our system with the given username or email",
      });
    }

    /// Hash user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    /// create a new user and save into DB
    const newlyCreatedUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    if (newlyCreatedUser) {
      res.status(201).json({
        success: true,
        message: "User resgister successfully!",
        data: newlyCreatedUser,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Unable to resiger please try again",
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Somthing went wrong. Please try again later",
    });
  }
};

/// Login controler
const loginUser = async (req, res) => {
  try {
    /// Extarct user entered data from the request body
    const { username, password } = req.body || {};

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Email/Username and password are required" });
    }

    /// Get the cuurent user exits in DB
    const checkUser = await User.findOne({
      $or: [{ email: username }, { username }],
    });

    if (!checkUser) {
      res.status(404).json({
        success: false,
        message: "User does not exist!",
      });
    }

    /// Check if user enter password is correct
    const isPasswordCorret = await bcrypt.compare(password, checkUser.password);

    if (!isPasswordCorret) {
      res.status(400).json({
        success: false,
        message: "email/username or password is incorrect!",
      });
    }

    // Create user token
    const accessToken = jwt.sign(
      {
        userId: checkUser._id,
        username: checkUser.username,
        role: checkUser.role,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "15m",
      }
    );

    res.status(200).json({
      success: true,
      message: "User logged in successfully!",
      accessToken,
      data: checkUser,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Somthing went wrong. Please try again later",
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.userId;

    /// extract old and new password
    console.log(req.userId);
    console.log(req.body);
    const { oldPass, newPass } = req.body || {};

    if (!oldPass && !newPass) {
      return res.status(400).json({
        success: false,
        message: "Please enter old and new password",
      });
    }

    /// Now find the user based on UserId and compare the old password
    const findUser = await User.findById(userId);

    if (!findUser) {
      return res.status(400).json({
        success: false,
        message: "User not found!",
      });
    }

    /// Now compare the user enter old password with DB saved password
    const isOldPasswordCorret = await bcrypt.compare(
      oldPass,
      findUser.password
    );

    if (!isOldPasswordCorret) {
      return res.status(400).json({
        success: false,
        message: "Old password is incorrect!",
      });
    }

    /// Also check if old pass and new password cannot be same
    const isOldPasswordSameAsNew = await bcrypt.compare(
      newPass,
      findUser.password
    );

    if (isOldPasswordSameAsNew) {
      return res.status(400).json({
        success: false,
        message: "New password cannot be same as new password.",
      });
    }

    /// Now generate the hash password and that will get upldated in backend
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPass, salt);

    // update user password
    findUser.password = hashedPassword;

    await findUser.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Somthing went wrong. Please try again later",
    });
  }
};

module.exports = { loginUser, registerUser, changePassword };
