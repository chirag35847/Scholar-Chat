const mongoose = require('mongoose');

// Id of the sender
// Content of the message
// The Chat which it belong to

const messageModel = mongoose.Schema(
    {
        sender:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        },
        content:{
            type:String,
            trim:true,
        },
        chat:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Chat",
        }
    },
    {
        timestamps:true,
    }
);

const Message = mongoose.model('Message',messageModel);

module.exports = Message;