const Portfolio = require("../models/Portfolio");
const Transaction = require("../models/Transaction");
const User = require("../models/User");

const buyStock = async (req, res) => {
  try {
    const { stockSymbol, quantity, price } = req.body;
    const userId = req.userId;

    if (!stockSymbol || !quantity || !price) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const totalAmount = quantity * price;
    const user = await User.findById(userId);

    if (user.balance < totalAmount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Update user balance
    user.balance -= totalAmount;
    await user.save();

    // Update or create portfolio
    let portfolio = await Portfolio.findOne({ userId, stockSymbol });
    if (portfolio) {
      const totalCost = portfolio.avgPrice * portfolio.quantity + totalAmount;
      portfolio.quantity += quantity;
      portfolio.avgPrice = totalCost / portfolio.quantity;
      portfolio.currentPrice = price;
    } else {
      portfolio = new Portfolio({
        userId,
        stockSymbol,
        quantity,
        avgPrice: price,
        currentPrice: price,
      });
    }
    await portfolio.save();

    // Create transaction
    const transaction = new Transaction({
      userId,
      stockSymbol,
      type: "BUY",
      quantity,
      price,
      totalAmount,
    });
    await transaction.save();

    res.status(201).json({ message: "Stock purchased successfully", portfolio, transaction });
  } catch (err) {
    res.status(500).json({ message: "Error buying stock", error: err.message });
  }
};

const sellStock = async (req, res) => {
  try {
    const { stockSymbol, quantity, price } = req.body;
    const userId = req.userId;

    const portfolio = await Portfolio.findOne({ userId, stockSymbol });
    if (!portfolio || portfolio.quantity < quantity) {
      return res.status(400).json({ message: "Insufficient stock quantity" });
    }

    const totalAmount = quantity * price;

    // Update portfolio
    portfolio.quantity -= quantity;
    if (portfolio.quantity === 0) {
      await Portfolio.deleteOne({ _id: portfolio._id });
    } else {
      await portfolio.save();
    }

    // Update user balance
    const user = await User.findById(userId);
    user.balance += totalAmount;
    await user.save();

    // Create transaction
    const transaction = new Transaction({
      userId,
      stockSymbol,
      type: "SELL",
      quantity,
      price,
      totalAmount,
    });
    await transaction.save();

    res.json({ message: "Stock sold successfully", transaction });
  } catch (err) {
    res.status(500).json({ message: "Error selling stock", error: err.message });
  }
};

const getPortfolio = async (req, res) => {
  try {
    const userId = req.userId;
    const portfolio = await Portfolio.find({ userId });
    res.json(portfolio);
  } catch (err) {
    res.status(500).json({ message: "Error fetching portfolio", error: err.message });
  }
};

const getTransactionHistory = async (req, res) => {
  try {
    const userId = req.userId;
    const transactions = await Transaction.find({ userId }).sort({ createdAt: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: "Error fetching transactions", error: err.message });
  }
};

module.exports = { buyStock, sellStock, getPortfolio, getTransactionHistory };
