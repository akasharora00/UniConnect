const validator= require('validator')
const validateSignUpData = (req) =>{
    const {firstName, lastName, emailId, password} = req.body;
    if(!firstName || !lastName){
        throw new Error("Name is invalid");
    }
    if(!validator.isEmail(emailId)){
        throw new Error("Email is invalid");
    }
    // if(!validator.isStrongPassword(password)){
    //     throw new Error("Password is weak");
    // }
    return true;
}

const validateEditProfileData = (req)=>{
    const allowedEditFields = ["emailId", "gender", "photoUrl", "age", "about", "skills"];
    const isEditAllowed= Object.keys(req.body).every((a)=>(
        allowedEditFields.includes(a)
    ))
    return isEditAllowed
}
module.exports = {validateSignUpData, validateEditProfileData};
