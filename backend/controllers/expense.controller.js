import mongoose, { Mongoose } from "mongoose";
import Expense from "../models/expense.model.js";
import errorHandler from "../utils/errorHandler.js";
import { io } from "../app.js";
import Notification from "../models/notification.model.js";

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

    const notification = new Notification({
      user: req.userId,
      message: `You added an expense of Rs. ${amount}`,
    });
    await notification.save();

    io.to(req.userId.toString()).emit("new_notification", {
      _id: notification._id,
      message: notification.message,
      isRead: notification.isRead,
    });

    res.status(201).json({
      success: true,
      message: "Expense added successfully",
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

    if (expense.amount !== amount) {
      const notification = new Notification({
        user: req.userId,
        message: `You have updated an expense of Rs. ${amount}`,
      });

      await notification.save();

      io.to(
        req.userId.toString().emit("new_notification", {
          _id: notification._id,
          message: notification.message,
          isRead: notification.isRead,
        })
      );
    }

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

export const getExpenseNotification = async (req, res, next) => {
  try {
    const userId = req.userId;
    const notifications = await Notification.find({
      user: userId,
    }).sort({
      createdAt: -1,
    });
    res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    next(error);
  }
};

export const getExpenseCardStats = async (req, res, next) => {
  try {
    const result1 = await Expense.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.userId) } },
      {
        $group: {
          _id: null,
          totalExpense: { $sum: "$amount" },
          totalTransaction: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          totalExpense: 1,
          totalTransaction: 1,
        },
      },
    ]);

    const result2 = await Expense.aggregate([
      {
        $match: { user: new mongoose.Types.ObjectId(req.userId) },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m",
              date: "$createdAt",
              timezone: "Asia/Kathmandu",
            },
          },
          totalMonthExpense: { $sum: "$amount" },
          AverageMonthExpense: { $avg: "$amount" },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
      {
        $project: {
          _id: 0,
          totalMonthExpense: 1,
          AverageMonthExpense: 1,
        },
      },
    ]);
    res.status(200).json({
      success: true,
      data: {
        totalExpense: result1[0].totalExpense,
        totalTransaction: result1[0].totalTransaction,
        totalMonthExpense: result2[0].totalMonthExpense,
        AverageMonthExpense: result2[0].AverageMonthExpense,
      },
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
              date: "$createdAt",
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
          date: "$_id",
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
                _id: {
                  $dateToString: {
                    format: "%Y-%m-%d",
                    date: "$createdAt",
                    timezone: "Asia/Kathmandu",
                  },
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
                  $dateToString: {
                    format: "%U",
                    date: "$createdAt",
                    timezone: "Asia/Kathmandu",
                  },
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
                week: "$_id",
                totalAmount: 1,
                count: 1,
              },
            },
          ],
          monthly: [
            {
              $group: {
                _id: {
                  $dateToString: {
                    format: "%Y-%m",
                    date: "$createdAt",
                    timezone: "Asia/Kathmandu",
                  },
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
                month: "$_id",
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
