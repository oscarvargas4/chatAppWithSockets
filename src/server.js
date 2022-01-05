const express = require('express');
require('./db/mongoose');
const http = require('http');
const mongoose = require('mongoose');
const path = require('path');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require('./utils/users');

// ! Drop Database
mongoose.connection.dropDatabase().then();

const app = express();
app.use(express.json());
const server = http.createServer(app);
const io = socketio(server);

const botName = 'ChatCord Bot';

// Set static folder
app.use(express.static(path.join(__dirname, '../public')));

// Run when client connects
io.on('connection', (socket) => {
  // Join Room
  socket.on('joinRoom', async ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    const users = await getRoomUsers(user.room);

    socket.join(user.room);

    // Welcome when a user connects
    socket.emit(
      'message',
      formatMessage(
        botName,
        `${user.username} Welcome to ChatCord ${user.room}!`
      )
    );

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage(botName, `${user.username} has joined the chat`)
      );

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users,
    });
  });

  // Listen for chatMessage
  socket.on('chatMessage', async (msg) => {
    const user = await getCurrentUser(socket.id);

    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  // Runs when client disconnects
  socket.on('disconnect', async () => {
    const user = await userLeave(socket.id);
    const users = await getRoomUsers(user.room);
    io.to(user.room).emit(
      'message',
      formatMessage(botName, `${user.username} user has left the chat`)
    );

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users,
    });
  });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
