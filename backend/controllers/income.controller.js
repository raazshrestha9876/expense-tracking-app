import mongoose from "mongoose";
import Income from "../models/income.model.js";
import errorHandler from "../utils/errorHandler.js";

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
    const skip = ((page - 1) * limit);

    const income = await Income.find({ user: req.userId })
      .populate({
        path: "user",
        select: "name email",
      })
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
