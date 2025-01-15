import React from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import '../styles/Navbar.css';

const Navbar = ({ onHabitCreated }) => {
  const { user, logout } = useAuth();

  const handleCreateHabit = async () => {
    try {
      console.log('Making request to:', `${process.env.REACT_APP_BACKEND_URL}/api/habits`);
      console.log('With token:', user.token);
      
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/habits`,
        { name: 'New Habit' },
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Habit created:', response.data);
      if (onHabitCreated) {
        onHabitCreated(response.data);
      }
    } catch (error) {
      console.error('Error creating habit:', error);
      console.log('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
      });
      
      if (error.response?.status === 401) {
        console.log('Unauthorized - logging out');
        logout();
      }
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">Habit Tracker</div>
      {user && (
        <div className="navbar-buttons">
          <button className="create-habit-btn" onClick={handleCreateHabit}>
            Create Habit
          </button>
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 