import { openDB, type IDBPDatabase } from "idb";

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
  status: "active" | "completed" | "cancelled";
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

const DB_NAME = "UserActivityDB_Activities";
const DB_VERSION = 1;
const ACTIVITY_STORE = "activities";

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
            keyPath: "id",
          });
          activityStore.createIndex("creatorId", "creatorId", {
            unique: false,
          });
          activityStore.createIndex("category", "category", { unique: false });
          activityStore.createIndex("status", "status", { unique: false });
          activityStore.createIndex("date", "date", { unique: false });
          activityStore.createIndex("createdAt", "createdAt", {
            unique: false,
          });
        }
      },
    });

    return dbInstance;
  } catch (error) {
    console.error("Failed to initialize activity database:", error);
    throw error;
  }
}

// ============ ACTIVITY OPERATIONS ============

/**
 * Get an activity by ID
 */
export async function getActivity(
  activityId: string,
): Promise<Activity | undefined> {
  try {
    const db = await initActivityDB();
    return db.get(ACTIVITY_STORE, activityId);
  } catch (error) {
    console.error("Error getting activity:", error);
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
    console.error("Error getting all activities:", error);
    throw error;
  }
}

/**
 * Get activities by creator
 */
export async function getActivitiesByCreator(
  creatorId: string,
): Promise<Activity[]> {
  try {
    const db = await initActivityDB();
    return db.getAllFromIndex(ACTIVITY_STORE, "creatorId", creatorId);
  } catch (error) {
    console.error("Error getting activities by creator:", error);
    throw error;
  }
}

/**
 * Get activities by category
 */
export async function getActivitiesByCategory(
  category: string,
): Promise<Activity[]> {
  try {
    const db = await initActivityDB();
    return db.getAllFromIndex(ACTIVITY_STORE, "category", category);
  } catch (error) {
    console.error("Error getting activities by category:", error);
    throw error;
  }
}

/**
 * Get activities by status
 */
export async function getActivitiesByStatus(
  status: "active" | "completed" | "cancelled",
): Promise<Activity[]> {
  try {
    const db = await initActivityDB();
    return db.getAllFromIndex(ACTIVITY_STORE, "status", status);
  } catch (error) {
    console.error("Error getting activities by status:", error);
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
    console.error("Error saving activity:", error);
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
    console.error("Error deleting activity:", error);
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
    console.error("Error getting activity count:", error);
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
    console.error("Error clearing activities:", error);
    throw error;
  }
}

/**
 * Reset activities data (delete all and reseed)
 */
export async function resetActivities(): Promise<void> {
  try {
    await clearAllActivities();
    dbInstance = null; // Reset instance
    await seedActivities();
  } catch (error) {
    console.error("Error resetting activities:", error);
    throw error;
  }
}

/**
 * Seed initial activities data
 */
