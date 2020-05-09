/** @format */

//user list
const users = [];
//add a new user
const addUser = ({ id, username, room }) => {
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();
  //details ot provided
  if (!username || !room) {
    return { error: "Username and room are required" };
  }

  //existense of user

  const existUser = users.some((user) => {
    return user.username === username;
  });

  if (existUser) {
    return {
      error: "Username is in use!",
    };
  }

  const user = { id, username, room };
  users.push(user);
  return { user };
};

// get user by id

const getUser = (id) => {
  return users.find((user) => user.id === id);
};

const getUsersInRoom = (room) => {
  room = room.trim().toLowerCase();
  return users.filter((user) => user.room === room);
};

const removeUser = (id) => {
  let index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

module.exports = {
  addUser,
  removeUser,
  getUsersInRoom,
  getUser,
};
