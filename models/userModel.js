const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'You must provide username'],
    unique: [true, 'Ta nazwa użytkownika została już wykorzystana'],
  },

  password: {
    type: String,
    required: [true, 'You must provide password'],
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
