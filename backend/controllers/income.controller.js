import mongoose from "mongoose";
import Income from "../models/income.model.js";
import errorHandler from "../utils/errorHandler.js";
import Notification from "../models/notification.model.js";
import { io } from "../app.js";

export const addIncome = async (req, res, next) => {
  try {
    const { amount, description, category, source, tags } = req.body;
    const income = new Income({
      amount,
      description,
      category,
      source,
      tags,
      user: req.userId,
    });
    await income.save();

    const notification = new Notification({
      user: req.userId,
      message: `You have added a new income of $${amount} for ${description}.`,
      type: "income",
    });
    await notification.save();
    
    io.to(req.userId.toString()).emit("add_income_notification", {
      _id: notification._id,
      message: notification.message,
      isRead: notification.isRead,
      createdAt: notification.createdAt,
      type: notification.type,
    });

    res.status(201).json({
      success: true,
      message: "Income added successfully",
      data: income,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllIncome = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const searchTerm = req.query.search || "";
    const skip = (page - 1) * limit;

    const income = await Income.find({
      user: req.userId,
      ...(searchTerm && {
        $or: [
          { description: { $regex: searchTerm, $options: "i" } },
          { category: { $regex: searchTerm, $options: "i" } },
        ],
      }),
    })
      .populate({
        path: "user",
        select: "name email",
      })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const totalCounts = await Income.countDocuments({ user: req.userId });

    res.status(200).json({
      success: true,
      data: income,
      totalCounts: totalCounts,
      totalPages: Math.ceil(totalCounts / limit),
      currentPage: page,
    });
  } catch (error) {
    next(error);
  }
};

export const updateIncome = async (req, res, next) => {
  try {
    const incomeId = req.params.id;
    const income = await Income.findById(incomeId);
    if (!income) return next(errorHandler(404, "Income not found"));
    const { amount, description, category, source, tags } = req.body;
    const incomeData = {
      amount,
      description,
      category,
      source,
      tags,
    };
    const updatedIncome = await Income.findByIdAndUpdate(incomeId, incomeData, {
      new: true,
    });

    if (income.amount !== amount) {
      const notification = new Notification({
        user: req.userId,
        message: `You have added a new income of $${amount} for ${description}.`,
        type: "income",
      });
      await notification.save();

      io.to(req.userId.toString()).emit("update_income_notification", {
        _id: notification._id,
        message: notification.message,
        isRead: notification.isRead,
        createdAt: notification.createdAt,
        type: notification.type,
      });
    }

    res.status(200).json({
      success: true,
      message: "Income updated successfully",
      data: updatedIncome,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteIncome = async (req, res, next) => {
  try {
    const incomeId = req.params.id;
    const income = await Income.findById(incomeId);
    if (!income) return next(errorHandler(404, "Income not found"));
    await Income.findByIdAndDelete(incomeId);
    res.status(200).json({
      success: true,
      message: "Income deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getIncomeNotification = async (req, res, next) => {
  try {
    const userId = req.userId;
    const notifications = await Notification.find({
      user: userId,
      type: "income",
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

export const getIncomeCardStats = async (req, res, next) => {
  try {
    const results = await Income.aggregate([
      {
        $match: { user: new mongoose.Types.ObjectId(req.userId) },
      },
      {
        $facet: {
          totalAmount: [
            {
              $group: {
                _id: null,
                totalAmount: { $sum: "$amount" },
              },
            },
            {
              $project: {
                _id: 0,
                totalAmount: 1,
              },
            },
          ],
          totalTransaction: [
            {
              $group: {
                _id: null,
                totalTransaction: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 0,
                totalTransaction: 1,
              },
            },
          ],
          totalAndAverageMonthIncome: [
            {
              $group: {
                _id: {
                  $dateToString: {
                    format: "%Y-%m",
                    date: "$createdAt",
                    timezone: "Asia/Kathmandu",
                  },
                },
                totalMonthIncome: { $sum: "$amount" },
                averageMonthIncome: { $avg: "$amount" },
              },
            },
            {
              $sort: { _id: 1 },
            },
            {
              $project: {
                _id: 0,
                date: "$_id",
                totalMonthIncome: 1,
                averageMonthIncome: 1,
              },
            },
          ],
        },
      },
    ]);

    const totalIncome = results[0]?.totalAmount?.[0]?.totalAmount || 0;

    const totalTransaction =
      results[0]?.totalTransaction?.[0]?.totalTransaction || 0;

    const totalMonthIncome =
      results[0]?.totalAndAverageMonthIncome?.[0]?.totalMonthIncome || 0;

    const averageMonthIncome =
      results[0]?.totalAndAverageMonthIncome?.[0]?.averageMonthIncome || 0;

    res.status(200).json({
      success: true,
      data: {
        totalIncome,
        totalTransaction,
        totalMonthIncome,
        averageMonthIncome,
      },
    });
  } catch (error) {
    next(error);
  }
};


//this is used for reports 
export const getDailyIncomeAnalytics = async (req, res, next) => {
  try {
    const income = await Income.aggregate([
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
    ]);
    res.status(200).json({
      success: true,
      data: income,
    });
  } catch (error) {
    next(error);
  }
};

export const getIncomeCategoryAnalytics = async (req, res, next) => {
  try {
    const income = await Income.aggregate([
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
      data: income,
    });
  } catch (error) {
    next(error);
  }
};
