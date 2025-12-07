import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getUserForSidebar = async (req, res)=>{
    try {
        const Loguser = req.user._id;
        const allUser = await User.find({_id: {$ne: Loguser}}).select("-password");

        return res.status(200).json(allUser);
    } catch (error) {
        console.error("Error in getUser", error);
        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        });
    }
}

export const getMessage = async (req, res)=>{
    try {
        const senderId = req.user._id;
        const {id: receiverId} = req.params;
        const messages = await Message.find({
            $or:[
                {senderId, receiverId},
                {senderId: receiverId, receiverId: senderId}
            ],
        }).sort({createdAt: 1})

        return res.status(200).json({
            success: true,
            count: messages.length,
            data: messages
        });
    } catch (error) {
        console.error("Error in GetMessage",error);
        res.status(500).json({
            success: false,
            message:"Internal Server Error"
        });
    }
}

export const sendMessage = async (req, res)=>{
     try {
        const {text, image} = req.body;
        const {id: receiverId} = req.params;
        const senderId = req.user._id;

        if(!text || !image){
            return res.status(400).json({
                success: false,
                message:"Message cannot be empty"
            })
        }

        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image,{
                folder:"chat_images"
            });
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl || null
        });
           
        // todo: socket;

        return res.status(201).json({
            success: true,
            message: "Message sent sucessfully",
            data: newMessage
        });
     } catch (error) {
        console.error("Error in SendMessage controller", error);
        res.status(500).json({
            sucess: false, 
            message:"Internal Server Error"
        });
     }
}