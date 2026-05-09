const Watchlist = require("../models/Watchlist");

const addToWatchlist = async (req, res) => {
  try {
    const { stockSymbol } = req.body;
    const userId = req.userId;

    if (!stockSymbol) {
      return res.status(400).json({ message: "Stock symbol is required" });
    }

    const existingItem = await Watchlist.findOne({ userId, stockSymbol });
    if (existingItem) {
      return res.status(400).json({ message: "Stock already in watchlist" });
    }

    const watchlistItem = new Watchlist({ userId, stockSymbol });
    await watchlistItem.save();

    res.status(201).json({ message: "Stock added to watchlist", watchlistItem });
  } catch (err) {
    res.status(500).json({ message: "Error adding to watchlist", error: err.message });
  }
};

const getWatchlist = async (req, res) => {
  try {
    const userId = req.userId;
    const watchlist = await Watchlist.find({ userId });
    res.json(watchlist);
  } catch (err) {
    res.status(500).json({ message: "Error fetching watchlist", error: err.message });
  }
};

const removeFromWatchlist = async (req, res) => {
  try {
    const { stockSymbol } = req.body;
    const userId = req.userId;

    const result = await Watchlist.deleteOne({ userId, stockSymbol });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Stock not found in watchlist" });
    }

    res.json({ message: "Stock removed from watchlist" });
  } catch (err) {
    res.status(500).json({ message: "Error removing from watchlist", error: err.message });
  }
};

module.exports = { addToWatchlist, getWatchlist, removeFromWatchlist };
