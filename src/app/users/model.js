const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    name:{
        type:String,
        required:true,
        trim:true
    },
    lastname:{
        type:String,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    password:{
        type:String,
        required:true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    profileImage:{
        type:String,
        default:null
    }
},{collection:"users",timestamps:true});

const User = mongoose.model("User",userSchema);

module.exports = User;
