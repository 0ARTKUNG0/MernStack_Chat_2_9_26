const Message = require("../model/message.model");
const User = require("../model/user.model");
const cloudinary = require("../config/cloudinary.config");

const getUsersForSidebar = async (req, res) => {
    try{
        //get all users except the logged in user
        const loggedInUserId = req.user._id;
        //filter out the logged in user
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
        res.status(200).json(filteredUsers);
    }catch(error){
        console.log(error);
        res.status(500).json({message: "Internal server error while fetching users"});
    }
}

const sendMessage = async (req, res) => {
    try{
        const {id: recipientId} = req.params;
        if(!recipientId){
            return res.status(400).json({message: "Recipient ID is required"});
        }
        const senderId = req.user._id;
        const {text, file} = req.body;
        if(!text && !file){
            return res.status(400).json({message: "Message is empty"});
        }
        let fileUrl = null;
        if(file){
            const uploadResponse = await cloudinary.uploader.upload(file);
            fileUrl = uploadResponse.secure_url;
        }
        const newMessage = new Message({
            senderid: senderId,
            recipientid: recipientId,
            text,
            file: fileUrl
        });
        await newMessage.save();
        res.json(newMessage);
    }catch(error){
        console.log(error);
        res.status(500).json({message: "Internal server error while sending message"});
    }
}

const getMessages = async (req, res) => {
    try{
        const myId = req.user._id;
        const {id: userToChatId} = req.params;
        const messages = await Message.find({
            $or: [
                {senderid: myId, recipientid: userToChatId},
                {senderid: userToChatId, recipientid: myId}
            ]
        });
        res.json(messages);
    }catch(error){
        console.log(error);
        res.status(500).json({message: "Internal server error while getting messages"});
    }
}

const messageController = {
    getUsersForSidebar,
    sendMessage,
    getMessages
}

module.exports = messageController;