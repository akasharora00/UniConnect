const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { userAuth } = require("./middlewares/auth");

app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://uni-connect-nu.vercel.app"
    ],
    credentials: true,
}));

app.use(express.json()); // middleware for converting json to javascript
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

app.post("/sendConnectionRequest", userAuth, (req, res) => {
  const userr = req.user;
  res.send(userr.firstName + " Sentt");
});

module.exports = app;