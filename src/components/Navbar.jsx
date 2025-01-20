import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import '../styles/Navbar.css';
import HabitModal from './HabitModal';

const Navbar = ({ onHabitCreated }) => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [habitType, setHabitType] = useState(null);
  const buttonRef = useRef(null);
  
  const handleClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleClose = () => {
    setShowDropdown(false);
  };

  const handleCheckboxSelect = () => {
    setHabitType('binary');
    setShowModal(true);
    handleClose();
  };

  const handleNumberSelect = () => {
    setHabitType('numeric');
    setShowModal(true);
    handleClose();
  };

  const handleHabitCreated = (newHabit) => {
    if (onHabitCreated) {
      onHabitCreated(newHabit);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">Habit Tracker</div>
      {user && (
        <div className="navbar-buttons">
          <div className="dropdown-container">
            <button 
              ref={buttonRef}
              className="create-habit-btn" 
              onClick={handleClick}
            >
              Create Habit ▼
            </button>
            {showDropdown && (
              <div className="dropdown-menu">
                <button onClick={handleNumberSelect}>Number</button>
                <button onClick={handleCheckboxSelect}>Checkbox</button>
              </div>
            )}
          </div>
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      )}
      {showModal && (
        <HabitModal 
          onClose={() => {
            setShowModal(false);
            setHabitType(null);
          }} 
          onHabitCreated={handleHabitCreated}
          type={habitType}
        />
      )}
    </nav>
  );
};

export default Navbar; 