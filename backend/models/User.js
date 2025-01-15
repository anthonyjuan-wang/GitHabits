const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  completedDates: [{
    type: Date
  }]
}, {
  timestamps: true
});

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true
  },
  habits: [habitSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema); 