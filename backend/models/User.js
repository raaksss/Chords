
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  spotifyAccessToken: String,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
