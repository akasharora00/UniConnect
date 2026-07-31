require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/database");

const port = process.env.PORT || 4000;

connectDB()
  .then(() => {
    console.log("Database connected successfully");

    app.listen(port, () => {
      console.log("Server running on port " + port);
    });
  })
  .catch((err) => {
    console.error(err);
  });