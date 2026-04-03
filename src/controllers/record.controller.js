const recordService = require("../services/record.service");

const createRecord = async (req, res, next) => {
  try {
    const { amount, type, category, date, notes } = req.body;

    if (!amount || !type || !category) {
      return res.status(400).json({
        success: false,
        message: "Amount, type, and category are required",
      });
    }

    const record = await recordService.createRecord(
      { amount, type, category, date, notes },
      req.user.id
    );

    res.status(201).json({ success: true, data: record });
  } catch (err) {
    next(err);
  }
};

const getAllRecords = async (req, res, next) => {
  try {
    const { type, category, startDate, endDate, page, limit } = req.query;

    const result = await recordService.getAllRecords(
      { type, category, startDate, endDate },
      parseInt(page) || 1,
      parseInt(limit) || 10
    );

    res.status(200).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

const getRecordById = async (req, res, next) => {
  try {
    const record = await recordService.getRecordById(req.params.id);
    res.status(200).json({ success: true, data: record });
  } catch (err) {
    next(err);
  }
};

const updateRecord = async (req, res, next) => {
  try {
    const record = await recordService.updateRecord(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: "Record updated successfully",
      data: record,
    });
  } catch (err) {
    next(err);
  }
};

const deleteRecord = async (req, res, next) => {
  try {
    await recordService.deleteRecord(req.params.id);
    res.status(200).json({
      success: true,
      message: "Record deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createRecord,
  getAllRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
};