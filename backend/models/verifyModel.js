const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const verifyModel = mongoose.Schema(
    {
        userId:{
            type:Schema.Types.ObjectId,
            required:true,
            ref:"User",
            unique:true,
        },
        token:{
            type:String,
            required:true,
        },
        createdAt:{
            type:Date,
            default:Date.now(),
            expires:3600,
        },
    }
);

const VerifyToken = mongoose.model('VerifyToken',verifyModel);
module.exports=VerifyToken;