const mongoose= require("mongoose")
const validator= require("validator")
const bcrypt = require("bcrypt"); 
const jwt = require("jsonwebtoken");

//Schema
const userSchema = new mongoose.Schema({
    firstName: {
        index: true, // this is index
        type: String,
        required: true, //make sure this must be filled
    },
    lastName: {
        type: String,
    },
    emailId: {
        type: String,
        lowercase: true,
        required: true,
        unique: true, //no duplicate email are applied
        trim: true, // remove extra spaces
        validate(value){
            if(!validator.isEmail(value)){
                throw new error("Invalid email")
            }
        }

    },
    password: {
        type: String,
        required: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Weak Password")
            }
        }
    },
    mobileNum:{
        type: Number,
        // required: true,
        minLength: 10,
    },
    age: {
        type: Number,
        minLength: 2,
        min: 18,
        max: 50,
    },
    gender: {
        type: String,
        enum: {
            values: ["male", "female", "others"],
            message: '{VALUE} is not a valid gender type'
        },
        // validate(value){ //on patch it will not work but on put it will work  
        //     if(!["male", "female", "other"].includes(value)){
        //         throw new Error("Gender data is invalid")
        //     }
        // }
    },
    photoUrl: {
        type: String,
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("invalid photo URL")
            }
        }
    },
    about: {
        type: String,
        default: "" //already filled there
    },
    skills:{
        type: [String]
    }
}, {
    timestamps: true
})
// helper function for creating the token

userSchema.index({firstName: 1, lastName: 1})

userSchema.methods.getJWT = async function(){ //always use simple function do not use arrow function
    const user=this;
    const token=jwt.sign(
        {_id: this._id}, 
        "akash@123", 
        {expiresIn: "1d"}
    )
    return token;
}

userSchema.methods.validatePassword = async function(passwordInputByUser){
    const user=this;
    const passwordHash=user.password
    const isPasswordValid=await bcrypt.compare(passwordInputByUser, passwordHash)
    return isPasswordValid;  
}


const User = mongoose.model("User", userSchema) // name of the model, schema
module.exports = User;