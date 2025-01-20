import React, { useState } from 'react';
import { format, eachDayOfInterval, startOfYear, endOfYear, getWeek } from 'date-fns';
import '../styles/HabitGrid.css';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import LogModal from './LogModal';

const HabitGrid = ({ habit, onHabitUpdate }) => {
  const [showLogModal, setShowLogModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const { user, logout } = useAuth();
  const handleLogToday = async (count = 1) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/habits/${habit._id}/log`,
        { count },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (onHabitUpdate) {
        onHabitUpdate(response.data);
      }
    } catch (error) {
      console.error('Error logging habit:', error);
      if (error.response?.status === 401) {
        logout();
      }
    }
  };

  const handleCellClick = async (date) => {
    if (!date) return;
    
    // Create date in user's local timezone at midnight
    const localDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    
    setSelectedDate(localDate);
    setShowLogModal(true);
  };

  const handleLogWithDate = async (dateString, count) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/habits/${habit._id}/log/${dateString}`,
        { count },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (onHabitUpdate) {
        onHabitUpdate(response.data);
      }
    } catch (error) {
      console.error('Error logging habit:', error);
      if (error.response?.status === 401) {
        logout();
      }
    }
  };

  const handleDeleteLog = async (date) => {
    try {
      const dateString = format(date, "yyyy-MM-dd'T'HH:mm:ssxxx");
      const response = await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/api/habits/${habit._id}/log/${dateString}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (onHabitUpdate) {
        onHabitUpdate(response.data);
      }
    } catch (error) {
      console.error('Error deleting habit log:', error);
      if (error.response?.status === 401) {
        logout();
      }
    }
  };

  const handleQuickAdd = async () => {
    const today = new Date();
    const localDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    const existingEntry = habit.completedDates.find(entry => {
      const entryDate = new Date(entry.date);
      return (
        entryDate.getFullYear() === localDate.getFullYear() &&
        entryDate.getMonth() === localDate.getMonth() &&
        entryDate.getDate() === localDate.getDate()
      );
    });

    if (habit.type === 'binary' && !existingEntry) {
      handleLogToday(1);
    } else if (habit.type === 'numeric') {
      const currentCount = existingEntry ? existingEntry.count : 0;
      handleLogToday(currentCount + 1);
    }
  };

  // Generate dates for the current year
  const startDate = startOfYear(new Date());
  const endDate = endOfYear(new Date());
  
  const dates = eachDayOfInterval({ start: startDate, end: endDate });
  
  // Group dates by week, ensuring we include incomplete weeks
  const weeks = dates.reduce((acc, date) => {
    const weekNum = getWeek(date);
    if (!acc[weekNum]) {
      // Initialize the week array with 7 null slots
      acc[weekNum] = Array(7).fill(null);
    }
    // Get day index (0-6) and place the date in the correct position
    const dayIndex = date.getDay();
    acc[weekNum][dayIndex] = date;
    return acc;
  }, {});

  // Create month labels (all 12 months)
  const monthLabels = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const getCellClass = (date) => {
    if (!date || !habit) return 'empty-cell';
    
    const localDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    
    const completedDate = habit.completedDates.find(entry => {
      const completedLocal = new Date(entry.date);
      return (
        completedLocal.getFullYear() === localDate.getFullYear() &&
        completedLocal.getMonth() === localDate.getMonth() &&
        completedLocal.getDate() === localDate.getDate()
      );
    });

    if (!completedDate) return 'contribution-0';

    if (habit.type === 'binary') {
      return 'contribution-1';
    } else {
      const count = completedDate.count || 1;
      const level = Math.min(Math.ceil(count), 4);
      return `contribution-${level}`;
    }
  };

  const getCurrentCount = (date) => {
    if (!date || !habit) return 1;
    
    const localDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    
    const completedDate = habit.completedDates.find(entry => {
      const completedLocal = new Date(entry.date);
      return (
        completedLocal.getFullYear() === localDate.getFullYear() &&
        completedLocal.getMonth() === localDate.getMonth() &&
        completedLocal.getDate() === localDate.getDate()
      );
    });

    return completedDate ? completedDate.count : 1;
  };

  const handleCellHover = (event, date, completedDate) => {
    if (!date || !completedDate) return;
    
    const tooltip = event.currentTarget.querySelector('.cell-tooltip');
    if (!tooltip) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    
    let left = rect.left + (rect.width / 2);
    let top = rect.top - 10;

    // Adjust if tooltip would go off screen
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    if (left + tooltipRect.width > viewportWidth) {
      left = viewportWidth - tooltipRect.width - 10;
    }
    if (left < 10) {
      left = 10;
    }
    if (top < 10) {
      top = rect.bottom + tooltipRect.height + 10;
    }

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
  };

  return (
    <div className="habit-container">
      <div className="habit-header">
        <h1>{habit.name}</h1>
      </div>
      
      <div className="grid-container">
        {/* Day labels 
        <div className="day-labels">
          <div>Mon</div>
          <div>Wed</div>
          <div>Fri</div>
          <div>Sun</div>
        </div>
        */}

        {/* Month labels and grid */}
        <div className="grid-content">

          {/*}
          <div className="month-labels">
            {monthLabels.map(month => (
              <div key={month}>{month}</div>
            ))}
          </div>
          */}
          
          <div className="contribution-grid">
            {Object.values(weeks).map((week, weekIndex) => (
              <div key={weekIndex} className="week-column">
                {week.map((date, dayIndex) => {
                  const cellClass = getCellClass(date);
                  const completedDate = date && habit.completedDates.find(entry => {
                    const completedLocal = new Date(entry.date);
                    return (
                      completedLocal.getFullYear() === date.getFullYear() &&
                      completedLocal.getMonth() === date.getMonth() &&
                      completedLocal.getDate() === date.getDate()
                    );
                  });

                  return (
                    <div 
                      key={dayIndex}
                      className={`grid-cell ${cellClass}`}
                      onClick={() => date && handleCellClick(date)}
                      style={{ cursor: date ? 'pointer' : 'default' }}
                    >
                      {date && completedDate && (
                        <div className="cell-tooltip">
                          <span className="tooltip-value">
                            {habit.type === 'binary' ? 'Done' : `${completedDate.count}`}
                          </span>
                          <span className="tooltip-date">
                            {format(date, 'EEE MMM d yyyy')}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="stats-and-button-container">
        <div className="stats-container">
          <div>Longest streak: 0 days</div>
          <div>Streak: 0 days</div>
          <div>Average: 1.00</div>
        </div>
        <button className="log-today-btn" onClick={() => setShowLogModal(true)}>
          Log today →
        </button>
      </div>
      {showLogModal && (
        <LogModal
          habit={habit}
          onClose={() => {
            setShowLogModal(false);
            setSelectedDate(null);
          }}
          onSubmit={(count, date) => {
            if (date) {
              const dateString = format(date, "yyyy-MM-dd'T'HH:mm:ssxxx");
              handleLogWithDate(dateString, count);
            } else {
              handleLogToday(count);
            }
          }}
          onDelete={handleDeleteLog}
          selectedDate={selectedDate}
        />
      )}
    </div>
  );
};

export default HabitGrid;