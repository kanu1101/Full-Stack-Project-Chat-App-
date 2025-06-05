import User from "../models/user.model.js"
import Message from "../models/message.model.js"

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggenInUserId = req.user._id;
        const filteredUsers = User.find({_id : {$ne : loggenInUserId}}).select("-password")
        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log("error in getUserForSidebar controller", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const getMessages = async (req, res) => {
    try {
        const {id: userToChatId} = req.params;
        const myId = req.user._id;
        const messages = await Message.find({
            $or: [
                {senderId: myId, receiverId: userToChatId},
                {senderId: userToChatId, receiverId: myId},
            ]
        })
        res.status(200).json(messages);
    } catch (error) {
        console.log("error in getMessages controller", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const sendMessages = async (req, res) => {
    try {
        const {text, image} = req.body;

        const {id: receiverId} = req.params;
        const myId = req.user._id;

        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }
        const newMessage = new Message({
            senderId: myId, 
            receiverId,
            text, 
            image: imageUrl,
        });

        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        console.log("error in sendMessages controller", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}