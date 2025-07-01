import React from 'react';

const Loading = ({ type = 'calendar' }) => {
  if (type === 'calendar') {
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-7 gap-1 mb-6">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="h-8 bg-gray-200 rounded"></div>
          ))}
        </div>
        <div className="calendar-grid">
          {Array.from({ length: 35 }).map((_, index) => (
            <div key={index} className="bg-gray-100 min-h-[120px] p-2">
              <div className="h-4 bg-gray-200 rounded mb-2 w-8"></div>
              <div className="space-y-1">
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'events') {
    return (
      <div className="space-y-4 animate-pulse">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="card p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="w-4 h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
    </div>
  );
};

export default Loading;