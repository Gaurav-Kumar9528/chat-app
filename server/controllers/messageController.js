import Message from "../models/message.js";
import User from "../models/user.js";
import cloudinary from "../lib/cloudinary.js";
import { io, userSocketMap } from "../server.js";

// Get all users except the logged in user
export const getUsersForSidebar = async (req, res)=>{
    try {
        const userId = req.user._id;
        const filteredUsers = await User.find({_id: {$ne: userId}}).select
        ("-password");   
        
        // Count number of message not seen
        const unseenMessages = {}
        const promises = filteredUsers.map(async (user)=>{
            const messages = await Message.find({senderId: user._id, receiverId: userId, seen: false})
            if(messages.length > 0){
                unseenMessages[user._id] = messages.length;
            }
        })
        await Promise.all(promises);
        res.json({success: true, users: filteredUsers, unseenMessages})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// Get all messages for selected user
export const getMessages = async (req, res) =>{
    try {
        const { id: selectedUserId } = req.params;
        const myId = req.user._id;

        // Check if receiver exists
        const receiver = await User.findById(selectedUserId);
        if(!receiver){
            return res.json({success: false, message: "User not found"})
        }

        const messages = await Message.find({
            $or: [
                {senderId: myId, receiverId: selectedUserId},
                {senderId: selectedUserId, receiverId: myId},
            ]
        }).sort({createdAt: 1});
        
        await Message.updateMany({senderId: selectedUserId, receiverId: myId}, {seen: true});
        
        res.json({success: true, messages})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// api to mark message as seen using message id
export const markMessageAsSeen = async (req, res)=>{
    try {
        const { id } = req.params;
        await Message.findByIdAndUpdate(id, {seen: true})
        res.json({success: true})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})  
    }
}

// Send message to selected user
export const sendMessage = async (req, res) =>{
    try {
        const {text, image} = req.body;
        const receiverId = req.params.id;
        const senderId = req.user._id;

        // Validate that either text or image is provided
        if(!text && !image){
            return res.json({success: false, message: "Message text or image is required"})
        }

        // Check if receiver exists
        const receiver = await User.findById(receiverId);
        if(!receiver){
            return res.json({success: false, message: "Receiver not found"})
        }

        // Validate text length if provided
        if(text && text.trim().length === 0){
            return res.json({success: false, message: "Message cannot be empty"})
        }

        let imageUrl;
        if(image){
            try {
                const uploadResponse = await cloudinary.uploader.upload(image)
                imageUrl = uploadResponse.secure_url;
            } catch (uploadError) {
                console.log("Cloudinary upload error:", uploadError.message);
                return res.json({success: false, message: "Failed to upload image"})
            }
        }
        
        const newMessage =  await Message.create({
            senderId,
            receiverId,
            text: text?.trim() || undefined,
            image: imageUrl
        })
        
        // Emit the new message to the receiver's socket
        const receiverSocketId = userSocketMap[receiverId];
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage)
        }

        res.json({success: true, newMessage});

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})  
    }
}