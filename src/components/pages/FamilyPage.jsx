import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Avatar from '@/components/atoms/Avatar';
import ApperIcon from '@/components/ApperIcon';
import familyService from '@/services/api/familyService';
import eventsService from '@/services/api/eventsService';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { toast } from 'react-toastify';

const FamilyPage = () => {
  const [familyMembers, setFamilyMembers] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    role: 'child',
    color: 'blue'
  });
  
  const colorOptions = [
    { value: 'blue', label: 'Blue' },
    { value: 'pink', label: 'Pink' },
    { value: 'purple', label: 'Purple' },
    { value: 'green', label: 'Green' },
    { value: 'indigo', label: 'Indigo' },
    { value: 'amber', label: 'Amber' }
  ];
  
  const roleOptions = [
    { value: 'parent', label: 'Parent' },
    { value: 'child', label: 'Child' }
  ];
  
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [membersData, eventsData] = await Promise.all([
        familyService.getAll(),
        eventsService.getAll()
      ]);
      setFamilyMembers(membersData);
      setEvents(eventsData);
    } catch (err) {
      setError('Failed to load family data');
      console.error('Family load error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddMember = async (e) => {
    e.preventDefault();
    
    if (!newMember.name.trim()) {
      toast.error('Please enter a name');
      return;
    }
    
    try {
      const memberData = {
        ...newMember,
        points: 0,
        avatar: ''
      };
      
      const addedMember = await familyService.create(memberData);
      setFamilyMembers([...familyMembers, addedMember]);
      setNewMember({ name: '', role: 'child', color: 'blue' });
      setIsAddingMember(false);
      toast.success(`${addedMember.name} added to the family!`);
    } catch (err) {
      toast.error('Failed to add family member');
      console.error('Add member error:', err);
    }
  };
  
  const handleDeleteMember = async (memberId) => {
    const member = familyMembers.find(m => m.Id === memberId);
    if (window.confirm(`Are you sure you want to remove ${member.name} from the family?`)) {
      try {
        await familyService.delete(memberId);
        setFamilyMembers(familyMembers.filter(m => m.Id !== memberId));
        toast.success(`${member.name} removed from family`);
      } catch (err) {
        toast.error('Failed to remove family member');
        console.error('Delete member error:', err);
      }
    }
  };
  
  // Calculate member stats
  const getMemberStats = (memberId) => {
    const memberEvents = events.filter(event => event.assigneeId === memberId);
    const memberChores = memberEvents.filter(event => event.type === 'chore');
    const completedChores = memberChores.filter(chore => chore.completed);
    const totalPoints = completedChores.reduce((sum, chore) => sum + (chore.points || 10), 0);
    
    return {
      totalEvents: memberEvents.length,
      totalChores: memberChores.length,
      completedChores: completedChores.length,
      totalPoints
    };
  };
  
  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-display font-bold bg-gradient-to-r from-secondary-600 to-primary-600 bg-clip-text text-transparent mb-2">
          Family Members
        </h1>
        <p className="text-lg text-gray-600">
          Manage your family and track everyone's contributions
        </p>
      </div>
      
      {/* Add Member Form */}
      {isAddingMember ? (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="card p-6"
        >
          <h2 className="text-xl font-display font-semibold text-gray-900 mb-6">
            Add Family Member
          </h2>
          
          <form onSubmit={handleAddMember} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Name"
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                placeholder="Enter name..."
                required
              />
              
              <Select
                label="Role"
                value={newMember.role}
                onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                options={roleOptions}
              />
              
              <Select
                label="Color"
                value={newMember.color}
                onChange={(e) => setNewMember({ ...newMember, color: e.target.value })}
                options={colorOptions}
              />
            </div>
            
            <div className="flex items-center space-x-3">
              <Avatar
                name={newMember.name || 'Preview'}
                color={newMember.color}
                size="lg"
              />
              <div>
                <p className="font-medium text-gray-900">Preview</p>
                <p className="text-sm text-gray-500 capitalize">{newMember.role}</p>
              </div>
            </div>
            
            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setIsAddingMember(false);
                  setNewMember({ name: '', role: 'child', color: 'blue' });
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                Add Member
              </Button>
            </div>
          </form>
        </motion.div>
      ) : (
        <div className="flex justify-center">
          <Button
            icon="Plus"
            onClick={() => setIsAddingMember(true)}
          >
            Add Family Member
          </Button>
        </div>
      )}
      
      {/* Family Members Grid */}
      {familyMembers.length === 0 ? (
        <Empty 
          type="family"
          onAction={() => setIsAddingMember(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {familyMembers.map((member) => {
            const stats = getMemberStats(member.Id);
            
            return (
              <motion.div
                key={member.Id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card p-6 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Avatar
                      name={member.name}
                      color={member.color}
                      size="lg"
                    />
                    <div>
                      <h3 className="font-display font-semibold text-gray-900">
                        {member.name}
                      </h3>
                      <p className="text-sm text-gray-500 capitalize">
                        {member.role}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleDeleteMember(member.Id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 transition-all duration-200"
                  >
                    <ApperIcon name="Trash2" className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-gray-900">
                      {stats.completedChores}/{stats.totalChores}
                    </div>
                    <div className="text-xs text-gray-600">Chores</div>
                  </div>
                  
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-gray-900 flex items-center justify-center">
                      <ApperIcon name="Star" className="w-4 h-4 mr-1 text-accent-500" />
                      {stats.totalPoints}
                    </div>
                    <div className="text-xs text-gray-600">Points</div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 member-${member.color}`}
                    style={{
                      width: stats.totalChores > 0 
                        ? `${(stats.completedChores / stats.totalChores) * 100}%`
                        : '0%'
                    }}
                  />
                </div>
                
                <div className="mt-2 text-center">
                  <span className="text-xs text-gray-500">
                    {stats.totalChores > 0 
                      ? `${Math.round((stats.completedChores / stats.totalChores) * 100)}% Complete`
                      : 'No chores assigned'
                    }
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
      
      {/* Family Summary */}
      {familyMembers.length > 0 && (
        <div className="card p-6">
          <h2 className="text-xl font-display font-semibold text-gray-900 mb-6 flex items-center">
            <ApperIcon name="BarChart3" className="w-5 h-5 mr-2 text-primary-600" />
            Family Summary
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {familyMembers.length}
              </div>
              <div className="text-gray-600">Family Members</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {familyMembers.reduce((sum, member) => {
                  const stats = getMemberStats(member.Id);
                  return sum + stats.totalEvents;
                }, 0)}
              </div>
              <div className="text-gray-600">Total Events</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {familyMembers.reduce((sum, member) => {
                  const stats = getMemberStats(member.Id);
                  return sum + stats.completedChores;
                }, 0)}
              </div>
              <div className="text-gray-600">Completed Chores</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1 flex items-center justify-center">
                <ApperIcon name="Star" className="w-6 h-6 mr-1 text-accent-500" />
                {familyMembers.reduce((sum, member) => {
                  const stats = getMemberStats(member.Id);
                  return sum + stats.totalPoints;
                }, 0)}
              </div>
              <div className="text-gray-600">Total Points</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FamilyPage;