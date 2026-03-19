const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const Message = require("../models/message");
const Channel = require("../models/channel");

const onlineUsers = new Map();

function initSocket(server) {

  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  // 🔐 Socket authentication
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) return next(new Error("No token"));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {

    console.log("User connected:", socket.user.id);

    // 🟢 Track online users
    onlineUsers.set(socket.user.id, socket.id);
    io.emit("onlineUsers", Array.from(onlineUsers.keys()));

    //Join channel
    socket.on("joinChannel", (channelId) => {
      socket.join(channelId);
    });

    socket.on("typing", ({ channelId }) => {

      socket.to(channelId).emit("userTyping", {
        userId: socket.user.id
      });
    
    });

    //Send message
    socket.on("sendMessage", async ({ channelId, content }) => {

        console.log("Received sendMessage:", channelId, content);
      
        if (!mongoose.Types.ObjectId.isValid(channelId)) {
          console.log("Invalid channel id");
          return;
        }
      
        const channel = await Channel.findById(channelId).populate("server");
        console.log("Channel found:", channel?.name);
      
        if (!channel) return;
      
        const isMember = channel.server.members.find(
          (m) => m.user.toString() === socket.user.id
        );
      
        console.log("Is member:", isMember);
      
        if (!isMember) return;
      
        console.log("Saving message...");
      
        const message = await Message.create({
          content,
          sender: socket.user.id,
          channel: channelId,
        });
      
        console.log("Message saved:", message._id);
      
        io.to(channelId).emit("receiveMessage", message);
      });

    //Disconnect
    socket.on("disconnect", () => {

      onlineUsers.delete(socket.user.id);

      io.emit("onlineUsers", Array.from(onlineUsers.keys()));

      console.log("User disconnected");

    });

  });

}

module.exports = initSocket;