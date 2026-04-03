const FinancialRecord = require("../models/FinancialRecord");

const createRecord = async (data, userId) => {
  const record = await FinancialRecord.create({ ...data, createdBy: userId });
  return record;
};

const getAllRecords = async (filters = {}, page = 1, limit = 10) => {
  const query = { isDeleted: false };

  // Filter by type (income / expense)
  if (filters.type) {
    query.type = filters.type;
  }

  // Filter by category
  if (filters.category) {
    query.category = new RegExp(filters.category, "i");
  }

  // Filter by date range
  if (filters.startDate || filters.endDate) {
    query.date = {};
    if (filters.startDate) query.date.$gte = new Date(filters.startDate);
    if (filters.endDate) query.date.$lte = new Date(filters.endDate);
  }

  const skip = (page - 1) * limit;
  const total = await FinancialRecord.countDocuments(query);

  const records = await FinancialRecord.find(query)
    .populate("createdBy", "name email")
    .sort({ date: -1 })
    .skip(skip)
    .limit(limit)
    .select("-__v");

  return {
    data: records,
    total,
    page,
    pages: Math.ceil(total / limit),
  };
};

const getRecordById = async (recordId) => {
  const record = await FinancialRecord.findOne({
    _id: recordId,
    isDeleted: false,
  })
    .populate("createdBy", "name email")
    .select("-__v");

  if (!record) {
    const error = new Error("Record not found");
    error.statusCode = 404;
    throw error;
  }

  return record;
};

const updateRecord = async (recordId, updateData) => {
  // Prevent these fields from being updated directly
  delete updateData.createdBy;
  delete updateData.isDeleted;

  const record = await FinancialRecord.findOneAndUpdate(
    { _id: recordId, isDeleted: false },
    updateData,
    { new: true, runValidators: true }
  ).select("-__v");

  if (!record) {
    const error = new Error("Record not found");
    error.statusCode = 404;
    throw error;
  }

  return record;
};

const deleteRecord = async (recordId) => {
  const record = await FinancialRecord.findOneAndUpdate(
    { _id: recordId, isDeleted: false },
    { isDeleted: true },
    { new: true }
  );

  if (!record) {
    const error = new Error("Record not found");
    error.statusCode = 404;
    throw error;
  }

  return record;
};

module.exports = {
  createRecord,
  getAllRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
};