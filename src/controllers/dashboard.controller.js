const dashboardService = require("../services/dashboard.service");

const getSummary = async (req, res, next) => {
  try {
    const data = await dashboardService.getSummary();
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const getByCategory = async (req, res, next) => {
  try {
    const data = await dashboardService.getByCategory();
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const getMonthlyTrends = async (req, res, next) => {
  try {
    const data = await dashboardService.getMonthlyTrends();
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const getRecentActivity = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const data = await dashboardService.getRecentActivity(limit);
    res.status(200).json({ success: true, count: data.length, data });
  } catch (err) {
    next(err);
  }
};

module.exports = { getSummary, getByCategory, getMonthlyTrends, getRecentActivity };