import React from 'react';
import { format, isSameMonth, isToday } from 'date-fns';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const CalendarCell = ({ 
  date, 
  currentDate, 
  events = [], 
  onDateClick, 
  onEventClick,
  selectedMember = null 
}) => {
  const isCurrentMonth = isSameMonth(date, currentDate);
  const isCurrentDay = isToday(date);
  const dayNumber = format(date, 'd');
  
  // Filter events based on selected member
  const filteredEvents = selectedMember 
    ? events.filter(event => event.assigneeId === selectedMember)
    : events;
  
  const cellClasses = `
    calendar-cell cursor-pointer relative
    ${isCurrentMonth ? '' : 'other-month'}
    ${isCurrentDay ? 'today' : ''}
  `;
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={cellClasses}
      onClick={() => onDateClick(date)}
    >
      <div className="flex justify-between items-start mb-2">
        <span className={`text-sm font-medium ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'} ${isCurrentDay ? 'text-primary-600 font-bold' : ''}`}>
          {dayNumber}
        </span>
        {filteredEvents.length > 0 && (
          <span className="text-xs text-gray-500 bg-gray-100 rounded-full px-2 py-1">
            {filteredEvents.length}
          </span>
        )}
      </div>
      
      <div className="space-y-1">
        {filteredEvents.slice(0, 3).map((event, index) => (
          <motion.div
            key={event.Id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={(e) => {
              e.stopPropagation();
              onEventClick(event);
            }}
            className={`
              text-xs p-1 rounded cursor-pointer transition-all duration-200 hover:shadow-sm
              ${event.type === 'chore' ? 'bg-accent-100 text-accent-800' : 'bg-primary-100 text-primary-800'}
              ${event.completed ? 'opacity-60 line-through' : ''}
            `}
          >
            <div className="flex items-center space-x-1">
              {event.type === 'chore' && (
                <ApperIcon name="CheckSquare" className="w-3 h-3" />
              )}
              <span className="truncate">{event.title}</span>
            </div>
            {event.time && (
              <div className="text-xs opacity-75 mt-1">
                {event.time}
              </div>
            )}
          </motion.div>
        ))}
        
        {filteredEvents.length > 3 && (
          <div className="text-xs text-gray-500 text-center py-1">
            +{filteredEvents.length - 3} more
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CalendarCell;