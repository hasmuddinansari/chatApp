/** @format */

const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
//port for enviroment and localhost
const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const publicDirPath = path.join(__dirname, "../public");

app.use(express.static(publicDirPath));

//generate mesg

const { generateMessage } = require("./utills/messages");

io.on("connection", (socket) => {
  console.log("socket.io is connected with server");
  socket.on("join", ({ username, room }) => {
    socket.join(room);
    socket.emit("message", generateMessage("welcome"));
    socket.broadcast
      .to(room)
      .emit("message", generateMessage(`${username} has joined`));
  });

  socket.on("sendMessage", (message, callback) => {
    io.emit("message", generateMessage(message));
    callback();
  });

  socket.on("disconnect", () => {
    io.emit("message", generateMessage("A user has disconnected !"));
  });
});

server.listen(port, () => {
  console.log(`express is running on port:${port}`);
});
