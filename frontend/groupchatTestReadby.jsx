import React, { useState, useEffect, useRef, useCallback } from 'react';
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

  const markMessageAsRead = useCallback((messageId) => {
    socket.emit('markMessageAsRead', { roomId, messageId, userId });
  }, [roomId, userId]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const messageId = entry.target.getAttribute('data-id');
            const message = messages.find((msg) => msg._id === messageId);

            // Check if the message has already been read by the current user
            if (message && !message.readBy.some((rb) => rb.userId === userId && rb.isRead)) {
              markMessageAsRead(messageId);
            }
          }
        });
      },
      { threshold: 0.1 } // Adjust this threshold as needed
    );

    const messageElements = document.querySelectorAll('.message');
    messageElements.forEach((element) => observer.observe(element));

    return () => {
      messageElements.forEach((element) => observer.unobserve(element));
    };
  }, [messages, markMessageAsRead, userId]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div>
      <div>
        {messages.map((message) => (
          <div key={message._id} data-id={message._id} className="message">
            <strong>{message.sender === userId ? "You" : message.sender}</strong>: {message.text}
            {message.sender === userId && message.readBy.length > 0 && (
              <span> (Read)</span>
            )}
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
