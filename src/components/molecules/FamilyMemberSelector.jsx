import React from 'react';
import { motion } from 'framer-motion';
import Avatar from '@/components/atoms/Avatar';

const FamilyMemberSelector = ({ 
  members = [], 
  selectedMember = null, 
  onSelectMember,
  showAll = true,
  className = ''
}) => {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {showAll && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectMember(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            selectedMember === null 
              ? 'bg-primary-500 text-white shadow-md' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All
        </motion.button>
      )}
      
      {members.map((member) => (
        <motion.button
          key={member.Id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectMember(member.Id)}
          className={`p-1 rounded-full transition-all duration-200 ${
            selectedMember === member.Id 
              ? 'ring-2 ring-primary-500 ring-offset-2' 
              : 'hover:ring-2 hover:ring-gray-300 hover:ring-offset-2'
          }`}
        >
          <Avatar
            name={member.name}
            color={member.color}
            size="md"
            showBorder={selectedMember === member.Id}
          />
        </motion.button>
      ))}
    </div>
  );
};

export default FamilyMemberSelector;