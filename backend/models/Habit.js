const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  completedDates: [{
    type: Date,
  }],
});

module.exports = mongoose.model('Habit', habitSchema); 