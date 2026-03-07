export const getWeekDates = (offset: number = 0) => {
  const today = new Date();
  
  // Adjust by offset weeks
  today.setDate(today.getDate() + offset * 7);
  
  // Calculate the first day of the week (Monday)
  const dayOfWeek = today.getDay();
  const distanceToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const first = today.getDate() + distanceToMonday;
  
  const days = [];
  
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(first + i);
    days.push({
      date: d.toISOString().split("T")[0],
      label: d.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
      day: d.getDate()
    });
  }
  return days;
};

export const formatWeekRange = (weekDays: { date: string }[]) => {
  if (!weekDays || weekDays.length === 0) return "";
  
  // Parse dates correctly avoiding timezone issues
  const [sy, sm, sd] = weekDays[0].date.split('-').map(Number);
  const [ey, em, ed] = weekDays[weekDays.length - 1].date.split('-').map(Number);
  
  const start = new Date(sy, sm - 1, sd);
  const end = new Date(ey, em - 1, ed);
  
  const formatOptions: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  
  const startStr = start.toLocaleDateString("en-US", formatOptions);
  const endStr = end.toLocaleDateString("en-US", formatOptions);
  
  if (start.getFullYear() !== end.getFullYear()) {
    return `${startStr}, ${start.getFullYear()} - ${endStr}, ${end.getFullYear()}`;
  }
  
  return `${startStr} - ${endStr}`;
};

export const getPastYearDays = () => {
  const days = [];
  const today = new Date();
  for (let i = 364; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(d.toISOString().split("T")[0]);
  }
  return days;
};
