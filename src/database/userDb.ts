import { openDB, type IDBPDatabase } from 'idb';

// ============ USER TYPE DEFINITION ============

export interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
  password: string;
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
