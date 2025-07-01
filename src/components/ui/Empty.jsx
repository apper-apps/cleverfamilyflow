import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const Empty = ({ 
  title = "Nothing here yet",
  message = "Get started by adding your first item",
  actionText = "Add Item",
  onAction,
  icon = "Calendar",
  type = "default"
}) => {
  const getEmptyContent = () => {
    switch (type) {
      case 'events':
        return {
          icon: 'Calendar',
          title: "No events today",
          message: "Your family schedule is clear for today. Perfect time to relax or plan something fun!",
          actionText: "Add Event"
        };
      case 'chores':
        return {
          icon: 'CheckSquare',
          title: "All chores complete!",
          message: "Great job! Your family has finished all the chores. Time to enjoy your day together.",
          actionText: "Add Chore"
        };
      case 'family':
        return {
          icon: 'Users',
          title: "Add your family members",
          message: "Start by adding your family members to begin organizing your household activities.",
          actionText: "Add Family Member"
        };
      default:
        return { icon, title, message, actionText };
    }
  };

  const content = getEmptyContent();

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={content.icon} className="w-10 h-10 text-primary-600" />
      </div>
      <h3 className="text-xl font-display font-semibold text-gray-900 mb-3">{content.title}</h3>
      <p className="text-gray-600 mb-8 max-w-md leading-relaxed">{content.message}</p>
      {onAction && (
        <button
          onClick={onAction}
          className="btn-primary flex items-center space-x-2"
        >
          <ApperIcon name="Plus" className="w-4 h-4" />
          <span>{content.actionText}</span>
        </button>
      )}
    </div>
  );
};

export default Empty;