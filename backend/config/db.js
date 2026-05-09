const mongoose = require("mongoose");
const config = require("./env");

const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✓ MongoDB Connected Successfully");
  } catch (err) {
    console.error("✗ MongoDB Connection Error:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
