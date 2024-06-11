// src/components/Message.js
import React from 'react';

const Message = ({ message, isOwnMessage }) => {
    return (
        <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`p-3 rounded-lg shadow-md ${isOwnMessage ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>{message}</div>
        </div>
    );
};

export default Message;
