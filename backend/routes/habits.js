const express = require('express');
const router = express.Router();
const Habit = require('../models/Habit');

// Get all habits for a user
router.get('/api/habits', async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.user.id });
    res.json(habits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Toggle a habit completion for a specific date
router.post('/api/habits/:habitId/toggle', async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.habitId);
    const dateToToggle = new Date(req.body.date);

    const dateExists = habit.completedDates.some(date => 
      date.toISOString().split('T')[0] === dateToToggle.toISOString().split('T')[0]
    );

    if (dateExists) {
      habit.completedDates = habit.completedDates.filter(date => 
        date.toISOString().split('T')[0] !== dateToToggle.toISOString().split('T')[0]
      );
    } else {
      habit.completedDates.push(dateToToggle);
    }

    await habit.save();
    res.json(habit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 