const User = require("../models/User");

const getAllUsers = async () => {
  const users = await User.find().select("-__v").sort({ createdAt: -1 });
  return users;
};

module.exports = { getAllUsers };