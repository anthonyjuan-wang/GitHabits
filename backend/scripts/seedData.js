const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const Habit = require('../models/Habit');
const User = require('../models/User');

const seedDatabase = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Habit.deleteMany({});
    console.log('Cleared existing data');

    // Create a user first
    const user = await User.create({
      username: 'testuser',
      habits: [] // Will be populated after creating habits
    });

    // Create habits with proper userId reference
    const habits = await Habit.create([
      {
        userId: user._id,
        name: 'Daily Exercise',
        completedDates: [
          new Date('2025-03-01T00:00:00-05:00'), // Using EST timezone
          new Date('2025-03-02T00:00:00-05:00'),
          new Date('2025-03-04T00:00:00-05:00'),
        ]
      },
      {
        userId: user._id,
        name: 'Reading',
        completedDates: [
          new Date('2025-03-01T00:00:00-05:00'),
          new Date('2025-03-03T00:00:00-05:00'),
        ]
      }
    ]);
    // Update user with habit references
    user.habits = habits.map(habit => habit._id);
    await user.save();

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();