export async function seedActivities(): Promise<void> {
  try {
    const count = await getActivityCount();
    if (count > 0) {
      return; // Data already exists
    }

    const initialActivities: Activity[] = [
      // YOGA ACTIVITIES (7 total)
      {
        id: "yoga-1",
        title: "Morning Mama Yoga",
        description:
          "Gentle yoga for new moms. Bring your baby if needed! Focus on breathing, gentle stretches, and connecting with other mothers.",
        image: "/images/pexels-polina-tankilevitch-8539124.jpg",
        category: "yoga",
        location: "Pikku-Vesijärvi Park, Lahti",
        duration: 60,
        numParticipants: 12,
        date: new Date().toISOString().split("T")[0],
        hour: "09:00",
        status: "active",
        creatorId: "user-1",
        createdAt: Math.floor(new Date('2026-01-21').getTime() / 1000),
      },
      {
        id: "yoga-2",
        title: "Mindful Mom Meditation & Stretch",
        description:
          "Calm your mind and stretch your body. Perfect for busy moms needing a peaceful moment.",
        image: "/images/pexels-yankrukov-8436715.jpg",
        category: "yoga",
        location: "Radiomäki Park, Lahti",
        duration: 45,
        numParticipants: 10,
        date: new Date().toISOString().split("T")[0],
        hour: "10:00",
        status: "active",
        creatorId: "user-2",
        createdAt: Math.floor(new Date('2026-01-13').getTime() / 1000),
      },
      {
        id: "yoga-3",
        title: "Postnatal Yoga Flow",
        description:
          "Designed specifically for recovery. Gentle movements to rebuild strength and flexibility.",
        image: "/images/pexels-yankrukov-8436685.jpg",
        category: "yoga",
        location: "Lahti Community Centre",
        duration: 60,
        numParticipants: 15,
        date: new Date().toISOString().split("T")[0],
        hour: "11:00",
        status: "active",
        creatorId: "user-9",
        createdAt: Math.floor(new Date('2026-01-29').getTime() / 1000),
      },
      {
        id: "yoga-4",
        title: "Yoga for Tired Moms",
        description:
          "Low-energy yoga session focusing on relaxation and simple stretches. No experience needed!",
        image: "/images/pexels-ketut-subiyanto-4998823.jpg",
        category: "yoga",
        location: "Lahti Family Center",
        duration: 50,
        numParticipants: 8,
        date: new Date().toISOString().split("T")[0],
        hour: "14:00",
        status: "active",
        creatorId: "user-2",
        createdAt: Math.floor(new Date('2026-02-02').getTime() / 1000),
      },
      {
        id: "yoga-5",
        title: "Weekend Wellness Yoga",
        description:
          "Saturday morning yoga for moms. Kids welcome to play nearby while we practice mindfulness.",
        image: "/images/yoga1.jpg",
        category: "yoga",
        location: "Lahti Sports Park Outdoor Area",
        duration: 60,
        numParticipants: 20,
        date: new Date().toISOString().split("T")[0],
        hour: "09:30",
        status: "active",
        creatorId: "admin-1",
        createdAt: Math.floor(new Date('2026-01-15').getTime() / 1000),
      },
      {
        id: "yoga-6",
        title: "Beginner Mom Yoga",
        description:
          "Never done yoga? Perfect! This class is designed for complete beginners who are moms.",
        image: "/images/pexels-shvetsa-4587346.jpg",
        category: "yoga",
        location: "Fellmanni Library Hall, Lahti",
        duration: 55,
        numParticipants: 12,
        date: new Date().toISOString().split("T")[0],
        hour: "10:30",
        status: "active",
        creatorId: "user-1",
        createdAt: Math.floor(new Date('2026-02-15').getTime() / 1000),
      },
      {
        id: "yoga-7",
        title: "Evening Relaxation Yoga",
        description:
          "End your day peacefully with gentle yoga and deep relaxation techniques for busy mothers.",
        image: "/images/pexels-polina-tankilevitch-8538994.jpg",
        category: "yoga",
        location: "Lahti Wellness Studio",
        duration: 60,
        numParticipants: 10,
        date: new Date().toISOString().split("T")[0],
        hour: "18:00",
        status: "active",
        creatorId: "user-9",
        createdAt: Math.floor(new Date('2026-01-30').getTime() / 1000),
      },

      // HIKING ACTIVITIES (3 total)
      {
        id: "hiking-1",
        title: "Stroller-Friendly Nature Walk",
        description:
          "Easy walking paths suitable for strollers. Meet other moms while enjoying fresh Finnish air!",
        image: "/images/pexels-josh-willink-11499-701016.jpg",
        category: "hiking",
        location: "Salpausselkä Trail (Easy Section), Lahti",
        duration: 75,
        numParticipants: 15,
        date: new Date().toISOString().split("T")[0],
        hour: "10:00",
        status: "active",
        creatorId: "user-3",
        createdAt: Math.floor(new Date('2026-02-04').getTime() / 1000),
      },
      {
        id: "hiking-2",
        title: "Mom & Tot Forest Adventure",
        description:
          "Slow-paced forest walk with stops for kids to explore nature. Toddlers welcome!",
        image: "/images/pexels-pixabay-236973.jpg",
        category: "hiking",
        location: "Messilä Nature Reserve, Lahti",
        duration: 90,
        numParticipants: 12,
        date: new Date().toISOString().split("T")[0],
        hour: "11:00",
        status: "active",
        creatorId: "user-8",
        createdAt: Math.floor(new Date('2026-02-05').getTime() / 1000),
      },
      {
        id: "hiking-3",
        title: "Lakeside Walking Group",
        description:
          "Beautiful walk around Vesijärvi Lake. Perfect for chatting with other moms while staying active.",
        image: "/images/pexels-josh-willink-11499-701016.jpg",
        category: "hiking",
        location: "Vesijärvi Lakeside Path, Lahti",
        duration: 60,
        numParticipants: 18,
        date: new Date().toISOString().split("T")[0],
        hour: "14:00",
        status: "active",
        creatorId: "user-3",
        createdAt: Math.floor(new Date('2026-01-29').getTime() / 1000),
      },

      // PILATES ACTIVITIES (5 total)
      {
        id: "pilates-1",
        title: "Core Restore Pilates",
        description:
          "Focus on rebuilding core strength after pregnancy. Suitable for all postnatal stages.",
        image: "/images/pexels-gustavo-fring-3984361.jpg",
        category: "pilates",
        location: "Lahti Family Wellness Center",
        duration: 50,
        numParticipants: 10,
        date: new Date().toISOString().split("T")[0],
        hour: "09:30",
        status: "active",
        creatorId: "user-7",
        createdAt: Math.floor(new Date('2026-02-10').getTime() / 1000),
      },
      {
        id: "pilates-2",
        title: "Gentle Mat Pilates for Moms",
        description:
          "Low-impact pilates session focusing on flexibility and gentle strengthening.",
        image: "/images/pexels-n1ch01as-9288130.jpg",
        category: "pilates",
        location: "Laune Family Park, Lahti",
        duration: 45,
        numParticipants: 12,
        date: new Date().toISOString().split("T")[0],
        hour: "10:30",
        status: "active",
        creatorId: "user-5",
        createdAt: Math.floor(new Date('2026-02-10').getTime() / 1000),
      },
      {
        id: "pilates-3",
        title: "Postnatal Pilates Recovery",
        description:
          "Specialized pilates for new mothers. Safe exercises for everyone.",
        image: "/images/pexels-n1ch01as-9288130.jpg",
        category: "pilates",
        location: "Lahti Community Health Centre",
        duration: 45,
        numParticipants: 8,
        date: new Date().toISOString().split("T")[0],
        hour: "13:00",
        status: "active",
        creatorId: "user-7",
        createdAt: Math.floor(new Date('2026-02-06').getTime() / 1000),
      },
      {
        id: "pilates-4",
        title: "Pilates for Busy Moms",
        description:
          "45-minute effective pilates session that fits into your busy schedule.",
        image: "/images/pexels-gustavo-fring-8769164.jpg",
        category: "pilates",
        location: "Lahti Adult Education Centre",
        duration: 45,
        numParticipants: 10,
        date: new Date().toISOString().split("T")[0],
        hour: "15:00",
        status: "active",
        creatorId: "admin-1",
        createdAt: Math.floor(new Date('2026-02-23').getTime() / 1000),
      },
      {
        id: "pilates-5",
        title: "Strength & Stretch Pilates",
        description:
          "Balance strength building with relaxing stretches. All fitness levels welcome!",
        image: "/images/pexels-ketut-subiyanto-4998823.jpg",
        category: "pilates",
        location: "Lahti Sports Center Studio",
        duration: 60,
        numParticipants: 12,
        date: new Date().toISOString().split("T")[0],
        hour: "16:00",
        status: "active",
        creatorId: "user-5",
        createdAt: Math.floor(Date.now() / 1000),
      },
    ];

    const db = await initActivityDB();
    for (const activity of initialActivities) {
      await db.put(ACTIVITY_STORE, activity);
    }
  } catch (error) {
    console.error("Error seeding activities:", error);
    throw error;
  }
}
