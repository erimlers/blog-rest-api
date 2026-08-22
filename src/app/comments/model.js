const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post",
        required:true,
        index: true
    },
    parentComment:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment",
        default:null,
        index: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
},{collection:"comments",timestamps:true});

const Comment = mongoose.model("Comment",commentSchema);

module.exports = Comment;
