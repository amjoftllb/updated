    socket.on('joinRoom', (roomId) => {
      socket.join(roomId);
      console.log(`User joined room: ${roomId}`);
  });

  socket.on('offer', (offer, roomId) => {
      socket.to(roomId).emit('offer', offer);
  });

  socket.on('answer', (answer, roomId) => {
      socket.to(roomId).emit('answer', answer);
  });

  socket.on('ice-candidate', (candidate, roomId) => {
      socket.to(roomId).emit('ice-candidate', candidate);
  });
