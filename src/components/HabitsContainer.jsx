import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import HabitGrid from './HabitGrid';
import Navbar from './Navbar';
import '../styles/HabitsContainer.css';

const HabitsContainer = () => {
  const [habits, setHabits] = useState([]);
  const { user, logout } = useAuth();

  const fetchHabits = async () => {
    try {
      console.log('Starting fetchHabits...');
      console.log('Backend URL:', process.env.REACT_APP_BACKEND_URL);
      console.log('User token:', user?.token);
      
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/habits`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Response received:', response);
      console.log('Habits data:', response.data);
      setHabits(response.data);
    } catch (error) {
      console.error('Detailed error information:');
      console.error('Error object:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      console.error('Error headers:', error.response?.headers);
      
      if (error.response?.status === 401) {
        console.log('Unauthorized - logging out');
        logout();
      }
    }
  };

  useEffect(() => {
    if (user?.token) {
      console.log('User token present, fetching habits...');
      fetchHabits();
    } else {
      console.log('No user token available');
    }
  }, [user]);

  const handleHabitUpdate = (updatedHabit) => {
    setHabits(prevHabits => {
      const newHabits = prevHabits.map(habit => 
        habit._id === updatedHabit._id ? updatedHabit : habit
      );
      console.log('Updated habits:', newHabits);
      return newHabits;
    });
  };

  const handleHabitCreated = (newHabit) => {
    console.log('New habit created:', newHabit);
    if (!newHabit._id) {
      console.error('New habit is missing _id:', newHabit);
      return;
    }
    setHabits(prevHabits => [...prevHabits, newHabit]);
  };

  const handleHabitDelete = async (habitId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/api/habits/${habitId}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Habit deleted:', habitId);
      setHabits(prevHabits => prevHabits.filter(habit => habit._id !== habitId));
    } catch (error) {
      console.error('Error deleting habit:', error);
      if (error.response?.status === 401) {
        logout();
      }
    }
  };

  return (
    <div>
      <Navbar onHabitCreated={handleHabitCreated} />
      <div className="habits-container">
        {habits.filter(habit => habit._id).map(habit => (
          <HabitGrid 
            key={habit._id} 
            habit={habit}
            onHabitUpdate={handleHabitUpdate}
            onDelete={handleHabitDelete}
          />
        ))}
        {habits.length === 0 && (
          <div className="no-habits">
            <p>No habits yet! Click "Create Habit" to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HabitsContainer; 