import { format, isToday, isThisWeek, isThisMonth, startOfDay, endOfDay } from 'date-fns';

export const formatDate = (date, formatString = 'MMM d, yyyy') => {
  return format(new Date(date), formatString);
};

export const formatTime = (time) => {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

export const isEventToday = (eventDate) => {
  return isToday(new Date(eventDate));
};

export const isEventThisWeek = (eventDate) => {
  return isThisWeek(new Date(eventDate));
};

export const isEventThisMonth = (eventDate) => {
  return isThisMonth(new Date(eventDate));
};

export const getEventsByDate = (events, date) => {
  const targetDate = startOfDay(new Date(date));
  return events.filter(event => {
    const eventDate = startOfDay(new Date(event.date));
    return eventDate.getTime() === targetDate.getTime();
  });
};

export const getUpcomingEvents = (events, days = 7) => {
  const now = new Date();
  const futureDate = new Date();
  futureDate.setDate(now.getDate() + days);
  
  return events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate >= now && eventDate <= futureDate;
  });
};