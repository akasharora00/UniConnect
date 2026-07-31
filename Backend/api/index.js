require("dotenv").config();
const connectDB = require("../src/config/database");
const app = require("../src/app");

module.exports = async (req, res) => {
  try {
    await connectDB();
  } catch (err) {
    console.error("Database connection failed:", err);
    return res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
  return app(req, res);
};