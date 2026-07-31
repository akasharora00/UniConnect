require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/database");

connectDB()
  .then(() => {
    console.log("Database connected successfully");

    app.listen(4000, () => {
      console.log("Server running on port 4000");
    });
  })
  .catch((err) => {
    console.error(err);
  });