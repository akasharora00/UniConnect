const express = require("express")
const app = express()
const connectDB= require("./config/database")
const bcrypt = require('bcrypt')
const validateSignUpData = require("./utils/validation")
const validator= require('validator')
const cookieParser= require('cookie-parser')
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth")
const {getJWT} = require("./models/user")
const cors = require("cors");

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))  

app.use(express.json()); // middleware for converting json to javascript
app.use(cookieParser())

const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/requests")
const userRouter = require("./routes/user")

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter)


app.post("/sendConnectionRequest", userAuth ,(req, res)=>{
    const userr= req.user;
    res.send(userr.firstName+ " Sentt")
})



connectDB().then(()=>{
    console.log("database connected successfull");
    app.listen(4000, () => {
        console.log("Server is successfully running.");
    });
  }).catch((err)=>{
    console.error("Database failed");
})