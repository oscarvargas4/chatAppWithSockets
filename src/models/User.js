const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: String,
  username: String,
  room: String,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
