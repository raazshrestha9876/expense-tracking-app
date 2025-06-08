import mongoose from "mongoose";
import Expense from "../models/expense.model.js";
import errorHandler from "../utils/errorHandler";

export const addExpense = async (req, res, next) => {
  try {
    const { amount, description, paymentMethod, category, tags } = req.body;
    const expense = new Expense({
      amount,
      description,
      paymentMethod,
      category,
      tags,
      user: req.userId,
    });
    await expense.save();
    res.status(201).json({
      success: true,
      message: " Expense added successfully",
      data: expense,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllExpense = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const expenses = await Expense.find({ user: req.userId })
      .populate({
        path: "user",
        select: "name email",
      })
      .limit(limit)
      .skip(skip);

    const totalCounts = await Expense.countDocuments({ user: req.userId });

    res.status(200).json({
      success: true,
      data: expenses,
      totalCounts,
      totalPages: Math.ceil(totalCounts / limit),
      currentPage: page,
    });
  } catch (error) {
    next(error);
  }
};

export const updateExpense = async (req, res, next) => {
  try {
    const expenseId = req.params.id;
    const expense = await Expense.findById(expenseId);
    if (!expense) return next(errorHandler(404, "Expense not found"));
    const { amount, description, paymentMethod, category, tags } = req.body;
    const expenseData = {
      amount,
      description,
      paymentMethod,
      category,
      tags,
    };
    const updatedExpense = await Expense.findByIdAndUpdate(
      expenseId,
      expenseData,
      {
        new: true,
      }
    );
    res.status(200).json({
      success: true,
      message: "Expense updated successfully",
      data: updatedExpense,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteExpense = async (req, res, next) => {
  try {
    const expenseId = req.params.id;
    const expense = await Expense.findById(expenseId);
    if (!expense) return next(errorHandler(404, "Expense not found"));
    await Expense.findByIdAndDelete(expenseId);
    res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getExpenseDailyAnalytics = async (req, res, next) => {
  try {
    const expense = await Expense.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.userId),
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$created_at",
              timezone: "Asia/Kathmandu",
            },
          },
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          _id: 0,
          created_at: "$_id",
          total: 1,
          count: 1,
        },
      },
    ]);
    res.status(200).json({
      success: true,
      data: expense,
    });
  } catch (error) {
    next(error);
  }
};

export const getExpenseCategoryAnalytics = async (req, res, next) => {
  try {
    const expense = await Expense.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.userId),
        },
      },
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          totalAmount: 1,
          count: 1,
        },
      },
    ]);
    res.status(200).json({
      success: true,
      data: expense,
    });
  } catch (error) {
    next(error);
  }
};

export const getExpenseAllDateAnalytics = async (req, res, next) => {
  try {
    const expense = await Expense.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.userId),
        },
      },
      {
        $facet: {
          daily: [
            {
              $group: {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: "created_at",
                  timezone: "Asia/Kathmandu",
                },
                totalAmount: { $sum: "$amount" },
                count: { $sum: 1 },
              },
            },
            {
              $sort: { _id: 1 },
            },
            {
              $project: {
                _id: 0,
                date: "$_id",
                totalAmount: 1,
                count: 1,
              },
            },
          ],
          weekly: [
            {
              $group: {
                _id: {
                  year: { $year: "$created_at", timezone: "Asia/Kathmandu" },
                  week: { $isoWeek: "$created_at", timezone: "Asia/Kathmandu" },
                },
                totalAmount: { $sum: "$amount" },
                count: { $sum: 1 },
              },
            },
            {
              $sort: { _id: 1 },
            },
            {
              $project: {
                _id: 0,
                created_at: "$_id",
                totalAmount: 1,
                count: 1,
              },
            },
          ],
          monthly: [
            {
              $group: {
                _id: {
                  year: { $year: "$created_at", timezone: "Asia/Kathmandu" },
                  month: { $month: "$created_at", timezone: "Asia/Kathmandu" },
                },
                totalAmount: { $sum: "$amount" },
                count: { $sum: 1 },
              },
            },
            {
              $sort: { _id: 1 },
            },
            {
              $project: {
                _id: 0,
                created_at: "$_id",
                totalAmount: 1,
                count: 1,
              },
            },
          ],
        },
      },
    ]);
    return res.status(200).json({
      success: true,
      data: expense[0],
    });
  } catch (error) {
    next(error);
  }
};
