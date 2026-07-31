const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");

const userRouter = express.Router();
const User = require('../models/user');
const saferData= "firstName lastName photoUrl skills about photoUrl"
// Get all pending connection requests for logged in user
userRouter.get("/user/request/recieved", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequestModel.find({
            toUserId: loggedInUser,
            status: "interseted",
        // }).populate("fromUserId", ["firstName", "lastName"])
        }).populate("fromUserId", saferData )
        res.json({
            message: "Data fetched",
            data: connectionRequests,
        });

    } catch (err) {
        res.status(404).send("ERROR: " + err.message);
    }
});

userRouter.get("/user/connections", userAuth, async (req, res)=>{
    try{
        const loggedInUser=req.user
        const connectionRequests= await ConnectionRequestModel.find({
            $or: [
                {toUserId: loggedInUser._id, status: "accepted"},
                {fromUserId: loggedInUser._id, status: "accepted"},
            ]
        }).populate("fromUserId", saferData )
          .populate("toUserId", saferData )

        const data= connectionRequests.map((a)=>{
            if(a.fromUserId._id.toString()===loggedInUser._id.toString()){
                a.toUserId
            }
            a.fromUserId
        })

        res.json({message: "fetched succesfull", data})  
    }catch(e){
        res.status(404).send("ERROR: "+ err.message)
    }
})

userRouter.get("/feed", userAuth, async (req, res)=>{
    try{
        //user should see the other user cards except its own card
        //his connection card
        //allready sent the connection request
        //ignored people
        //if rahul rejects me i wont see rahul in my feed

        const loggedInUser= req.user

        // Pagination
        // : = params and ?&: params
        const page=parseInt(req.query.page) || 1
        let limit=parseInt(req.query.limit) || 10
        limit = limit>50?  50: limit;
        const skip= (page-1) *limit
        
        // find connection request (send or recieved)
        const connectionRequests= await ConnectionRequestModel.find({
            $or: [
                {fromUserId: loggedInUser._id}, //send 
                {toUserId: loggedInUser._id} // recieve
            ],
        }). select("fromUserId toUserId")

        const hideUserFromUser= new Set()
        connectionRequests.forEach((a)=>{
            hideUserFromUser.add(a.fromUserId.toString())
            hideUserFromUser.add(a.toUserId.toString())
        })

        const users= await User.find({
           $and: [
            {_id: {$nin: Array.from(hideUserFromUser)}},
            {_id: {$ne: loggedInUser._id}}
           ]
        }).select(saferData).skip(skip).limit(10)

        res.send(users)

    }catch(err){
        res.status(404).json({message: err.message})
    }
})

module.exports = userRouter;