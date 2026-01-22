import { openDB, type IDBPDatabase } from "idb";

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

const DB_NAME = "UserActivityDB_Participants";
const DB_VERSION = 1;
const PARTICIPANT_STORE = "participants";

let dbInstance: IDBPDatabase<ParticipantDB> | null = null;

// ============ DATABASE INITIALIZATION ============

/**
 * Initialize and return the participant database instance.
 */
export async function initParticipantDB(): Promise<
  IDBPDatabase<ParticipantDB>
> {
  if (dbInstance) {
    return dbInstance;
  }

  try {
    dbInstance = await openDB<ParticipantDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(PARTICIPANT_STORE)) {
          const participantStore = db.createObjectStore(PARTICIPANT_STORE, {
            keyPath: ["userId", "activityId"],
          });
          participantStore.createIndex("userId", "userId", { unique: false });
          participantStore.createIndex("activityId", "activityId", {
            unique: false,
          });
        }
      },
    });

    return dbInstance;
  } catch (error) {
    console.error("Failed to initialize participant database:", error);
    throw error;
  }
}

// ============ PARTICIPANT OPERATIONS ============

/**
 * Get all participants in an activity
 */
export async function getActivityParticipants(
  activityId: string,
): Promise<Participant[]> {
  try {
    const db = await initParticipantDB();
    return db.getAllFromIndex(PARTICIPANT_STORE, "activityId", activityId);
  } catch (error) {
    console.error("Error getting activity participants:", error);
    throw error;
  }
}

/**
 * Get all activities a user joined
 */
export async function getUserActivities(
  userId: string,
): Promise<Participant[]> {
  try {
    const db = await initParticipantDB();
    return db.getAllFromIndex(PARTICIPANT_STORE, "userId", userId);
  } catch (error) {
    console.error("Error getting user activities:", error);
    throw error;
  }
}

/**
 * Add a participant to an activity
 */
export async function addParticipant(
  userId: string,
  activityId: string,
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
    console.error("Error adding participant:", error);
    throw error;
  }
}

/**
 * Remove a participant from an activity
 */
export async function removeParticipant(
  userId: string,
  activityId: string,
): Promise<void> {
  try {
    const db = await initParticipantDB();
    await db.delete(PARTICIPANT_STORE, [userId, activityId]);
  } catch (error) {
    console.error("Error removing participant:", error);
    throw error;
  }
}

/**
 * Check if a user is already a participant in an activity
 */
export async function isUserParticipant(
  userId: string,
  activityId: string,
): Promise<boolean> {
  try {
    const db = await initParticipantDB();
    const participant = await db.get(PARTICIPANT_STORE, [userId, activityId]);
    return !!participant;
  } catch (error) {
    console.error("Error checking participant status:", error);
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
    console.error("Error getting participant count:", error);
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
    console.error("Error clearing participants:", error);
    throw error;
  }
}

/**
 * Reset participants data (delete all and reseed)
 */
export async function resetParticipants(): Promise<void> {
  try {
    await clearAllParticipants();
    dbInstance = null; // Reset instance
    await seedParticipants();
  } catch (error) {
    console.error("Error resetting participants:", error);
    throw error;
  }
}

/**
 * Seed initial participants data
 */
