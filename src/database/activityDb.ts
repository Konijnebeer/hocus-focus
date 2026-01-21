import { openDB, type IDBPDatabase } from 'idb';

// ============ ACTIVITY TYPE DEFINITION ============

export interface Activity {
  id: string;
  image: string;
  title: string;
  description: string;
  category: string;
  location: string;
  duration: number; // in minutes
  numParticipants: number;
  date: string; // YYYY-MM-DD format
  hour: string; // HH:mm format
  status: 'active' | 'completed' | 'cancelled';
  creatorId: string; // user ID of the activity creator
  createdAt: number; // when the activity was created (timestamp)
}

// ============ DATABASE SCHEMA ============

interface ActivityDB {
  activities: {
    key: string;
    value: Activity;
    indexes: {
      creatorId: string;
      category: string;
      status: string;
      date: string;
      createdAt: number;
    };
  };
}

// ============ DATABASE CONSTANTS ============

const DB_NAME = 'UserActivityDB_Activities';
const DB_VERSION = 1;
const ACTIVITY_STORE = 'activities';

let dbInstance: IDBPDatabase<ActivityDB> | null = null;

// ============ DATABASE INITIALIZATION ============

/**
 * Initialize and return the activity database instance.
 */
export async function initActivityDB(): Promise<IDBPDatabase<ActivityDB>> {
  if (dbInstance) {
    return dbInstance;
  }

  try {
    dbInstance = await openDB<ActivityDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(ACTIVITY_STORE)) {
          const activityStore = db.createObjectStore(ACTIVITY_STORE, {
            keyPath: 'id',
          });
          activityStore.createIndex('creatorId', 'creatorId', {
            unique: false,
          });
          activityStore.createIndex('category', 'category', { unique: false });
          activityStore.createIndex('status', 'status', { unique: false });
          activityStore.createIndex('date', 'date', { unique: false });
          activityStore.createIndex('createdAt', 'createdAt', { unique: false });
        }
      },
    });

    return dbInstance;
  } catch (error) {
    console.error('Failed to initialize activity database:', error);
    throw error;
  }
}

// ============ ACTIVITY OPERATIONS ============

/**
 * Get an activity by ID
 */
export async function getActivity(
  activityId: string
): Promise<Activity | undefined> {
  try {
    const db = await initActivityDB();
    return db.get(ACTIVITY_STORE, activityId);
  } catch (error) {
    console.error('Error getting activity:', error);
    throw error;
  }
}

/**
 * Get all activities
 */
export async function getAllActivities(): Promise<Activity[]> {
  try {
    const db = await initActivityDB();
    return db.getAll(ACTIVITY_STORE);
  } catch (error) {
    console.error('Error getting all activities:', error);
    throw error;
  }
}

/**
 * Get activities by creator
 */
export async function getActivitiesByCreator(
  creatorId: string
): Promise<Activity[]> {
  try {
    const db = await initActivityDB();
    return db.getAllFromIndex(ACTIVITY_STORE, 'creatorId', creatorId);
  } catch (error) {
    console.error('Error getting activities by creator:', error);
    throw error;
  }
}

/**
 * Get activities by category
 */
export async function getActivitiesByCategory(
  category: string
): Promise<Activity[]> {
  try {
    const db = await initActivityDB();
    return db.getAllFromIndex(ACTIVITY_STORE, 'category', category);
  } catch (error) {
    console.error('Error getting activities by category:', error);
    throw error;
  }
}

/**
 * Get activities by status
 */
export async function getActivitiesByStatus(
  status: 'active' | 'completed' | 'cancelled'
): Promise<Activity[]> {
  try {
    const db = await initActivityDB();
    return db.getAllFromIndex(ACTIVITY_STORE, 'status', status);
  } catch (error) {
    console.error('Error getting activities by status:', error);
    throw error;
  }
}

/**
 * Save or update an activity
 */
export async function saveActivity(activity: Activity): Promise<void> {
  try {
    const db = await initActivityDB();
    const now = Math.floor(Date.now() / 1000);
    const activityToSave: Activity = {
      ...activity,
      createdAt: activity.createdAt || now,
    };
    await db.put(ACTIVITY_STORE, activityToSave);
  } catch (error) {
    console.error('Error saving activity:', error);
    throw error;
  }
}

/**
 * Delete an activity
 */
export async function deleteActivity(activityId: string): Promise<void> {
  try {
    const db = await initActivityDB();
    await db.delete(ACTIVITY_STORE, activityId);
  } catch (error) {
    console.error('Error deleting activity:', error);
    throw error;
  }
}

/**
 * Get activity count
 */
export async function getActivityCount(): Promise<number> {
  try {
    const db = await initActivityDB();
    return db.count(ACTIVITY_STORE);
  } catch (error) {
    console.error('Error getting activity count:', error);
    throw error;
  }
}

/**
 * Clear all activities
 */
export async function clearAllActivities(): Promise<void> {
  try {
    const db = await initActivityDB();
    await db.clear(ACTIVITY_STORE);
  } catch (error) {
    console.error('Error clearing activities:', error);
    throw error;
  }
}
