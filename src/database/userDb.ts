import { openDB, type IDBPDatabase } from 'idb';

// ============ USER TYPE DEFINITION ============

export interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  description?: string;
  picture?: string;
  role?: string;
  createdAt: number;
}

// ============ DATABASE SCHEMA ============

interface UserDB {
  users: {
    key: string;
    value: User;
    indexes: {
      email: string;
      createdAt: number;
    };
  };
}

// ============ DATABASE CONSTANTS ============

const DB_NAME = 'UserActivityDB_Users';
const DB_VERSION = 1;
const USER_STORE = 'users';

let dbInstance: IDBPDatabase<UserDB> | null = null;

// ============ DATABASE INITIALIZATION ============

/**
 * Initialize and return the user database instance.
 */
export async function initUserDB(): Promise<IDBPDatabase<UserDB>> {
  if (dbInstance) {
    return dbInstance;
  }

  try {
    dbInstance = await openDB<UserDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(USER_STORE)) {
          const userStore = db.createObjectStore(USER_STORE, {
            keyPath: 'id',
          });
          userStore.createIndex('email', 'email', { unique: true });
          userStore.createIndex('createdAt', 'createdAt', { unique: false });
        }
      },
    });

    return dbInstance;
  } catch (error) {
    console.error('Failed to initialize user database:', error);
    throw error;
  }
}

// ============ USER OPERATIONS ============

/**
 * Get a user by ID
 */
export async function getUser(userId: string): Promise<User | undefined> {
  try {
    const db = await initUserDB();
    return db.get(USER_STORE, userId);
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
}

/**
 * Get a user by email
 */
export async function getUserByEmail(email: string): Promise<User | undefined> {
  try {
    const db = await initUserDB();
    return db.getFromIndex(USER_STORE, 'email', email);
  } catch (error) {
    console.error('Error getting user by email:', error);
    throw error;
  }
}

/**
 * Get all users
 */
export async function getAllUsers(): Promise<User[]> {
  try {
    const db = await initUserDB();
    return db.getAll(USER_STORE);
  } catch (error) {
    console.error('Error getting all users:', error);
    throw error;
  }
}

/**
 * Save or update a user
 */
export async function saveUser(user: User): Promise<void> {
  try {
    const db = await initUserDB();
    const now = Math.floor(Date.now() / 1000);
    const userToSave: User = {
      ...user,
      createdAt: user.createdAt || now,
    };
    await db.put(USER_STORE, userToSave);
  } catch (error) {
    console.error('Error saving user:', error);
    throw error;
  }
}

/**
 * Delete a user
 */
export async function deleteUser(userId: string): Promise<void> {
  try {
    const db = await initUserDB();
    await db.delete(USER_STORE, userId);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}

/**
 * Get user count
 */
export async function getUserCount(): Promise<number> {
  try {
    const db = await initUserDB();
    return db.count(USER_STORE);
  } catch (error) {
    console.error('Error getting user count:', error);
    throw error;
  }
}

/**
 * Clear all users
 */
export async function clearAllUsers(): Promise<void> {
  try {
    const db = await initUserDB();
    await db.clear(USER_STORE);
  } catch (error) {
    console.error('Error clearing users:', error);
    throw error;
  }
}

/**
 * Reset users data (delete all and reseed)
 */
export async function resetUsers(): Promise<void> {
  try {
    await clearAllUsers();
    dbInstance = null; // Reset instance
    await seedUsers();
  } catch (error) {
    console.error('Error resetting users:', error);
    throw error;
  }
}

/**
 * Seed initial users data
 */
export async function seedUsers(): Promise<void> {
  try {
    const count = await getUserCount();
    if (count > 0) {
      return; // Data already exists
    }

    const initialUsers: User[] = [
      {
        id: 'user-1',
        name: 'Emma',
        surname: 'Virtanen',
        email: 'emma.virtanen@email.com',
        password: 'password123',
        description: 'Passionate about outdoor activities and wellness. I love organizing community events that bring people together for healthy living and fun experiences.',
        picture: '/images/user1.jpg',
        role: 'Community Organizer',
        createdAt: Math.floor(Date.now() / 1000),
      },
      {
        id: 'user-2',
        name: 'Mikko',
        surname: 'Lahtinen',
        email: 'mikko.lahtinen@email.com',
        password: 'password123',
        description: 'Yoga instructor with 5 years of experience. I believe in the power of mindfulness and helping others find peace through movement.',
        picture: '/images/user2.jpg',
        role: 'Yoga Instructor',
        createdAt: Math.floor(Date.now() / 1000),
      },
      {
        id: 'user-3',
        name: 'Aino',
        surname: 'Koskinen',
        email: 'aino.koskinen@email.com',
        password: 'password123',
        description: 'Fitness enthusiast and hiking guide. Love exploring nature trails around Lahti and sharing the beauty of Finnish outdoors with others.',
        picture: '/images/user3.jpg',
        role: 'Hiking Guide',
        createdAt: Math.floor(Date.now() / 1000),
      },
      {
        id: 'system',
        name: 'System',
        surname: 'Admin',
        email: 'admin@hocus-focus.com',
        password: 'admin123',
        description: 'Official Hocus Focus platform administrator. Creating and managing activities for the community.',
        picture: '/images/admin.jpg',
        role: 'Administrator',
        createdAt: Math.floor(Date.now() / 1000),
      },
    ];

    const db = await initUserDB();
    for (const user of initialUsers) {
      await db.put(USER_STORE, user);
    }
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}
