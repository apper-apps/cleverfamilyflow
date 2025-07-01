import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import Avatar from '@/components/atoms/Avatar';
import ApperIcon from '@/components/ApperIcon';

const EventCard = ({ 
  event, 
  member, 
  onToggleComplete, 
  onEdit, 
  onDelete,
  showAvatar = true,
  compact = false 
}) => {
  const isChore = event.type === 'chore';
  
  const handleToggleComplete = (e) => {
    e.stopPropagation();
    onToggleComplete(event.Id);
  };
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`card p-4 ${event.completed ? 'bg-green-50 border-green-200' : ''} ${compact ? 'p-3' : ''}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          {isChore && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleToggleComplete}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                event.completed 
                  ? 'bg-green-500 border-green-500' 
                  : 'border-gray-300 hover:border-green-400'
              }`}
            >
              {event.completed && (
                <ApperIcon name="Check" className="w-3 h-3 text-white" />
              )}
            </motion.button>
          )}
          
          {showAvatar && member && (
            <Avatar
              name={member.name}
              color={member.color}
              size={compact ? 'sm' : 'md'}
            />
          )}
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h3 className={`font-medium ${event.completed ? 'line-through text-gray-500' : 'text-gray-900'} ${compact ? 'text-sm' : ''}`}>
                {event.title}
              </h3>
              {isChore && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-accent-100 text-accent-800">
                  <ApperIcon name="Star" className="w-3 h-3 mr-1" />
                  {event.points || 10} pts
                </span>
              )}
            </div>
            
            {event.time && (
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <ApperIcon name="Clock" className="w-4 h-4 mr-1" />
                {event.time}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {!isChore && (
            <div className={`w-3 h-3 rounded-full member-${member?.color || 'blue'}`}></div>
          )}
          
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onEdit && (
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(event); }}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ApperIcon name="Edit2" className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(event.Id); }}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              >
                <ApperIcon name="Trash2" className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;