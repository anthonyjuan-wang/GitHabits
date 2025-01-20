import React, { useState } from 'react';
import { format } from 'date-fns';
import '../styles/LogModal.css';

const LogModal = ({ onClose, onSubmit, habit, selectedDate, onDelete }) => {
  const [count, setCount] = useState(() => {
    if (!selectedDate || !habit) return 1;
    
    const completedDate = habit.completedDates.find(entry => {
      const entryDate = new Date(entry.date);
      const selected = new Date(selectedDate);
      return (
        entryDate.getFullYear() === selected.getFullYear() &&
        entryDate.getMonth() === selected.getMonth() &&
        entryDate.getDate() === selected.getDate()
      );
    });

    return completedDate ? completedDate.count : 1;
  });

  const date = selectedDate || new Date();
  const hasExistingEntry = habit.completedDates.some(entry => {
    const entryDate = new Date(entry.date);
    const compareDate = new Date(date);
    return (
      entryDate.getFullYear() === compareDate.getFullYear() &&
      entryDate.getMonth() === compareDate.getMonth() &&
      entryDate.getDate() === compareDate.getDate()
    );
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(count, selectedDate);
    onClose();
  };

  const handleDelete = () => {
    onDelete(date);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Log Entry for {habit.name}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Date</label>
              <div className="date-display">{format(date, 'EEEE, MMMM do yyyy')}</div>
            </div>
            {habit.type === 'numeric' && (
              <div className="form-group">
                <label htmlFor="count">Number of entries</label>
                <input
                  type="number"
                  id="count"
                  min="1"
                  value={count}
                  onChange={(e) => setCount(parseInt(e.target.value))}
                  required
                />
              </div>
            )}
          </div>
          <div className="modal-footer">
            <div className="button-group">
              {hasExistingEntry && (
                <button 
                  type="button" 
                  className="delete-button"
                  onClick={handleDelete}
                >
                  Undo Entry
                </button>
              )}
              <button type="submit" className="create-button">
                Save Entry
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LogModal; 