const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");

// Sign Up API
authRouter.post("/signup", async (req, res) => {
  try {
    // validation of data
    validateSignUpData(req);
    // encrypt Password
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    // create a new instance of user model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save();
    res.send("User Added Successfully");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

// Login API
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    
    if (!validator.isEmail(emailId)) {
      return res.status(400).send("Enter valid Email");
    }

    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(400).send("Enter valid Email");
    }

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(400).send("Password is not correct");
    }

    //create a JWT token (JSON web Token)
    const token = await user.getJWT();

    //add the token to cookie and send response back to the user
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000), // expire in 8 hours
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    console.log("Login Email:", user.emailId);
    console.log("Login User ID:", user._id);

    res.send(user);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

// Logout API
authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  res.send("Logout successful!");
});

module.exports = authRouter;