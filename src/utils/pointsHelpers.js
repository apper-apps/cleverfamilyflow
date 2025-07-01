export const calculateMemberPoints = (events, memberId) => {
  const memberChores = events.filter(event => 
    event.assigneeId === memberId && 
    event.type === 'chore' && 
    event.completed
  );
  
  return memberChores.reduce((total, chore) => total + (chore.points || 10), 0);
};

export const getFamilyLeaderboard = (familyMembers, events) => {
  return familyMembers
    .map(member => ({
      ...member,
      earnedPoints: calculateMemberPoints(events, member.Id)
    }))
    .sort((a, b) => b.earnedPoints - a.earnedPoints);
};

export const getPointsForPeriod = (events, memberId, period = 'week') => {
  const now = new Date();
  let startDate;
  
  switch (period) {
    case 'today':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case 'week':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    default:
      startDate = new Date(0);
  }
  
  const periodEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate >= startDate && 
           event.assigneeId === memberId && 
           event.type === 'chore' && 
           event.completed;
  });
  
  return periodEvents.reduce((total, chore) => total + (chore.points || 10), 0);
};