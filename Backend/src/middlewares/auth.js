const jwt = require("jsonwebtoken")
const User= require('../models/user')
const userAuth = async (req, res, next)=>{
    try{
        //read the token from the request
        const {token}= req.cookies;
        if(!token){
             return res.status(401).send("Please Login");
        }
        //validate the token  
        const decodedData = await jwt.verify(token, "akash@123");
        const {_id}= decodedData
        const user = await User.findById(_id);
        if(!user){
            throw new Error("User Not found");
        }
        req.user= user;
        next() //to move to the next handeler();
        //find the user 
    }
    catch(err){
        res.status(404).send("Error User not found");
    }
}
module.exports={
    userAuth
}