import { useState, useEffect } from 'react';
import familyService from '@/services/api/familyService';
import eventsService from '@/services/api/eventsService';

export const useFamilyData = () => {
  const [familyMembers, setFamilyMembers] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
      console.error('Family data load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    familyMembers,
    setFamilyMembers,
    events,
    setEvents,
    loading,
    error,
    refetch: loadData
  };
};