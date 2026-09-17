const asyncWrapper = require("../middlewares/async");
const Users = require("../models/Users");

/**
 * @desc    Get all users
 * @route   GET /v1/users
 * @access  Public
 */
const getAllUsers = asyncWrapper(async (req, res) => {
  const users = await Users.find({}).sort({ createdAt: -1 }).lean();

  res.status(200).json({
    success: true,
    message: "Users retrieved successfully.",
    total: users.length,
    data: users,
  });
});

/**
 * @desc    Get single user by username
 * @route   GET /v1/user/:username
 * @access  Public
 */
const getSingleUser = asyncWrapper(async (req, res) => {
  const { username } = req.params;

  const user = await Users.findOne({ username }).lean();

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found.",
    });
  }

  res.status(200).json({
    success: true,
    message: "User retrieved successfully.",
    data: user,
  });
});

/**
 * @desc    Create a new user
 * @route   POST /v1/users
 * @access  Public
 */

const createUsers = asyncWrapper(async (req, res) => {
  const userData = req.body;

  // Check request body
  if (!userData || Object.keys(userData).length === 0) {
    return res.status(400).json({
      success: false,
      message: "Request body is required.",
    });
  }

  // Validate username
  if (!userData.username || !userData.username.trim()) {
    return res.status(400).json({
      success: false,
      message: "Username is required.",
    });
  }

  // Validate email
  if (!userData.email || !userData.email.trim()) {
    return res.status(400).json({
      success: false,
      message: "Email is required.",
    });
  }

  // Normalize values
  const username = userData.username.trim().toLowerCase();
  const email = userData.email.trim().toLowerCase();

  // Check duplicate username OR email
  const existingUser = await Users.findOne({
    $or: [
      { username },
      { email },
    ],
  }).lean();

  if (existingUser) {
    // Username already exists
    if (existingUser.username === username) {
      return res.status(409).json({
        success: false,
        message: "Username already exists.",
      });
    }

    // Email already exists
    if (existingUser.email === email) {
      return res.status(409).json({
        success: false,
        message: "Email already exists.",
      });
    }
  }

  // Create user
  const user = await Users.create({
    ...userData,
    username,
    email,
  });

  res.status(201).json({
    success: true,
    message: "User created successfully.",
    data: user,
  });
});



/**
 * @desc    Update user profile
 * @route   PUT /v1/user/:username
 * @access  Private
 */
const editSingleUser = asyncWrapper(async (req, res) => {
  const { username } = req.params;

  // Only allow these fields to be updated
  const allowedFields = [
    "name",
    "photoUrl",
    "companyName",
    "address",
    "bio",
    "socialLinks",
  ];

  const updateData = {};

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  });

  // Prevent empty update
  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({
      success: false,
      message: "No valid fields provided for update.",
    });
  }

  const updatedUser = await Users.findOneAndUpdate(
    { username },
    { $set: updateData },
    {
      new: true,
      runValidators: true,
    },
  ).lean();

  if (!updatedUser) {
    return res.status(404).json({
      success: false,
      message: "User not found.",
    });
  }

  res.status(200).json({
    success: true,
    message: "Profile updated successfully.",
    data: updatedUser,
  });
});

module.exports = {
  getAllUsers,
  getSingleUser,
  createUsers,
  editSingleUser,
};
