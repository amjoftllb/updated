// src/components/MessageInput.js
import React, { useState } from 'react';

const MessageInput = ({ onSendMessage }) => {
    const [message, setMessage] = useState('');
    const handleSubmit = (e) => { e.preventDefault(); if (message.trim()) onSendMessage(message);setMessage('');};
    return (
        <form onSubmit={handleSubmit} className="flex items-center mt-2">
            <input
            type="text"
            className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={message}
            onChange={(e) => setMessage(e.target.value)} 
            placeholder="Type your message..." />
            <button type="submit" className="ml-2 p-2 bg-blue-500 text-white rounded-md">Send </button>
        </form>
    );
};
export default MessageInput;
