const User = require('../models/User');

// ! All commented statements are for the chatapp functionality without mongoose
// const users = [];

// Join user to chat
const userJoin = (id, username, room) => {
  // const user = { id, username, room };
  // users.push(user);
  const user = new User({ id, username, room });
  user.save((err) => {
    if (err) return console.log(err);
  });

  return user;
};

// Get current user
const getCurrentUser = async (id) => {
  // return users.find((user) => user.id === id);
  const user = await User.findOne({ id }).exec();
  return user;
};

// User leaves chat
const userLeave = async (id) => {
  // const index = users.findIndex((user) => user.id === id);

  // if (index !== -1) {
  //   return users.splice(index, 1)[0];
  // }

  const user = await User.findOneAndRemove({ id });

  return user;
};

// Get room users
const getRoomUsers = async (room) => {
  // return users.filter((user) => user.room === room);
  const users = await User.find({ room });
  // ! exec.() no me hacia devolver una array vacía cuando solo había un elemento
  return users;
};

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
};
