const dotenv = require("dotenv");
dotenv.config({
  path: "./.env",
});

const http = require("http");
const socketIo = require("socket.io");
const connectDb = require("./src/db/connectDB.js");

const app = require("./app.js");
const Connection = require("./src/socketService/socketService.js");

const server = http.createServer(app);
const io = socketIo(server);

connectDb()
  .then(() => {
    server.listen(process.env.PORT || 8000, () => {
      console.log(`MONGO_DB_CONNECTED on port number ${process.env.PORT}`);

      io.on("connection", (socket) => {
        Connection.handleConnection(socket, io);
      });
    });
  })
  .catch((err) => {
    console.log("Mongo_db connection failed !!!! ", err);
  });
