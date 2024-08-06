"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { socket } from '@/socket';

export default function ChatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const roomId = searchParams.get('roomId');
  const userId = searchParams.get('userId');

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (!roomId || !userId) {
      router.push('/');
      return;
    }

    // Fetch user data
    axios.post('/api/hellow', { userId })
      .then((response) => {
        setUser(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
        setLoading(false);
      });

    socket.emit('joinRoom', roomId, userId);

    const handleChatHistory = (room) => {
      setMessages(room.messages);
    };

    const handleMessageReceived = (updatedRoom) => {
      setMessages(updatedRoom.messages);
    };

    const handleMessageRead = (updatedRoom) => {
      setMessages(updatedRoom.messages);
    };

    socket.on('chatHistory', handleChatHistory);
    socket.on('messageReceived', handleMessageReceived);
    socket.on('messageRead', handleMessageRead);

    return () => {
      socket.off('chatHistory', handleChatHistory);
      socket.off('messageReceived', handleMessageReceived);
      socket.off('messageRead', handleMessageRead);
    };
  }, [roomId, userId, router]);

  const sendMessage = () => {
    if (text.trim()) {
      socket.emit('sendMessage', { roomId, text, sender: user.data });
      setText('');
    }
  };

  const markMessageAsRead = useCallback((messageId) => {
    if (user) {
      const message = messages.find((msg) => msg._id === messageId);
      if (message && message.sender !== user.data) {
        socket.emit('markMessageAsRead', { roomId, messageId, userId: user._id });
      }
    }
  }, [roomId, user, messages]);

  useEffect(() => {
    const messageIdsRead = new Set(); // To keep track of read messages

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const messageId = entry.target.getAttribute('data-id');
            if (messageId && !messageIdsRead.has(messageId)) {
              const message = messages.find((msg) => msg._id === messageId);
              if (message && message.sender !== user.data && !message.readBy.some((rb) => rb.userId === user._id && rb.isRead)) {
                markMessageAsRead(messageId);
                messageIdsRead.add(messageId); // Mark as read
              }
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    const messageElements = document.querySelectorAll('.message');
    messageElements.forEach((element) => observer.observe(element));

    return () => {
      messageElements.forEach((element) => observer.unobserve(element));
    };
  }, [messages, markMessageAsRead, user]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100">
      <div className="flex-1 overflow-y-auto p-4 mx-auto max-w-4xl w-full md:w-3/4 lg:w-2/3 xl:w-1/2">
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg h-full flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((message) => (
              <div
                key={message._id}
                data-id={message._id}
                className={`p-3 rounded-lg ${message.sender === user.data ? 'bg-blue-500 text-white self-end' : 'bg-gray-700 text-gray-300 self-start'}`}
              >
                <strong className="block text-sm mb-1">{message.sender === user.data ? "You" : message.sender}</strong>
                <p>{message.text}</p>
                {message.sender === user?.data && message.readBy.length > 0 && (
                  <span className="text-xs text-black ">(Read)</span>
                )}
              </div>
            ))}
            <div ref={messageEndRef} />
          </div>
          <div className="bg-gray-800 p-2 border-t border-gray-700">
            <div className="flex items-center">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-2 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={sendMessage}
                className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
