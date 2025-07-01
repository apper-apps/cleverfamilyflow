import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Avatar from '@/components/atoms/Avatar';
import ApperIcon from '@/components/ApperIcon';

const AddEventModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  selectedDate,
  familyMembers = [],
  editEvent = null 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'event',
    assigneeId: '',
    time: '',
    recurring: 'none',
    points: 10
  });
  
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    if (editEvent) {
      setFormData({
        title: editEvent.title || '',
        type: editEvent.type || 'event',
        assigneeId: editEvent.assigneeId || '',
        time: editEvent.time || '',
        recurring: editEvent.recurring || 'none',
        points: editEvent.points || 10
      });
    } else {
      setFormData({
        title: '',
        type: 'event',
        assigneeId: '',
        time: '',
        recurring: 'none',
        points: 10
      });
    }
    setErrors({});
  }, [editEvent, isOpen]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.assigneeId) newErrors.assigneeId = 'Please select a family member';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    const eventData = {
      ...formData,
      date: selectedDate,
      completed: false
    };
    
    onSubmit(eventData);
    onClose();
  };
  
  const typeOptions = [
    { value: 'event', label: 'Event' },
    { value: 'chore', label: 'Chore' }
  ];
  
  const recurringOptions = [
    { value: 'none', label: 'One time' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' }
  ];
  
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-xl shadow-xl w-full max-w-md"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-semibold text-gray-900">
                {editEvent ? 'Edit Event' : 'Add New Event'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ApperIcon name="X" className="w-5 h-5" />
              </button>
            </div>
            
            {selectedDate && (
              <div className="bg-primary-50 rounded-lg p-3 mb-6">
                <div className="flex items-center text-primary-700">
                  <ApperIcon name="Calendar" className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">
                    {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                  </span>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Event Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter event title..."
                error={errors.title}
                required
              />
              
              <Select
                label="Type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                options={typeOptions}
                error={errors.type}
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assign to Family Member <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {familyMembers.map((member) => (
                    <button
                      key={member.Id}
                      type="button"
                      onClick={() => setFormData({ ...formData, assigneeId: member.Id })}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 flex items-center space-x-2 ${
                        formData.assigneeId === member.Id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Avatar name={member.name} color={member.color} size="sm" />
                      <span className="text-sm font-medium">{member.name}</span>
                    </button>
                  ))}
                </div>
                {errors.assigneeId && (
                  <p className="mt-1 text-sm text-red-600">{errors.assigneeId}</p>
                )}
              </div>
              
              <Input
                label="Time (optional)"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
              
              {formData.type === 'chore' && (
                <Input
                  label="Points"
                  type="number"
                  min="1"
                  max="100"
                  value={formData.points}
                  onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 10 })}
                />
              )}
              
              <Select
                label="Recurring"
                value={formData.recurring}
                onChange={(e) => setFormData({ ...formData, recurring: e.target.value })}
                options={recurringOptions}
              />
              
              <div className="flex space-x-3 pt-6">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                >
                  {editEvent ? 'Update' : 'Add'} Event
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddEventModal;