import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, addMonths, subMonths } from 'date-fns';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import CalendarCell from '@/components/molecules/CalendarCell';
import FamilyMemberSelector from '@/components/molecules/FamilyMemberSelector';
import AddEventModal from '@/components/molecules/AddEventModal';
import ApperIcon from '@/components/ApperIcon';
import eventsService from '@/services/api/eventsService';
import familyService from '@/services/api/familyService';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { toast } from 'react-toastify';

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [eventsData, membersData] = await Promise.all([
        eventsService.getAll(),
        familyService.getAll()
      ]);
      setEvents(eventsData);
      setFamilyMembers(membersData);
    } catch (err) {
      setError('Failed to load calendar data');
      console.error('Calendar load error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };
  
  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };
  
  const handleDateClick = (date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };
  
  const handleEventClick = (event) => {
    // Handle event click (could open edit modal)
    console.log('Event clicked:', event);
  };
  
  const handleAddEvent = async (eventData) => {
    try {
      const newEvent = await eventsService.create(eventData);
      setEvents([...events, newEvent]);
      toast.success('Event added successfully!');
    } catch (err) {
      toast.error('Failed to add event');
      console.error('Add event error:', err);
    }
  };
  
  // Get calendar days
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  
  // Group events by date
  const eventsByDate = events.reduce((acc, event) => {
    const dateKey = format(new Date(event.date), 'yyyy-MM-dd');
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(event);
    return acc;
  }, {});
  
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  if (loading) return <Loading type="calendar" />;
  if (error) return <Error message={error} onRetry={loadData} />;
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              icon="ChevronLeft"
              onClick={handlePreviousMonth}
            />
            <h2 className="text-2xl font-display font-bold text-gray-900">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              icon="ChevronRight"
              onClick={handleNextMonth}
            />
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentDate(new Date())}
            className="text-primary-600 hover:text-primary-700"
          >
            Today
          </Button>
        </div>
        
        <div className="flex items-center space-x-4">
          <FamilyMemberSelector
            members={familyMembers}
            selectedMember={selectedMember}
            onSelectMember={setSelectedMember}
          />
          
          <Button
            icon="Plus"
            onClick={() => {
              setSelectedDate(new Date());
              setIsModalOpen(true);
            }}
          >
            Add Event
          </Button>
        </div>
      </div>
      
      {/* Calendar */}
      <div className="card-elevated p-6">
        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {daysOfWeek.map((day) => (
            <div key={day} className="p-3 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className="calendar-grid">
          {calendarDays.map((date) => {
            const dateKey = format(date, 'yyyy-MM-dd');
            const dayEvents = eventsByDate[dateKey] || [];
            
            return (
              <CalendarCell
                key={dateKey}
                date={date}
                currentDate={currentDate}
                events={dayEvents}
                onDateClick={handleDateClick}
                onEventClick={handleEventClick}
                selectedMember={selectedMember}
              />
            );
          })}
        </div>
      </div>
      
      {/* Add Event Modal */}
      <AddEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddEvent}
        selectedDate={selectedDate}
        familyMembers={familyMembers}
      />
    </div>
  );
};

export default CalendarView;