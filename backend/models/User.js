const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['binary', 'numeric'],
    required: true
  },
  completedDates: [{
    date: { type: Date, required: true },
    count: { type: Number, default: 1 }
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