import React from 'react';
import { format, eachDayOfInterval, startOfYear, endOfYear, getWeek } from 'date-fns';
import '../styles/HabitGrid.css';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const HabitGrid = ({ habit, onHabitUpdate }) => {
  const { user, logout } = useAuth();

  const handleLogToday = async () => {
    try {
      console.log('Logging habit for today:', habit._id);
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/habits/${habit._id}/log`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('Log response:', response.data);
      if (onHabitUpdate) {
        onHabitUpdate(response.data);
      }
    } catch (error) {
      console.error('Error logging habit:', error);
      console.error('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
      });
      if (error.response?.status === 401) {
        logout();
      }
    }
  };

  const handleCellClick = async (date) => {
    if (!date) return;
    
    try {
      // Create date in user's local timezone at midnight
      const localDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );
      
      // Format the date with timezone offset
      const dateString = format(localDate, "yyyy-MM-dd'T'HH:mm:ssxxx");
      console.log('Logging habit for date:', dateString);
      
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/habits/${habit._id}/log/${dateString}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('Log response:', response.data);
      if (onHabitUpdate) {
        onHabitUpdate(response.data);
      }
    } catch (error) {
      console.error('Error logging habit:', error);
      console.error('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
      });
      if (error.response?.status === 401) {
        logout();
      }
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
    
  // Create local date at midnight
  const localDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
  
  // Compare with completed dates using local time
  const isCompleted = habit.completedDates.some(completedDate => {
    const completedLocal = new Date(completedDate);
    return (
      completedLocal.getFullYear() === localDate.getFullYear() &&
      completedLocal.getMonth() === localDate.getMonth() &&
      completedLocal.getDate() === localDate.getDate()
    );
  });
  
  return isCompleted ? 'contribution-1' : 'contribution-0';
};

  return (
    <div className="habit-container">
      <div className="habit-header">
        <h1>{habit.name}</h1>
      </div>
      
      <div className="grid-container">
        {/* Day labels */}
        <div className="day-labels">
          <div>Mon</div>
          <div>Wed</div>
          <div>Fri</div>
          <div>Sun</div>
        </div>

        {/* Month labels and grid */}
        <div className="grid-content">
          <div className="month-labels">
            {monthLabels.map(month => (
              <div key={month}>{month}</div>
            ))}
          </div>
          
          <div className="contribution-grid">
            {Object.values(weeks).map((week, weekIndex) => (
              <div key={weekIndex} className="week-column">
                {week.map((date, dayIndex) => (
                  <div 
                    key={dayIndex}
                    className={`grid-cell ${getCellClass(date)}`}
                    title={date ? format(date, 'yyyy-MM-dd') : ''}
                    onClick={() => date && handleCellClick(date)}
                    style={{ cursor: date ? 'pointer' : 'default' }}
                  />
                ))}
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
        <button className="log-today-btn" onClick={handleLogToday}>
          Log today →
        </button>
      </div>
    </div>
  );
};

export default HabitGrid;