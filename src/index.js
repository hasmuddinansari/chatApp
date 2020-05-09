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

//add users and removeusers methods

const {
  addUser,
  getUsersInRoom,
  removeUser,
  getUser,
} = require("./utills/users");

io.on("connection", (socket) => {
  console.log("socket.io is connected with server");
  socket.on("join", ({ username, room }, callback) => {
    let { error, user } = addUser({ id: socket.id, username, room });
    // if there is any error dont proceed
    if (error) {
      return callback(error);
    }
    // else let user allow to join
    socket.join(user.room);

    socket.emit(
      "message",
      generateMessage(`welcome ${user.username}`, "Admin")
    );

    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        generateMessage(`${user.username} has joined`),
        user.username
      );

    //accesss all rooms users
    io.to(user.room).emit("dataRoom", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    callback();
  });

  socket.on("sendMessage", (message, callback) => {
    let user = getUser(socket.id);
    io.to(user.room).emit("message", generateMessage(message, user.username));
    callback();
  });

  socket.on("disconnect", () => {
    let user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        generateMessage(`${user.username} left!`)
      );
      io.to(user.room).emit("dataRoom", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
});

server.listen(port, () => {
  console.log(`express is running on port:${port}`);
});
