const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");

const userRouter = express.Router();
const User = require("../models/user");
const saferData = "firstName lastName photoUrl skills about age gender";

// Get all pending connection requests for logged in user
userRouter.get("/user/request/recieved", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", saferData);

    res.json({
      message: "Data fetched",
      data: connectionRequests,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

// Get all active connections for logged in user
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    
    const connectionRequests = await ConnectionRequestModel.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", saferData)
      .populate("toUserId", saferData);

    const data = connectionRequests
      .map((a) => {
        if (!a.fromUserId || !a.toUserId) return null;
        if (a.fromUserId._id.toString() === loggedInUser._id.toString()) {
          return a.toUserId;
        }
        return a.fromUserId;
      })
      .filter(Boolean);

    res.json({ message: "fetched successfully", data });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

// Feed API to view profiles to connect with
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    // Pagination
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    // Find connection requests (sent or received)
    const connectionRequests = await ConnectionRequestModel.find({
      $or: [
        { fromUserId: loggedInUser._id }, // sent
        { toUserId: loggedInUser._id }, // received
      ],
    }).select("fromUserId toUserId");

    const hideUserFromUser = new Set();
    connectionRequests.forEach((a) => {
      if (a.fromUserId) hideUserFromUser.add(a.fromUserId.toString());
      if (a.toUserId) hideUserFromUser.add(a.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserFromUser) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(saferData)
      .skip(skip)
      .limit(limit);

    res.send(users);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = userRouter;