export async function seedParticipants(): Promise<void> {
  try {
    const count = await getParticipantCount();
    if (count > 0) {
      return; // Data already exists
    }

    const initialParticipants: Participant[] = [
      // User-1 (Sanna) - creator of yoga-1, yoga-6
      {
        userId: "user-1",
        activityId: "yoga-2",
        joinedAt: Math.floor(Date.now() / 1000) - 86400 * 5,
      },
      {
        userId: "user-1",
        activityId: "pilates-1",
        joinedAt: Math.floor(Date.now() / 1000) - 86400 * 4,
      },
      {
        userId: "user-1",
        activityId: "hiking-1",
        joinedAt: Math.floor(Date.now() / 1000) - 86400 * 3,
      },
      {
        userId: "user-1",
        activityId: "pilates-3",
        joinedAt: Math.floor(Date.now() / 1000) - 86400 * 2,
      },

      // User-2 (Mia) - creator of yoga-2, yoga-4
      {
        userId: "user-2",
        activityId: "yoga-1",
        joinedAt: Math.floor(Date.now() / 1000) - 86400 * 6,
      },
      {
        userId: "user-2",
        activityId: "yoga-3",
        joinedAt: Math.floor(Date.now() / 1000) - 86400 * 5,
      },
      {
        userId: "user-2",
        activityId: "pilates-2",
        joinedAt: Math.floor(Date.now() / 1000) - 86400 * 4,
      },
      {
        userId: "user-2",
        activityId: "hiking-2",
        joinedAt: Math.floor(Date.now() / 1000) - 86400 * 2,
      },

      // User-3 (Aino) - creator of hiking-1, hiking-3
      {
        userId: "user-3",
        activityId: "yoga-1",
        joinedAt: Math.floor(Date.now() / 1000) - 86400 * 5,
      },
      {
        userId: "user-3",
        activityId: "yoga-5",
        joinedAt: Math.floor(Date.now() / 1000) - 86400 * 4,
      },
      {
        userId: "user-3",
        activityId: "pilates-1",
        joinedAt: Math.floor(Date.now() / 1000) - 86400 * 3,
      },
      {
        userId: "user-3",
        activityId: "pilates-4",
        joinedAt: Math.floor(Date.now() / 1000) - 86400 * 2,
      },

      // User-4 (Katri) - no activities created
      {
        userId: "user-4",
        activityId: "yoga-2",
        joinedAt: Math.floor(Date.now() / 1000) - 86400 * 4,
      },
      {
        userId: "user-4",
        activityId: "pilates-1",
        joinedAt: Math.floor(Date.now() / 1000) - 86400 * 3,
      },
      {
        userId: "user-4",
        activityId: "pilates-3",
        joinedAt: Math.floor(Date.now() / 1000) - 86400 * 2,
      },
      {
        userId: "user-4",
        activityId: "hiking-1",
        joinedAt: Math.floor(Date.now() / 1000) - 86400,
      },

      // User-5 (Laura) - creator of pilates-2, pilates-5
      {
        userId: "user-5",
        activityId: "yoga-3",
        joinedAt: Math.floor(Date.now() / 1000) - 86400 * 5,
      },
      {
        userId: "user-5",
        activityId: "yoga-7",
        joinedAt: Math.floor(Date.now() / 1000) - 86400 * 4,
      },
      {
        userId: "user-5",
        activityId: "hiking-2",
        joinedAt: Math.floor(Date.now() / 1000) - 86400 * 3,
      },
      {
        userId: "user-5",
        activityId: "pilates-1",
        joinedAt: Math.floor(Date.now() / 1000) - 86400 * 2,
      },

      // User-6 (Emilia) - no activities created
      {
        userId: "user-6",
        activityId: "yoga-1",
        joinedAt: Math.floor(Date.now() / 1000) - 86400 * 6,
      },
      {
        userId: "user-6",
        activityId: "yoga-4",
        joinedAt: Math.floor(Date.now() / 1000) - 86400 * 5,
      },
      {
        userId: "user-6",
        activityId: "pilates-2",
        joinedAt: Math.floor(Date.now() / 1000) - 86400 * 3,
      },
      {
        userId: "user-6",
        activityId: "hiking-3",
        joinedAt: Math.floor(Date.now() / 1000) - 86400 * 2,
      },

      // User-7 (Hanna) - creator of pilates-1, pilates-3
      {
        userId: "user-7",
        activityId: "yoga-2",
        joinedAt: Math.floor(Date.now() / 1000) - 86400 * 4,
      },
      {
        userId: "user-7",
        activityId: "yoga-6",
        joinedAt: Math.floor(Date.now() / 1000) - 86400 * 3,
      },
      {
        userId: "user-7",
        activityId: "hiking-1",
        joinedAt: Math.floor(Date.now() / 1000) - 86400 * 2,
      },
      {
        userId: "user-7",
        activityId: "pilates-5",
        joinedAt: Math.floor(Date.now() / 1000) - 86400,
      },

      // User-8 (Sofia) - creator of hiking-2
      {
        userId: "user-8",
        activityId: "yoga-3",
        joinedAt: Math.floor(Date.now() / 1000) - 86400 * 5,
      },
      {
        userId: "user-8",
        activityId: "yoga-5",
        joinedAt: Math.floor(Date.now() / 1000) - 86400 * 4,
      },
      {
        userId: "user-8",
        activityId: "hiking-1",
        joinedAt: Math.floor(Date.now() / 1000) - 86400 * 3,
      },
      {
        userId: "user-8",
        activityId: "pilates-2",
        joinedAt: Math.floor(Date.now() / 1000) - 86400 * 2,
      },

      // User-9 (Elina) - creator of yoga-3, yoga-7
      {
        userId: "user-9",
        activityId: "yoga-1",
        joinedAt: Math.floor(Date.now() / 1000) - 86400 * 6,
      },
      {
        userId: "user-9",
        activityId: "yoga-5",
        joinedAt: Math.floor(Date.now() / 1000) - 86400 * 5,
      },
      {
        userId: "user-9",
        activityId: "hiking-3",
        joinedAt: Math.floor(Date.now() / 1000) - 86400 * 3,
      },
      {
        userId: "user-9",
        activityId: "pilates-4",
        joinedAt: Math.floor(Date.now() / 1000) - 86400 * 2,
      },

      // Additional cross-participation
      {
        userId: "user-1",
        activityId: "yoga-3",
        joinedAt: Math.floor(Date.now() / 1000) - 86400,
      },
      {
        userId: "user-2",
        activityId: "hiking-3",
        joinedAt: Math.floor(Date.now() / 1000) - 86400,
      },
      {
        userId: "user-3",
        activityId: "yoga-7",
        joinedAt: Math.floor(Date.now() / 1000) - 86400,
      },
      {
        userId: "user-4",
        activityId: "yoga-5",
        joinedAt: Math.floor(Date.now() / 1000) - 86400,
      },
      {
        userId: "user-5",
        activityId: "hiking-1",
        joinedAt: Math.floor(Date.now() / 1000) - 86400,
      },
      {
        userId: "user-6",
        activityId: "pilates-4",
        joinedAt: Math.floor(Date.now() / 1000) - 86400,
      },
      {
        userId: "user-7",
        activityId: "yoga-4",
        joinedAt: Math.floor(Date.now() / 1000) - 86400,
      },
      {
        userId: "user-8",
        activityId: "pilates-3",
        joinedAt: Math.floor(Date.now() / 1000) - 86400,
      },
      {
        userId: "user-9",
        activityId: "pilates-2",
        joinedAt: Math.floor(Date.now() / 1000) - 86400,
      },
    ];

    const db = await initParticipantDB();
    for (const participant of initialParticipants) {
      await db.put(PARTICIPANT_STORE, participant);
    }
  } catch (error) {
    console.error("Error seeding participants:", error);
    throw error;
  }
}
