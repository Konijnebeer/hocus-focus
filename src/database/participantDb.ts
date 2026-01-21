import { openDB, type IDBPDatabase } from 'idb';

// ============ PARTICIPANT TYPE DEFINITION ============

export interface Participant {
  userId: string;
  activityId: string;
  joinedAt: number;
}

// ============ DATABASE SCHEMA ============

interface ParticipantDB {
  participants: {
    key: string;
    value: Participant;
    indexes: {
      userId: string;
      activityId: string;
    };
  };
}

// ============ DATABASE CONSTANTS ============

const DB_NAME = 'UserActivityDB_Participants';
const DB_VERSION = 1;
const PARTICIPANT_STORE = 'participants';

let dbInstance: IDBPDatabase<ParticipantDB> | null = null;

// ============ DATABASE INITIALIZATION ============

/**
 * Initialize and return the participant database instance.
 */
export async function initParticipantDB(): Promise<IDBPDatabase<ParticipantDB>> {
  if (dbInstance) {
    return dbInstance;
  }

  try {
    dbInstance = await openDB<ParticipantDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(PARTICIPANT_STORE)) {
          const participantStore = db.createObjectStore(PARTICIPANT_STORE, {
            keyPath: ['userId', 'activityId'],
          });
          participantStore.createIndex('userId', 'userId', { unique: false });
          participantStore.createIndex('activityId', 'activityId', {
            unique: false,
          });
        }
      },
    });

    return dbInstance;
  } catch (error) {
    console.error('Failed to initialize participant database:', error);
    throw error;
  }
}

// ============ PARTICIPANT OPERATIONS ============

/**
 * Get all participants in an activity
 */
export async function getActivityParticipants(
  activityId: string
): Promise<Participant[]> {
  try {
    const db = await initParticipantDB();
    return db.getAllFromIndex(PARTICIPANT_STORE, 'activityId', activityId);
  } catch (error) {
    console.error('Error getting activity participants:', error);
    throw error;
  }
}

/**
 * Get all activities a user joined
 */
export async function getUserActivities(userId: string): Promise<Participant[]> {
  try {
    const db = await initParticipantDB();
    return db.getAllFromIndex(PARTICIPANT_STORE, 'userId', userId);
  } catch (error) {
    console.error('Error getting user activities:', error);
    throw error;
  }
}

/**
 * Add a participant to an activity
 */
export async function addParticipant(
  userId: string,
  activityId: string
): Promise<void> {
  try {
    const db = await initParticipantDB();
    const now = Math.floor(Date.now() / 1000);
    const participant: Participant = {
      userId,
      activityId,
      joinedAt: now,
    };
    await db.put(PARTICIPANT_STORE, participant);
  } catch (error) {
    console.error('Error adding participant:', error);
    throw error;
  }
}

/**
 * Remove a participant from an activity
 */
export async function removeParticipant(
  userId: string,
  activityId: string
): Promise<void> {
  try {
    const db = await initParticipantDB();
    await db.delete(PARTICIPANT_STORE, [userId, activityId]);
  } catch (error) {
    console.error('Error removing participant:', error);
    throw error;
  }
}

/**
 * Check if a user is already a participant in an activity
 */
export async function isUserParticipant(
  userId: string,
  activityId: string
): Promise<boolean> {
  try {
    const db = await initParticipantDB();
    const participant = await db.get(PARTICIPANT_STORE, [userId, activityId]);
    return !!participant;
  } catch (error) {
    console.error('Error checking participant status:', error);
    throw error;
  }
}

/**
 * Get participant count
 */
export async function getParticipantCount(): Promise<number> {
  try {
    const db = await initParticipantDB();
    return db.count(PARTICIPANT_STORE);
  } catch (error) {
    console.error('Error getting participant count:', error);
    throw error;
  }
}

/**
 * Clear all participants
 */
export async function clearAllParticipants(): Promise<void> {
  try {
    const db = await initParticipantDB();
    await db.clear(PARTICIPANT_STORE);
  } catch (error) {
    console.error('Error clearing participants:', error);
    throw error;
  }
}
