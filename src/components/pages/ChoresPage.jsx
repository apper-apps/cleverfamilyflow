import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import EventCard from '@/components/molecules/EventCard';
import FamilyMemberSelector from '@/components/molecules/FamilyMemberSelector';
import AddEventModal from '@/components/molecules/AddEventModal';
import ApperIcon from '@/components/ApperIcon';
import eventsService from '@/services/api/eventsService';
import familyService from '@/services/api/familyService';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { toast } from 'react-toastify';

const ChoresPage = () => {
  const [events, setEvents] = useState([]);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, pending, completed
  
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
      setError('Failed to load chores data');
      console.error('Chores load error:', err);
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
      toast.error('Failed to update chore');
      console.error('Toggle complete error:', err);
    }
  };
  
  const handleAddChore = async (choreData) => {
    try {
      const newChore = await eventsService.create({
        ...choreData,
        type: 'chore'
      });
      setEvents([...events, newChore]);
      toast.success('Chore added successfully!');
    } catch (err) {
      toast.error('Failed to add chore');
      console.error('Add chore error:', err);
    }
  };
  
  const handleDeleteChore = async (choreId) => {
    if (window.confirm('Are you sure you want to delete this chore?')) {
      try {
        await eventsService.delete(choreId);
        setEvents(events.filter(e => e.Id !== choreId));
        toast.success('Chore deleted successfully');
      } catch (err) {
        toast.error('Failed to delete chore');
        console.error('Delete chore error:', err);
      }
    }
  };
  
  // Filter chores
  const allChores = events.filter(event => event.type === 'chore');
  
  let filteredChores = selectedMember 
    ? allChores.filter(chore => chore.assigneeId === selectedMember)
    : allChores;
  
  if (filterStatus === 'pending') {
    filteredChores = filteredChores.filter(chore => !chore.completed);
  } else if (filterStatus === 'completed') {
    filteredChores = filteredChores.filter(chore => chore.completed);
  }
  
  // Calculate stats
  const totalChores = allChores.length;
  const completedChores = allChores.filter(chore => chore.completed).length;
  const totalPoints = allChores.reduce((sum, chore) => sum + (chore.points || 10), 0);
  const earnedPoints = allChores.filter(chore => chore.completed).reduce((sum, chore) => sum + (chore.points || 10), 0);
  
  if (loading) return <Loading type="events" />;
  if (error) return <Error message={error} onRetry={loadData} />;
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-display font-bold bg-gradient-to-r from-accent-600 to-primary-600 bg-clip-text text-transparent mb-2">
          Family Chores
        </h1>
        <p className="text-lg text-gray-600">
          Manage and track household responsibilities
        </p>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 text-center"
        >
          <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="CheckSquare" className="w-6 h-6 text-accent-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{totalChores}</h3>
          <p className="text-gray-600">Total Chores</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6 text-center"
        >
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="Check" className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{completedChores}</h3>
          <p className="text-gray-600">Completed</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6 text-center"
        >
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="Clock" className="w-6 h-6 text-orange-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{totalChores - completedChores}</h3>
          <p className="text-gray-600">Pending</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-6 text-center"
        >
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="Star" className="w-6 h-6 text-primary-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{earnedPoints}/{totalPoints}</h3>
          <p className="text-gray-600">Points</p>
        </motion.div>
      </div>
      
      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <FamilyMemberSelector
            members={familyMembers}
            selectedMember={selectedMember}
            onSelectMember={setSelectedMember}
          />
          
          <div className="flex items-center space-x-2">
            {['all', 'pending', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  filterStatus === status
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        <Button
          icon="Plus"
          onClick={() => setIsModalOpen(true)}
        >
          Add Chore
        </Button>
      </div>
      
      {/* Chores List */}
      <div className="card p-6">
        {filteredChores.length === 0 ? (
          <Empty 
            type="chores"
            onAction={() => setIsModalOpen(true)}
          />
        ) : (
          <div className="space-y-4">
            {filteredChores.map((chore) => {
              const member = familyMembers.find(m => m.Id === chore.assigneeId);
              return (
                <EventCard
                  key={chore.Id}
                  event={chore}
                  member={member}
                  onToggleComplete={handleToggleComplete}
                  onDelete={handleDeleteChore}
                />
              );
            })}
          </div>
        )}
      </div>
      
      {/* Add Chore Modal */}
      <AddEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddChore}
        selectedDate={new Date()}
        familyMembers={familyMembers}
      />
    </div>
  );
};

export default ChoresPage;