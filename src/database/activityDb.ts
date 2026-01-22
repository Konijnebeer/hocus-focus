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

/**
 * Reset activities data (delete all and reseed)
 */
export async function resetActivities(): Promise<void> {
    try {
        await clearAllActivities();
        dbInstance = null; // Reset instance
        await seedActivities();
    } catch (error) {
        console.error('Error resetting activities:', error);
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
            // Yoga & stretching (low pressure, outdoor / community)
            {
                id: 'yoga-1',
                title: 'Gentle Yoga at Pikku-Vesijärvi Park',
                description: 'A relaxed outdoor yoga session focused on breathing and gentle movement.',
                image: '/images/yoga1.jpg',
                category: 'yoga',
                location: 'Pikku-Vesijärvi Park, Lahti',
                duration: 60,
                numParticipants: 0,
                date: new Date().toISOString().split('T')[0],
                hour: '09:30',
                status: 'active',
                creatorId: 'system',
                createdAt: Math.floor(Date.now() / 1000),
            },
            {
                id: 'yoga-2',
                title: 'Morning Stretch & Relax',
                description: 'Light stretching and relaxation to start the day calmly.',
                image: '/images/yoga2.jpg',
                category: 'yoga',
                location: 'Radiomäki Park, Lahti',
                duration: 45,
                numParticipants: 0,
                date: new Date().toISOString().split('T')[0],
                hour: '10:00',
                status: 'active',
                creatorId: 'system',
                createdAt: Math.floor(Date.now() / 1000),
            },
            {
                id: 'yoga-3',
                title: 'Indoor Yoga for Beginners',
                description: 'Beginner-friendly yoga session with simple movements and a calm pace.',
                image: '/images/yoga3.jpg',
                category: 'yoga',
                location: 'Lahti Community Centre',
                duration: 60,
                numParticipants: 0,
                date: new Date().toISOString().split('T')[0],
                hour: '14:00',
                status: 'active',
                creatorId: 'system',
                createdAt: Math.floor(Date.now() / 1000),
            },
            {
                id: 'yoga-4',
                title: 'Indoor Yoga for Beginners',
                description: 'Beginner-friendly yoga session with simple movements and a calm pace.',
                image: '/images/yoga3.jpg',
                category: 'yoga',
                location: 'Lahti Community Centre',
                duration: 60,
                numParticipants: 0,
                date: new Date().toISOString().split('T')[0],
                hour: '14:00',
                status: 'active',
                creatorId: 'system',
                createdAt: Math.floor(Date.now() / 1000),
            },

             {
                id: 'yoga-5',
                title: 'Indoor Yoga for Beginners',
                description: 'Beginner-friendly yoga session with simple movements and a calm pace.',
                image: '/images/yoga3.jpg',
                category: 'yoga',
                location: 'Lahti Community Centre',
                duration: 60,
                numParticipants: 0,
                date: new Date().toISOString().split('T')[0],
                hour: '14:00',
                status: 'active',
                creatorId: 'system',
                createdAt: Math.floor(Date.now() / 1000),
            },

            // Hiking / walking (very Finland-appropriate)
            {
                id: 'hiking-1',
                title: 'Easy Forest Walk',
                description: 'A slow-paced walk through nearby forest paths. No experience needed.',
                image: '/images/hiking1.jpg',
                category: 'hiking',
                location: 'Salpausselkä Trails, Lahti',
                duration: 90,
                numParticipants: 0,
                date: new Date().toISOString().split('T')[0],
                hour: '10:30',
                status: 'active',
                creatorId: 'system',
                createdAt: Math.floor(Date.now() / 1000),
            },
            {
                id: 'hiking-2',
                title: 'Stroller-Friendly Walking Group',
                description: 'Relaxed walk suitable for parents with strollers.',
                image: '/images/hiking2.jpg',
                category: 'hiking',
                location: 'Niemi Beach Area, Lahti',
                duration: 60,
                numParticipants: 0,
                date: new Date().toISOString().split('T')[0],
                hour: '11:00',
                status: 'active',
                creatorId: 'system',
                createdAt: Math.floor(Date.now() / 1000),
            },

            // Pilates (low intensity, beginner friendly)
            {
                id: 'pilates-1',
                title: 'Gentle Pilates for Beginners',
                description: 'Low-intensity pilates focused on mobility and core awareness.',
                image: '/images/pilates1.jpg',
                category: 'pilates',
                location: 'Lahti Adult Education Centre',
                duration: 60,
                numParticipants: 0,
                date: new Date().toISOString().split('T')[0],
                hour: '10:00',
                status: 'active',
                creatorId: 'system',
                createdAt: Math.floor(Date.now() / 1000),
            },
            {
                id: 'pilates-2',
                title: 'Mat Pilates – Slow Pace',
                description: 'A calm pilates session with simple exercises and breaks.',
                image: '/images/pilates2.jpg',
                category: 'pilates',
                location: 'Laune Family Park Indoor Space, Lahti',
                duration: 45,
                numParticipants: 0,
                date: new Date().toISOString().split('T')[0],
                hour: '11:30',
                status: 'active',
                creatorId: 'system',
                createdAt: Math.floor(Date.now() / 1000),
            },
            {
                id: 'pilates-3',
                title: 'Postnatal Pilates (Beginner)',
                description: 'Gentle pilates designed for women after pregnancy.',
                image: '/images/pilates3.jpg',
                category: 'pilates',
                location: 'Lahti Community Health Centre',
                duration: 45,
                numParticipants: 0,
                date: new Date().toISOString().split('T')[0],
                hour: '15:00',
                status: 'active',
                creatorId: 'system',
                createdAt: Math.floor(Date.now() / 1000),
            },
        ];

        const db = await initActivityDB();
        for (const activity of initialActivities) {
            await db.put(ACTIVITY_STORE, activity);
        }
    } catch (error) {
        console.error('Error seeding activities:', error);
        throw error;
    }
}
