let users = {};
const handleConnection = (socket, io) => {
    users[socket.id] = { id: socket.id };
    socket.emit('user id', socket.id);
    socket.on('chat message', (message) => {io.emit('chat message', { text: message, userId: socket.id });});
    socket.on('disconnect', () => {delete users[socket.id];});
};
module.exports = {handleConnection};
