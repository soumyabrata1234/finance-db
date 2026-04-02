const Budget = require('../models/Budget');

const createBudget = async (userId, data) => {
  const existing = await Budget.findOne({
    user: userId,
    category: data.category,
    month: data.month,
    year: data.year,
  });

  if (existing) {
    const error = new Error('Budget already exists for this category and period');
    error.statusCode = 400;
    throw error;
  }

  const budget = await Budget.create({ ...data, user: userId });
  return budget;
};

const getBudgets = async (userId, { month, year }) => {
  const budgets = await Budget.find({ user: userId, month, year });
  return budgets;
};

const updateBudget = async (userId, budgetId, data) => {
  const budget = await Budget.findOneAndUpdate(
    { _id: budgetId, user: userId },
    data,
    { new: true, runValidators: true }
  );

  if (!budget) {
    const error = new Error('Budget not found');
    error.statusCode = 404;
    throw error;
  }

  return budget;
};

const deleteBudget = async (userId, budgetId) => {
  const budget = await Budget.findOneAndDelete({
    _id: budgetId,
    user: userId,
  });

  if (!budget) {
    const error = new Error('Budget not found');
    error.statusCode = 404;
    throw error;
  }

  return budget;
};

module.exports = { createBudget, getBudgets, updateBudget, deleteBudget };
