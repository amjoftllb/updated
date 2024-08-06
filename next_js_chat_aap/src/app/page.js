
"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { io } from 'socket.io-client';

export default function WelcomePage() {
  const [roomId, setRoomId] = useState('');
  const [userId, setUserId] = useState('');
  const router = useRouter();

  const handleJoinClick = () => {
    if (roomId && userId) {
      router.push(`/chatPage?roomId=${roomId}&userId=${userId}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Welcome to the Chat App</h1>
      <div className="w-full max-w-md p-4 bg-white shadow-md rounded">
        <div className="mb-4">
          <label className="block text-gray-700">Room ID</label>
          <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="mt-1 block w-full border-gray-500 rounded-md shadow-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">User ID</label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="mt-1 block w-full border-gray-500 rounded-md shadow-sm"
          />
        </div>
        <button
          onClick={handleJoinClick}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Join Chat
        </button>
      </div>
    </div>
  );
}


