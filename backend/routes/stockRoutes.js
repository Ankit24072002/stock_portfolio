const express = require("express");
const router = express.Router();
const { searchStocks, getStockPrice, getAllStocks, getTopMovers, getStockChart, getMarketIndices, getSectorPerformance } = require("../controllers/stockController");

router.get("/search", searchStocks);
router.get("/all", getAllStocks);
router.get("/top-movers", getTopMovers);
router.get("/chart/:symbol/:period?", getStockChart);
router.get("/indices", getMarketIndices);
router.get("/sectors", getSectorPerformance);
router.get("/:symbol", getStockPrice);

module.exports = router;
