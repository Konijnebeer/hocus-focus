// Export all user operations
export {
  getUser,
  getUserByEmail,
  getAllUsers,
  saveUser,
  deleteUser,
  getUserCount,
  clearAllUsers,
  initUserDB,
  type User,
} from './userDb';

// Export all activity operations
export {
  getActivity,
  getAllActivities,
  getActivitiesByCreator,
  getActivitiesByCategory,
  getActivitiesByStatus,
  saveActivity,
  deleteActivity,
  getActivityCount,
  clearAllActivities,
  initActivityDB,
  type Activity,
} from './activityDb';

// Export all participant operations
export {
  getActivityParticipants,
  getUserActivities,
  addParticipant,
  removeParticipant,
  isUserParticipant,
  getParticipantCount,
  clearAllParticipants,
  initParticipantDB,
  type Participant,
} from './participantDb';

/**
 * Initialize all databases
 */
export async function initAllDatabases(): Promise<void> {
  try {
    await Promise.all([
      import('./userDb').then(m => m.initUserDB()),
      import('./activityDb').then(m => m.initActivityDB()),
      import('./participantDb').then(m => m.initParticipantDB()),
    ]);
  } catch (error) {
    console.error('Error initializing databases:', error);
    throw error;
  }
}

/**
 * Get database stats
 */
export async function getDBStats(): Promise<{
  users: number;
  activities: number;
  participants: number;
}> {
  try {
    const { getUserCount } = await import('./userDb');
    const { getActivityCount } = await import('./activityDb');
    const { getParticipantCount } = await import('./participantDb');

    const users = await getUserCount();
    const activities = await getActivityCount();
    const participants = await getParticipantCount();

    return { users, activities, participants };
  } catch (error) {
    console.error('Error getting DB stats:', error);
    throw error;
  }
}

/**
 * Clear all data (use with caution!)
 */
export async function clearAllData(): Promise<void> {
  try {
    const { clearAllUsers } = await import('./userDb');
    const { clearAllActivities } = await import('./activityDb');
    const { clearAllParticipants } = await import('./participantDb');

    await Promise.all([
      clearAllUsers(),
      clearAllActivities(),
      clearAllParticipants(),
    ]);
  } catch (error) {
    console.error('Error clearing all data:', error);
    throw error;
  }
}
