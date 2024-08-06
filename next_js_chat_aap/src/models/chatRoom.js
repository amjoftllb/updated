import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  text: {
    type: String,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  readBy: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },
  }],
}, { timestamps: true });

const chatRoomSchema = new mongoose.Schema({
  roomId: {
    type: String,
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  messages: [messageSchema],
}, { timestamps: true });


const ChatRoom = mongoose.models.ChatRoom || mongoose.model('ChatRoom', chatRoomSchema);
export default ChatRoom;

