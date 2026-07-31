const express= require('express');
const profileRouter= express.Router();
const { userAuth } = require("../middlewares/auth")
const User = require("../models/user")
const {validateEditProfileData} = require("../utils/validation")


profileRouter.get("/profile/view", userAuth , async (req, res) => {
    try {
        const userr=req.user;
        res.send(userr)
    } catch (err) {
        res.status(500).send(err.message);
    }
});


profileRouter.patch("/profile/edit", userAuth, async(req, res)=>{
    try{
        if(!validateEditProfileData(req)){
            throw new Error("Invalid Edit Request")
        }
        // saving the details
        const loggedInUser=req.user;

        Object.keys(req.body).forEach((a)=>{
            loggedInUser[a]= req.body[a]
        })

        await loggedInUser.save();

        // res.send(loggedInUser.firstName+" Your profile updated")
        res.json({
            message:  loggedInUser.firstName +" Your profile updated",
            data: loggedInUser        
        })
        
    }
    catch(err){
        console.log(err);
        res.status(400).send("Error in editing data"+err.message)
    }
})

profileRouter.patch("/profile/password", userAuth, async(req, res)=>{
    try{
        const {password, newPassword} = req.body;
        const loggedInUser= req.user;
        //check current password
        const isPasswordValid= await loggedInUser.validatePassword(password);
        if (!isPasswordValid) {
            throw new Error("Current password is incorrect");
        }

        if(!validator.isStrongPassword(newPassword)){
            throw new Error("Enter Strong Password");
        }
        //Hash new password
        const passwordHash= await bcrypt.hash(newPassword, 10);
        loggedInUser.password = passwordHash;
        res.send("Password updated successfully");
    }
    catch(err){
        res.status(400).send("Error in Changing Password")
    }
})
module.exports = profileRouter;