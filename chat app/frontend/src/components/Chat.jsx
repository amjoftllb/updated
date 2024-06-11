// src/components/Chat.js
import React, { useEffect, useState } from 'react';
import socketIo from 'socket.io-client';
import Message from './Message.jsx';
import MessageInput from './MessageInput.jsx';

const ENDPOINT = "http://localhost:8000/";
const socket = socketIo(ENDPOINT, { transports: ["websocket"] });

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
    socket.on('chat message', (msg) => {setMessages((prevMessages) => [...prevMessages, msg]);});
    socket.on('user id', (id) => {setUserId(id);});

    return () => {socket.off('chat message');socket.off('user id');};
    }, []);

    const handleSendMessage = (message) => {socket.emit('chat message', message);};
    return (
        <div className="flex flex-col h-screen p-4 bg-gray-100">
            <div className="flex-1 overflow-y-auto">{messages.map((msg, index) => (<Message key={index} message={msg.text} isOwnMessage={msg.userId === userId}/>))}</div>
            <MessageInput onSendMessage={handleSendMessage} />
        </div>
    );
};

export default Chat;
