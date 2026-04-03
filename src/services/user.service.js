const User = require("../models/User");

const getAllUsers = async () => {
  const users = await User.find().select("-__v").sort({ createdAt: -1 });
  return users;
};

const updateUserRole = async (userId, role) => {
  const validRoles = ["viewer", "analyst", "admin"];

  if (!validRoles.includes(role)) {
    const error = new Error(`Invalid role. Must be one of: ${validRoles.join(", ")}`);
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { role },
    { new: true, runValidators: true }
  ).select("-__v");

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return user;
};

const updateUserStatus = async (userId, isActive) => {
  if (typeof isActive !== "boolean") {
    const error = new Error("isActive must be a boolean (true or false)");
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { isActive },
    { new: true, runValidators: true }
  ).select("-__v");

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return user;
};

module.exports = { getAllUsers, updateUserRole, updateUserStatus };