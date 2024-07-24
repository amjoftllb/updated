import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:8000'); // Replace with your server URL

const Chat = ({ roomId, userId }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const messageEndRef = useRef(null);

  useEffect(() => {
    socket.emit('joinRoom', roomId);

    socket.on('messageReceived', (updatedRoom) => {
      const roomMessages = updatedRoom.messages;
      setMessages(roomMessages);
    });

    socket.on('messageRead', (updatedRoom) => {
      const roomMessages = updatedRoom.messages;
      setMessages(roomMessages);
    });

    return () => {
      socket.off('messageReceived');
      socket.off('messageRead');
    };
  }, [roomId]);

  const sendMessage = () => {
    socket.emit('sendMessage', { roomId, text, sender: userId });
    setText('');
  };

  const markMessageAsRead = (messageId) => {
    socket.emit('markMessageAsRead', { roomId, messageId, userId });
  };

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div>
      <div>
        {messages.map((message) => (
          <div key={message._id}>
            <strong>{message.sender}</strong>: {message.text}
            {message.readBy.some((rb) => rb.userId === userId && rb.isRead) && <span> (Read)</span>}
            <button onClick={() => markMessageAsRead(message._id)}>Mark as Read</button>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;
