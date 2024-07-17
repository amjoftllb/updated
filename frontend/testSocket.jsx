import React, { useEffect } from 'react';
import io from 'socket.io-client';

const App = () => {
  useEffect(() => {
  
    const socket = io('http://localhost:8000');


    socket.on('connect', () => {
      console.log('Connected to socket server');
    });



    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h1>Socket Test Component</h1>
      <p>Check console for socket messages.</p>
    </div>
  );
};

export default App;
