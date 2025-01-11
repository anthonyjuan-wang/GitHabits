import React from 'react';
import { format, eachDayOfInterval, subYears, addDays } from 'date-fns';
import '../styles/HabitGrid.css';

const HabitGrid = () => {
  // Generate dates for the last year
  const endDate = new Date();
  const startDate = subYears(endDate, 1);
  
  const dates = eachDayOfInterval({ start: startDate, end: endDate });
  
  // Group dates by week
  const weeks = dates.reduce((acc, date) => {
    const weekNum = format(date, 'w');
    if (!acc[weekNum]) {
      acc[weekNum] = [];
    }
    acc[weekNum].push(date);
    return acc;
  }, {});

  // Create month labels
  const monthLabels = Array.from(new Set(dates.map(date => 
    format(date, 'MMM')
  )));

  return (
    <div className="habit-container">
      <div className="habit-header">
        <h1>Anki</h1>
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
                {Array(7).fill(null).map((_, dayIndex) => {
                  const date = week[dayIndex];
                  return (
                    <div 
                      key={dayIndex}
                      className={`grid-cell ${date ? 'contribution-0' : 'empty-cell'}`}
                      title={date ? format(date, 'yyyy-MM-dd') : ''}
                    />
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
        <button className="log-today-btn">Log today →</button>
      </div>
    </div>
  );
};

export default HabitGrid;