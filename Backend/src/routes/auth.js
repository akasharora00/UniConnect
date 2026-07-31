const express= require("express")
const authRouter= express.Router();
const User = require("../models/user")
const  {validateSignUpData}  = require("../utils/validation")
// const {getJWT} = require("../models/user")
const bcrypt = require('bcrypt')
const validator = require("validator");
//sign up api
authRouter.post("/signup", async(req, res )=>{  
    try{
        // validation of data
        validateSignUpData(req);
        // encrypt Password
        const {firstName, lastName, emailId, password} = req.body 
        const passwordHash= await bcrypt.hash(password,10)

        // create a new instance of user model
        const user= new User({
            firstName, lastName, emailId, password: passwordHash 
        });

        await user.save();
        res.send("User Added Successfully")
    }

    catch(err){
        res.status(404).send("Error got: "+err.message)
    }
})

// Login API
authRouter.post("/login", async(req, res)=>{
    try{
        const {emailId, password} = req.body;
        const user= await User.findOne({ emailId })
        if(!validator.isEmail(emailId)){
            return res.status(404).send("Enter valid Email");
        }
        if(!user){
            return res.status(404).send("Enter valid Email");
        }
        const isPasswordValid = await user.validatePassword(password);

        if(isPasswordValid){
            //create a JWT token (JSON web Token) header.payload.signature
            const token = await user.getJWT();

            //add the token to cookie and send response back to the user
            res.cookie("token", token, {
                expires: new Date (Date.now() + 8 * 3600000), // expire in 8 hours
            })
            res.send(user)
        }
        else{
            throw new Error("Password is not correct")
        }
        console.log("Login Email:", user.emailId);
console.log("Login User ID:", user._id);
        
    }catch(err){
        res.status(404).send("error in finding single user"+ err.message)
    }
})

// Logout API
authRouter.post("/logout", async(req, res)=>{
    res.cookie("token", null, {
        expires: new Date(Date.now())
    })
    res.send();
})

module.exports=authRouter;