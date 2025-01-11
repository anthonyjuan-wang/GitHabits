const generateYearDates = () => {
  const today = new Date();
  const yearAgo = new Date();
  yearAgo.setFullYear(today.getFullYear() - 1);
  
  // Generate array of dates between yearAgo and today
  return dates;
}

const calculateStreak = (contributions) => {
  // Calculate current and longest streaks
  return { currentStreak, longestStreak };
}
