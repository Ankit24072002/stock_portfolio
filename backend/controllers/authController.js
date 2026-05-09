const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const twilio = require("twilio");
const User = require("../models/User");
const config = require("../config/env");

const transporter = nodemailer.createTransport({
  host: config.EMAIL_HOST,
  port: config.EMAIL_PORT,
  secure: config.EMAIL_SECURE === "true",
  auth: {
    user: config.EMAIL_USER,
    pass: config.EMAIL_PASS,
  },
});

let twilioClient = null;
if (config.TWILIO_ACCOUNT_SID && config.TWILIO_ACCOUNT_SID.startsWith("AC") && config.TWILIO_AUTH_TOKEN) {
  twilioClient = twilio(config.TWILIO_ACCOUNT_SID, config.TWILIO_AUTH_TOKEN);
}

const sendEmailOtp = async (email, otp) => {
  await transporter.sendMail({
    from: config.EMAIL_FROM,
    to: email,
    subject: "Your OTP code",
    text: `Your OTP is ${otp}. It expires in 10 minutes.`,
  });
};

const sendSmsOtp = async (phone, otp) => {
  if (!twilioClient) {
    throw new Error("Twilio is not configured properly. Please set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN.");
  }

  await twilioClient.messages.create({
    body: `Your OTP is ${otp}. It expires in 10 minutes.`,
    from: config.TWILIO_FROM_NUMBER,
    to: phone,
  });
};

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

const register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    if (phone) {
      const existingPhone = await User.findOne({ phone });
      if (existingPhone) {
        return res.status(400).json({ message: "Phone number already registered" });
      }
    }

    const user = new User({ name, email, phone, password });
    await user.save();

    const token = jwt.sign({ userId: user._id }, config.JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone, balance: user.balance },
    });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password, rememberMe = false } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const tokenExpiry = rememberMe ? "7d" : "1h";
    const token = jwt.sign({ userId: user._id }, config.JWT_SECRET, { expiresIn: tokenExpiry });

    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone, balance: user.balance },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

const requestOtp = async (req, res) => {
  try {
    const { email, phone } = req.body;

    if (!email && !phone) {
      return res.status(400).json({ message: "Email or phone is required to request OTP" });
    }

    const query = email ? { email } : { phone };
    const user = await User.findOne(query);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const otp = generateOtp();
    user.otpCode = otp;
    user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    const sendOperations = [];
    if (user.email) {
      sendOperations.push(sendEmailOtp(user.email, otp));
    }
    if (user.phone) {
      sendOperations.push(sendSmsOtp(user.phone, otp));
    }

    if (sendOperations.length === 0) {
      return res.status(500).json({ message: "No email or phone available for this user" });
    }

    await Promise.all(sendOperations);

    res.json({ message: "OTP sent to registered email and/or phone" });
  } catch (err) {
    res.status(500).json({ message: "OTP request failed", error: err.message });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, phone, otp } = req.body;

    if (!otp || (!email && !phone)) {
      return res.status(400).json({ message: "Email or phone and OTP are required" });
    }

    const query = email ? { email } : { phone };
    const user = await User.findOne(query);
    if (!user || !user.otpCode || !user.otpExpiresAt) {
      return res.status(400).json({ message: "No OTP request found for this user" });
    }

    if (new Date() > user.otpExpiresAt) {
      user.otpCode = undefined;
      user.otpExpiresAt = undefined;
      await user.save();
      return res.status(400).json({ message: "OTP has expired" });
    }

    if (otp !== user.otpCode) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.otpCode = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    const token = jwt.sign({ userId: user._id }, config.JWT_SECRET, { expiresIn: "1h" });

    res.json({
      message: "OTP verified successfully",
      token,
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone, balance: user.balance },
    });
  } catch (err) {
    res.status(500).json({ message: "OTP verification failed", error: err.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching profile", error: err.message });
  }
};

module.exports = { register, login, getProfile, requestOtp, verifyOtp };
