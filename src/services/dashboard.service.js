const FinancialRecord = require("../models/FinancialRecord");

const getSummary = async () => {
  const result = await FinancialRecord.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: "$type",
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
  ]);

  const summary = { totalIncome: 0, totalExpenses: 0, incomeCount: 0, expenseCount: 0 };

  result.forEach((item) => {
    if (item._id === "income") {
      summary.totalIncome = item.total;
      summary.incomeCount = item.count;
    } else if (item._id === "expense") {
      summary.totalExpenses = item.total;
      summary.expenseCount = item.count;
    }
  });

  summary.netBalance = summary.totalIncome - summary.totalExpenses;

  return summary;
};

const getByCategory = async () => {
  const result = await FinancialRecord.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: { category: "$category", type: "$type" },
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
    { $sort: { total: -1 } },
    {
      $project: {
        _id: 0,
        category: "$_id.category",
        type: "$_id.type",
        total: 1,
        count: 1,
      },
    },
  ]);

  return result;
};

const getMonthlyTrends = async () => {
  const result = await FinancialRecord.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: {
          year: { $year: "$date" },
          month: { $month: "$date" },
          type: "$type",
        },
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
    {
      $project: {
        _id: 0,
        year: "$_id.year",
        month: "$_id.month",
        type: "$_id.type",
        total: 1,
        count: 1,
      },
    },
  ]);

  // Group by year-month for cleaner frontend consumption
  const trendsMap = {};

  result.forEach(({ year, month, type, total, count }) => {
    const key = `${year}-${String(month).padStart(2, "0")}`;
    if (!trendsMap[key]) {
      trendsMap[key] = { period: key, year, month, income: 0, expenses: 0, incomeCount: 0, expenseCount: 0 };
    }
    if (type === "income") {
      trendsMap[key].income = total;
      trendsMap[key].incomeCount = count;
    } else {
      trendsMap[key].expenses = total;
      trendsMap[key].expenseCount = count;
    }
  });

  return Object.values(trendsMap).map((item) => ({
    ...item,
    net: item.income - item.expenses,
  }));
};

const getRecentActivity = async (limit = 5) => {
  const records = await FinancialRecord.find({ isDeleted: false })
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 })
    .limit(limit)
    .select("-__v");

  return records;
};

module.exports = { getSummary, getByCategory, getMonthlyTrends, getRecentActivity };