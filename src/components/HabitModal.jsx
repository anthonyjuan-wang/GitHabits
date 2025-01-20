import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import '../styles/HabitModal.css';

const HabitModal = ({ onClose, onHabitCreated, type }) => {
  const [habitName, setHabitName] = useState('');
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/habits`,
        {
          name: habitName,
          type: type // 'binary' or 'numeric'
        },
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (onHabitCreated) {
        onHabitCreated(response.data);
      }
      onClose();
    } catch (error) {
      console.error('Error creating habit:', error);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Create New {type === 'binary' ? 'Checkbox' : 'Counter'} Habit</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="habitName">Habit Name</label>
              <input
                type="text"
                id="habitName"
                value={habitName}
                onChange={(e) => setHabitName(e.target.value)}
                placeholder="Enter habit name"
                autoFocus
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="create-button" disabled={!habitName.trim()}>
              Create Habit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HabitModal; 