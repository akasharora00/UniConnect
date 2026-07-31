const mongoose = require('mongoose');
const { applyTimestamps } = require('./user');
const User = require('./user');
const connectionRequestSchema=new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // creating reference to the user collection
        required: true,
    },
    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    status: {
        type: String,
        required: true,
        enum: { // enum means "Ye field sirf in values mein se ek hi value accept karegi."
            values: ["ignored", "interested", "accepted", "rejected"], // only these values are allowed
            message: '{VALUE} is incorrect' // if invalid values are given it will give the error
        }
    }
}, {
    timestamps: true,
});
 
// connectionRequest. find(fromUserId: 3124124124124124, toUserId: 14141)
connectionRequestSchema.index({fromUserId: 1, toUserId: 1}) //this make query very fast and easier to search

// "Before saving any ConnectionRequest document to MongoDB, run this function first "
connectionRequestSchema.pre("save", function(){
    const connectionRequest = this;
    // check if fromUserId is same as toUserId
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("u cant send req to urself")
        next();
    }
})

const ConnectionRequestModel = new mongoose.model(
    "ConnectionRequestModel", 
    connectionRequestSchema
)
 
module.exports=ConnectionRequestModel
