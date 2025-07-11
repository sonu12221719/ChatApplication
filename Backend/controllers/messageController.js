import User from '../models/UserModel.js';
import { Message } from '../models/MessageModel.js';
import { Chat } from '../models/ChatModel.js';

export const sendMessage = async (req,res)=>{
    try {
        const {message} = req.body;
        const {id:receiverId}=req.params;
        const senderId = req.user.id;

        let chat = await Chat.findOne({
            participants:{$all: [senderId, receiverId]}
        })

        if(!chat){
            chat = await Chat.create({
                participants:[senderId,receiverId]
            })
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            messages:message
        })

        if(newMessage){
            await newMessage.save();
            chat.messages.push(newMessage._id);
            await chat.save();
            res.status(201).json({message:"message send successfully"});
        }


        
    } catch (error) {
        console.log("Message not send " + error);
        res.status(500).json({message:'Internal Server error'})
    }
}

export const getMessage = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    const chat = await Chat.findOne({
        participants: { $all: [senderId, receiverId] },
        })
        .populate({
            path: "messages",
            options: { sort: { createdAt: 1 } },
        })
        .populate("participants", "name email"); // ✅ populate user info

        if (!chat) {
            return res.status(200).json({ message: "No message found", messages: [] });
        }

        console.log(chat);
        
        res.status(200).json({
        messages: chat.messages,
        participants: chat.participants,
        chatId: chat._id,
        });
    } catch (error) {
        console.error("Internal server error", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const getAllChats = async (req,res)=>{
    const userId = req.user._id;
    try {
        const chats = await Chat.find({
            participants: userId,
        })
        .populate('participants', '-password') // populate participant user data excluding password
        .populate({
            path: 'messages',
            select: 'senderId receiverId messages createdAt',
        }).sort({updatedAt: -1});

        res.status(200).json(chats);
    } catch (error) {
        console.error('Error fetching chats:', error.message);
        res.status(500).json({ message: 'Failed to fetch chats' });
    }
}

