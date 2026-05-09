const express = require("express");
const router = express.Router();
const {
  buyStock,
  sellStock,
  getPortfolio,
  getTransactionHistory,
} = require("../controllers/portfolioController");
const authenticate = require("../middleware/auth");

router.post("/buy", authenticate, buyStock);
router.post("/sell", authenticate, sellStock);
router.get("/", authenticate, getPortfolio);
router.get("/transactions", authenticate, getTransactionHistory);

module.exports = router;
