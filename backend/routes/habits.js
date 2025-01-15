const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get all habits for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    console.log('GET /api/habits - Request received');
    console.log('Auth user:', req.user);

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Found habits:', user.habits);
    res.json(user.habits);
  } catch (error) {
    console.error('Error in GET /api/habits:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new habit
router.post('/', auth, async (req, res) => {
  try {
    console.log('POST /api/habits - Request received');
    console.log('Request body:', req.body);
    console.log('Auth user:', req.user);

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newHabit = {
      name: req.body.name,
      completedDates: []
    };

    user.habits.push(newHabit);
    await user.save();

    console.log('New habit created:', newHabit);
    res.json(newHabit);
  } catch (error) {
    console.error('Error in POST /api/habits:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Log habit completion for a specific date
router.post('/:habitId/log/:date?', auth, async (req, res) => {
  try {
    console.log('POST /api/habits/:habitId/log - Request received');
    console.log('Habit ID:', req.params.habitId);
    console.log('Date param:', req.params.date);
    console.log('Auth user:', req.user);

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const habit = user.habits.id(req.params.habitId);
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    // Use provided date or current date
    const completionDate = req.params.date ? new Date(req.params.date) : new Date();

    // Add the date if it doesn't exist
    if (!habit.completedDates.some(date => date.toISOString().split('T')[0] === completionDate.toISOString().split('T')[0])) {
      habit.completedDates.push(completionDate);
    } else {
      // Remove the date if it exists (toggle functionality)
      habit.completedDates = habit.completedDates.filter(
        date => date.toISOString().split('T')[0] !== completionDate.toISOString().split('T')[0]
      );
    }

    await user.save();
    console.log('Updated habit:', habit);
    res.json(habit);
  } catch (error) {
    console.error('Error in POST /api/habits/:habitId/log:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 