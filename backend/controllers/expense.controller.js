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
    const expenses = await Expense.find({ user: req.userId }).populate({
      path: "user",
      select: "name email",
    });
    res.status(200).json({
      success: true,
      data: expenses,
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
      user: req.userId,
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
  if (req.userId === req.params.id) {
    try {
      const expenseId = req.params.id;
      const expense = await Expense.findById(expenseId);
      if (!expense) return next(errorHandler(404, "Expense not found"));
      const deletedExpense = await Expense.findByIdAndDelete(expenseId);
      res.status(200).json({
        success: true,
        message: "Expense deleted successfully",
        data: deletedExpense,
      });
    } catch (error) {
      next(error);
    }
  } else {
    return next(
      errorHandler(403, "You are not authorized to delete this expense")
    );
  }
};
