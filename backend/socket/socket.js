import { Server } from "socket.io";
import http from "http";
import express from "express";
import Message from "../models/messageModel.js";
import Conversation from "../models/ConversationModel.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

const userSocketMap = {} //userId : socketId

export const getRecipientSocketId = (recipientId) => {
    return userSocketMap[recipientId]
}

io.on("connection", (socket) => {
    console.log("User connected ", socket.id);
    const userId = socket.handshake.query.userId // to get userId from fe

    if (userId != "undefined") userSocketMap[userId] = socket.id
    io.emit("getOnlineUsers", Object.keys(userSocketMap)) //Object.keys(userSocketMap) to send array of userId

    socket.on("MarkMessageAsSeen",async({conversationId,userId})=>{
        try {

            await Promise.all([
                Message.updateMany({conversationId:conversationId,seen:false},{$set:{seen:true}}),
                Conversation.updateOne({_id:conversationId},{$set:{"lastMessage.seen":true}}),
            ]);
           io.to(userSocketMap[userId]).emit("messageSeen",{conversationId})
        } catch (error) {
            console.log(error)
        }
    })

    socket.on("disconnect", () => {
        console.log("User disconnected ", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    });
});

export { io, app, server };
