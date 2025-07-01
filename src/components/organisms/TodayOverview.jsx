import React, { useState, useEffect } from 'react';
import { format, isToday } from 'date-fns';
import { motion } from 'framer-motion';
import EventCard from '@/components/molecules/EventCard';
import FamilyMemberSelector from '@/components/molecules/FamilyMemberSelector';
import Button from '@/components/atoms/Button';
import Avatar from '@/components/atoms/Avatar';
import ApperIcon from '@/components/ApperIcon';
import eventsService from '@/services/api/eventsService';
import familyService from '@/services/api/familyService';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { toast } from 'react-toastify';

const TodayOverview = () => {
  const [events, setEvents] = useState([]);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
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
      setError('Failed to load today\'s data');
      console.error('Today load error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleToggleComplete = async (eventId) => {
    try {
      const event = events.find(e => e.Id === eventId);
      const updatedEvent = await eventsService.update(eventId, {
        ...event,
        completed: !event.completed
      });
      
      setEvents(events.map(e => e.Id === eventId ? updatedEvent : e));
      
      if (updatedEvent.completed) {
        toast.success(`${updatedEvent.title} completed! 🎉`);
      } else {
        toast.info(`${updatedEvent.title} marked as incomplete`);
      }
    } catch (err) {
      toast.error('Failed to update event');
      console.error('Toggle complete error:', err);
    }
  };
  
  // Filter today's events
  const todaysEvents = events.filter(event => 
    isToday(new Date(event.date))
  );
  
  // Filter by selected member
  const filteredEvents = selectedMember 
    ? todaysEvents.filter(event => event.assigneeId === selectedMember)
    : todaysEvents;
  
  // Separate events and chores
  const todaysChores = filteredEvents.filter(event => event.type === 'chore');
  const todaysGeneralEvents = filteredEvents.filter(event => event.type === 'event');
  
  // Calculate stats
  const completedChores = todaysChores.filter(chore => chore.completed);
  const totalPoints = todaysChores.reduce((sum, chore) => sum + (chore.points || 10), 0);
  const earnedPoints = completedChores.reduce((sum, chore) => sum + (chore.points || 10), 0);
  
  if (loading) return <Loading type="events" />;
  if (error) return <Error message={error} onRetry={loadData} />;
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-display font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-2">
          Today's Schedule
        </h1>
        <p className="text-lg text-gray-600">
          {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </p>
      </div>
      
      {/* Family Member Filter */}
      <div className="flex justify-center">
        <FamilyMemberSelector
          members={familyMembers}
          selectedMember={selectedMember}
          onSelectMember={setSelectedMember}
        />
      </div>
      
      {/* Stats Cards */}
      {todaysChores.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-6 text-center"
          >
            <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <ApperIcon name="CheckSquare" className="w-6 h-6 text-accent-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{completedChores.length}/{todaysChores.length}</h3>
            <p className="text-gray-600">Chores Complete</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-6 text-center"
          >
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <ApperIcon name="Star" className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{earnedPoints}/{totalPoints}</h3>
            <p className="text-gray-600">Points Earned</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-6 text-center"
          >
            <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <ApperIcon name="Calendar" className="w-6 h-6 text-secondary-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{todaysGeneralEvents.length}</h3>
            <p className="text-gray-600">Events Today</p>
          </motion.div>
        </div>
      )}
      
      {/* Events and Chores */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Events */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-semibold text-gray-900 flex items-center">
              <ApperIcon name="Calendar" className="w-5 h-5 mr-2 text-primary-600" />
              Events Today
            </h2>
            {todaysGeneralEvents.length > 0 && (
              <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
                {todaysGeneralEvents.length}
              </span>
            )}
          </div>
          
          {todaysGeneralEvents.length === 0 ? (
            <Empty 
              type="events"
              onAction={() => {/* Navigate to calendar */}}
            />
          ) : (
            <div className="space-y-3">
              {todaysGeneralEvents.map((event) => {
                const member = familyMembers.find(m => m.Id === event.assigneeId);
                return (
                  <EventCard
                    key={event.Id}
                    event={event}
                    member={member}
                    onToggleComplete={handleToggleComplete}
                  />
                );
              })}
            </div>
          )}
        </div>
        
        {/* Today's Chores */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-semibold text-gray-900 flex items-center">
              <ApperIcon name="CheckSquare" className="w-5 h-5 mr-2 text-accent-600" />
              Chores Today
            </h2>
            {todaysChores.length > 0 && (
              <span className="bg-accent-100 text-accent-800 px-3 py-1 rounded-full text-sm font-medium">
                {completedChores.length}/{todaysChores.length}
              </span>
            )}
          </div>
          
          {todaysChores.length === 0 ? (
            <Empty 
              type="chores"
              onAction={() => {/* Navigate to chores */}}
            />
          ) : (
            <div className="space-y-3">
              {todaysChores.map((chore) => {
                const member = familyMembers.find(m => m.Id === chore.assigneeId);
                return (
                  <EventCard
                    key={chore.Id}
                    event={chore}
                    member={member}
                    onToggleComplete={handleToggleComplete}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
      
      {/* Family Overview */}
      {familyMembers.length > 0 && (
        <div className="card p-6">
          <h2 className="text-xl font-display font-semibold text-gray-900 mb-6 flex items-center">
            <ApperIcon name="Users" className="w-5 h-5 mr-2 text-secondary-600" />
            Family Overview
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {familyMembers.map((member) => {
              const memberEvents = todaysEvents.filter(event => event.assigneeId === member.Id);
              const memberChores = memberEvents.filter(event => event.type === 'chore');
              const completedMemberChores = memberChores.filter(chore => chore.completed);
              const memberPoints = completedMemberChores.reduce((sum, chore) => sum + (chore.points || 10), 0);
              
              return (
                <motion.div
                  key={member.Id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <Avatar
                    name={member.name}
                    color={member.color}
                    size="lg"
                    className="mx-auto mb-3"
                  />
                  <h3 className="font-semibold text-gray-900 mb-1">{member.name}</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>{completedMemberChores.length}/{memberChores.length} chores</div>
                    <div className="flex items-center justify-center">
                      <ApperIcon name="Star" className="w-3 h-3 mr-1 text-accent-500" />
                      {memberPoints} points
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default TodayOverview;