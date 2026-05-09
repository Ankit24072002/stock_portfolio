const express = require("express");
const router = express.Router();
const { register, login, getProfile, requestOtp, verifyOtp } = require("../controllers/authController");
const authenticate = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.post("/request-otp", requestOtp);
router.post("/verify-otp", verifyOtp);
router.get("/profile", authenticate, getProfile);

module.exports = router;
