const mongoose = require('mongoose')
const connectDB = async ()=>{
    await mongoose.connect(
        "mongodb+srv://uniconnect:test123@cluster0.9zq0msf.mongodb.net/UniConnect"
    )
}

module.exports = connectDB;