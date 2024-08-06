import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import ChatRoom from "./src/models/chatRoom.js";
import User from "./src/models/User.js";
import dbConnect from "./src/config/dbConnect.js";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log("User connected");

    socket.on("joinRoom", async (roomId, userId) => {
      await dbConnect();

      try {
        let room = await ChatRoom.findOne({ roomId });

        if (!room) {
          room = await ChatRoom.create({ roomId });
        }

        let user = await User.findOne({ userId });
        if (!user) {
          user = await User.create({ userId });
        }

        const isMember = room.members.includes(user._id);
        if (!isMember) {
          room.members.push(user._id);
          await room.save();
        }

        socket.join(roomId);
        socket.emit("chatHistory", room);
      } catch (error) {
        console.error("Error in joinRoom:", error);
      }
    });

    socket.on("sendMessage", async (data) => {
      const { roomId, text, sender } = data;

      try {
        const message = {
          text,
          sender,
          readBy: [],
        };

        const updatedRoom = await ChatRoom.findOneAndUpdate(
          { roomId },
          { $push: { messages: message } },
          { new: true }
        );

        if (updatedRoom) {
          io.to(roomId).emit("messageReceived", updatedRoom);
        } else {
          console.error("Room not found:", roomId);
        }
      } catch (error) {
        console.error("Error in sendMessage:", error);
      }
    });

    socket.on("markMessageAsRead", async (data) => {
      const { roomId, messageId, userId } = data;

      try {
        const room = await ChatRoom.findOne({ roomId });
        if (!room) return;

        const message = room.messages.id(messageId);
        if (!message || message.sender.toString() === userId) return; // Don't update if sender is the same as user

        // Check if the user has already marked this message as read
        const alreadyRead = message.readBy.some((rb) => rb.userId === userId);
        if (!alreadyRead) {
          message.readBy.push({ userId, isRead: true, readAt: new Date() });
          await room.save();

          io.to(roomId).emit("messageRead", room);
        }
      } catch (error) {
        console.error("Error in markMessageAsRead:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
