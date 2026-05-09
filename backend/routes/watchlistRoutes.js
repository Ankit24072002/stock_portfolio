const express = require("express");
const router = express.Router();
const {
  addToWatchlist,
  getWatchlist,
  removeFromWatchlist,
} = require("../controllers/watchlistController");
const authenticate = require("../middleware/auth");

router.post("/add", authenticate, addToWatchlist);
router.get("/", authenticate, getWatchlist);
router.post("/remove", authenticate, removeFromWatchlist);

module.exports = router;
