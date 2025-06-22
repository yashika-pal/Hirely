import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";

const getSocketId = (receiverId, req) => {
  const userSocketMap = req.app.get("userSocketMap");
  const socketId = userSocketMap[receiverId];
  return socketId;
};

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;
    const { message } = req.body;
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }
    await conversation.save();

    const populatedMessage = await Message.findById(newMessage._id)
      .populate("senderId", "fullname email profile")
      .populate("receiverId", "fullname email profile");

    // SOCKET IO
    const receiverSocketId = getSocketId(receiverId, req);
    if (receiverSocketId) {
      const io = req.app.get("socketio");
      io.to(receiverSocketId).emit("newMessage", populatedMessage);
    }

    return res.status(201).json(populatedMessage);
  } catch (error) {
    console.log("Error in sendMessage:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate({
      path: "messages",
      populate: [
        { path: "senderId", select: "fullname email profile" },
        { path: "receiverId", select: "fullname email profile" },
      ],
    });

    if (!conversation) return res.status(200).json([]);

    return res.status(200).json(conversation.messages);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getConversations = async (req, res) => {
  try {
    const userId = req.id;
    const conversations = await Conversation.find({
      participants: { $in: [userId] },
    })
      .populate({
        path: "participants",
        select: "fullname email profile",
      })
      .populate({
        path: "messages",
        options: { sort: { createdAt: -1 }, limit: 1 },
      })
      .sort({ updatedAt: -1 });

    return res.status(200).json(conversations);
  } catch (error) {
    console.error("Error in getConversations:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
