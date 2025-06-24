import mongoose from "mongoose";
import Expense from "../models/expense.model.js";
import Income from "../models/income.model.js";

export const getExpenseAndIncomeAnalytics = async (req, res, next) => {
  try {
    const expenses = await Expense.aggregate([
      {
        $match: { user: new mongoose.Types.ObjectId(req.userId) },
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
          totalAmountExpense: { $sum: "$amount" },
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          totalAmountExpense: 1,
        },
      },
    ]);
    const incomes = await Income.aggregate([
      {
        $match: { user: new mongoose.Types.ObjectId(req.userId) },
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
          totalAmountIncome: { $sum: "$amount" },
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          totalAmountIncome: 1,
        },
      },
    ]);
    const analytics = expenses.map((expense) => {
      const income = incomes.find((income) => income.date === expense.date);
      return {
        date: expense.date,
        totalAmountExpense: expense.totalAmountExpense || 0,
        totalAmountIncome: income ? income.totalAmountIncome : 0,
      };
    });
    res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    next(error);
  }
};

export const getRecentTransactions = async (req, res, next) => {
  try {
    const incomes = await Income.find({ user: req.userId }).sort({
      createdAt: -1,
    });

    const expenses = await Expense.find({ user: req.userId }).sort({
      createdAt: -1,
    });

    const recentTransactions = [
      ...incomes.map((income) => ({ ...income.toObject(), type: "income" })),
      ...expenses.map((expense) => ({
        ...expense.toObject(),
        type: "expense",
      })),
    ];

    const sortedTransactions = recentTransactions.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    const results = sortedTransactions.map((transaction) => ({
      id: transaction._id,
      type: transaction.type,
      amount: transaction.amount,
      date: transaction.createdAt,
      description: transaction.description,
      category: transaction.category,
    }));
    res.status(200).json({
      success: true,
      data: results,
    });

    res.status(200).json({
      success: true,
      data: recentTransactions,
    });
  } catch (error) {
    next(error);
  }
};

export const getDashboardCardStats = async (req, res, next) => {
  try {
    //1: balance
    const incomes = await Income.find({ user: req.userId }, "amount").lean();
    const expenses = await Expense.find({ user: req.userId }, "amount").lean();

    const incomeSum = incomes.reduce((sum, item) => sum + item.amount, 0);
    const expenseSum = expenses.reduce((sum, item) => sum + item.amount, 0);

    const totalBalance = incomeSum - expenseSum;

    const now = new Date();
    const firstDayOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayOfLastMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1
    );
    const lastDayofLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    //2: month expense

    //current month expense
    const thisMonthExpense = await Expense.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.userId),
          createdAt: { $gte: firstDayOfThisMonth, $lt: now },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
          totalTransactions: { $sum: 1 },
        },
      },
    ]);

    //last month expense
    const lastMonthExpense = await Expense.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.userId),
          createdAt: { $gte: firstDayOfLastMonth, $lt: lastDayofLastMonth },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
          totalTransactions: { $sum: 1 },
        },
      },
    ]);

    const thisMonthExpenseAmount = thisMonthExpense[0]?.totalAmount || 0;
    const thisMonthExpenseTransactions =
      thisMonthExpense[0]?.totalTransactions || 0;

    const lastMonthExpenseAmount = lastMonthExpense[0]?.totalAmount || 0;
    const lastMonthExpenseTransactions =
      lastMonthExpense[0]?.totalTransactions || 0;

    //calculate %change from last month
    let percentChangeForExpense = 0;
    if (lastMonthExpenseAmount > 0) {
      percentChangeForExpense =
        ((thisMonthExpenseAmount - lastMonthExpenseAmount) /
          lastMonthExpenseAmount) *
        100;
    }

    // finding increase or decrease from last month
    let isIncreasingExpenseFromLastMonth =
      thisMonthExpenseAmount >= lastMonthExpenseAmount;

    //3 : income

    //month income

    const thisMonthIncome = await Income.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.userId),
          createdAt: { $gte: firstDayOfThisMonth, $lt: now },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
          totalTransactions: { $sum: 1 },
        },
      },
    ]);

    //last month income
    const lastMonthIncome = await Income.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.userId),
          createdAt: { $gte: firstDayOfLastMonth, $lt: lastDayofLastMonth },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
          totalTransactions: { $sum: 1 },
        },
      },
    ]);

    const thisMonthIncomeAmount = thisMonthIncome[0]?.totalAmount || 0;
    const thisMonthIncomeTransactions =
      thisMonthIncome[0]?.totalTransactions || 0;

    const lastMonthIncomeAmount = lastMonthIncome[0]?.totalAmount || 0;
    const lastMonthIncomeTransactions =
      lastMonthIncome[0]?.totalTransactions || 0;

    // calculating percentage change for income
    let percentChangeForIncome = 0;
    if (lastMonthIncomeAmount > 0) {
      percentChangeForIncome =
        ((thisMonthIncomeAmount - lastMonthIncomeAmount) /
          lastMonthIncomeAmount) *
        100;
    }

    // finding increase or decrease from last month
    let isIncreasingIncomeFromLastMonth =
      thisMonthIncomeAmount >= lastMonthIncomeAmount;

    //4: month transactions

    const thisMonthTotalTransactions =
      thisMonthExpenseTransactions + thisMonthIncomeTransactions;
    const lastMonthTotalTransactions =
      lastMonthExpenseTransactions + lastMonthIncomeTransactions;

    //calculating percent change for transactions
    let percentChangeForTransactions = 0;
    if (lastMonthTotalTransactions > 0) {
      percentChangeForTransactions =
        ((thisMonthTotalTransactions - lastMonthTotalTransactions) /
          lastMonthTotalTransactions) *
        100;
    }

    //finding increase or decrease from last month
    let isIncreasingTransactionsFromLastMonth =
      thisMonthTotalTransactions >= lastMonthTotalTransactions;

    const results = {
      totalBalance: totalBalance,
      expense: {
        thisMonthExpense: thisMonthExpenseAmount,
        lastMonthExpense: lastMonthExpenseAmount,
        percentChange: percentChangeForExpense,
        increase: isIncreasingExpenseFromLastMonth,
      },
      income: {
        thisMonthIncome: thisMonthIncomeAmount,
        lastMonthIncome: lastMonthIncomeAmount,
        percentChange: percentChangeForIncome,
        increase: isIncreasingIncomeFromLastMonth,
      },
      transaction: {
        thisMonthTransaction: thisMonthTotalTransactions,
        lastMonthTransaction: lastMonthTotalTransactions,
        percentChange: percentChangeForTransactions,
        increase: isIncreasingTransactionsFromLastMonth,
      },
    };

    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    next(error);
  }
};


