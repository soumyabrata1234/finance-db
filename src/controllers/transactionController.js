const transactionService = require('../services/transactionService');
const mongoose = require('mongoose');

const create = async (req, res, next) => {
  try {
    const transaction = await transactionService.createTransaction(
      req.user.id,
      req.body
    );
    res.status(201).json({ success: true, data: transaction });
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const result = await transactionService.getTransactions(
      req.user.id,
      req.query
    );
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const transaction = await transactionService.getTransactionById(
      req.user.id,
      req.params.id
    );
    res.status(200).json({ success: true, data: transaction });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const transaction = await transactionService.updateTransaction(
      req.user.id,
      req.params.id,
      req.body
    );
    res.status(200).json({ success: true, data: transaction });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    await transactionService.deleteTransaction(req.user.id, req.params.id);
    res.status(200).json({ success: true, message: 'Transaction deleted' });
  } catch (error) {
    next(error);
  }
};

const getSummary = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    const summary = await transactionService.getTransactionSummary(
      new mongoose.Types.ObjectId(req.user.id),
      {
        month: parseInt(month, 10) || new Date().getMonth() + 1,
        year: parseInt(year, 10) || new Date().getFullYear(),
      }
    );
    res.status(200).json({ success: true, data: summary });
  } catch (error) {
    next(error);
  }
};

module.exports = { create, getAll, getById, update, remove, getSummary };
