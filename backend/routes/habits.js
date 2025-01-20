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
      type: req.body.type,
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
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const habit = user.habits.id(req.params.habitId);
    if (!habit) return res.status(404).json({ message: 'Habit not found' });

    const completionDate = req.params.date ? new Date(req.params.date) : new Date();
    const dateString = completionDate.toISOString().split('T')[0];
    const count = req.body.count || 1;

    // Find if date already exists
    const existingDateIndex = habit.completedDates.findIndex(entry => 
      entry.date.toISOString().split('T')[0] === dateString
    );

    if (habit.type === 'binary') {
      // For binary habits, always add the date if it doesn't exist
      if (existingDateIndex === -1) {
        habit.completedDates.push({ date: completionDate, count: 1 });
      }
      // If the date exists, do nothing (keep the existing entry)
    } else {
      // For numeric habits, set the exact count value
      if (existingDateIndex === -1) {
        habit.completedDates.push({ date: completionDate, count: count });
      } else {
        habit.completedDates[existingDateIndex].count = count;
      }
    }

    await user.save();
    res.json(habit);
  } catch (error) {
    console.error('Error logging habit:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete habit completion for a specific date
router.delete('/:habitId/log/:date', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const habit = user.habits.id(req.params.habitId);
    if (!habit) return res.status(404).json({ message: 'Habit not found' });

    const dateToDelete = new Date(req.params.date);
    const dateString = dateToDelete.toISOString().split('T')[0];

    const existingDateIndex = habit.completedDates.findIndex(entry => 
      entry.date.toISOString().split('T')[0] === dateString
    );

    if (existingDateIndex !== -1) {
      habit.completedDates.splice(existingDateIndex, 1);
      await user.save();
    }

    res.json(habit);
  } catch (error) {
    console.error('Error deleting habit log:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 