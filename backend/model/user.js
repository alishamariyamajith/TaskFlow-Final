const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  role: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
   
  }
}, { timestamps: true, collection: 'users' });

const User = mongoose.model('User', userSchema);
module.exports = User;