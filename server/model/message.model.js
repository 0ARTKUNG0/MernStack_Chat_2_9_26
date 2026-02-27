const mongoose = require("mongoose");
const {Schema, model} = mongoose;

const messageSchema = new Schema({
    text: {
        type: String,
    },
    file: {
        type: String,
    },
    senderid: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    recipientid: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
},{
    timestamps: true
});

const Message = model("Message", messageSchema);
module.exports = Message;
