import { openDB, type IDBPDatabase } from "idb";

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

const DB_NAME = "UserActivityDB_Users";
const DB_VERSION = 1;
const USER_STORE = "users";

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
            keyPath: "id",
          });
          userStore.createIndex("email", "email", { unique: true });
          userStore.createIndex("createdAt", "createdAt", { unique: false });
        }
      },
    });

    return dbInstance;
  } catch (error) {
    console.error("Failed to initialize user database:", error);
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
    console.error("Error getting user:", error);
    throw error;
  }
}

/**
 * Get a user by email
 */
export async function getUserByEmail(email: string): Promise<User | undefined> {
  try {
    const db = await initUserDB();
    return db.getFromIndex(USER_STORE, "email", email);
  } catch (error) {
    console.error("Error getting user by email:", error);
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
    console.error("Error getting all users:", error);
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
    console.error("Error saving user:", error);
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
    console.error("Error deleting user:", error);
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
    console.error("Error getting user count:", error);
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
    console.error("Error clearing users:", error);
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
    console.error("Error resetting users:", error);
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
        id: "admin-1",
        name: "Liisa",
        surname: "Nieminen",
        email: "admin@hocus-focus.fi",
        password: "admin123",
        description:
          "Hocus Focus community administrator. Mother of two, dedicated to helping moms in Lahti stay active and connected.",
        picture: "/images/Screenshot 2026-01-23 at 10.59.42.png",
        role: "Administrator",
        createdAt: Math.floor(Date.now() / 1000),
      },
      {
        id: "user-1",
        name: "Sanna",
        surname: "Virtanen",
        email: "sanna.virtanen@email.com",
        password: "password123",
        description:
          "Mom of a 2-year-old. Love yoga and meeting other moms for outdoor activities. Looking to stay active while my little one naps!",
        picture: "/images/Screenshot 2026-01-23 at 10.59.48.png",
        role: "Active Mom",
        createdAt: Math.floor(Date.now() / 1000),
      },
      {
        id: "user-2",
        name: "Mia",
        surname: "Korhonen",
        email: "mia.korhonen@email.com",
        password: "password123",
        description:
          "Mother of twin girls (6 months). Former yoga instructor, now focusing on gentle exercises and connecting with other new moms.",
        picture: "/images/Screenshot 2026-01-23 at 11.16.47.png",
        role: "New Mom",
        createdAt: Math.floor(Date.now() / 1000),
      },
      {
        id: "user-3",
        name: "Aino",
        surname: "Mäkinen",
        email: "aino.makinen@email.com",
        password: "password123",
        description:
          "Mom of a 3-year-old boy. Love hiking and being in nature. Always looking for stroller-friendly walking groups!",
        picture: "/images/Screenshot 2026-01-23 at 11.14.48.jpg",
        role: "Outdoor Enthusiast",
        createdAt: Math.floor(Date.now() / 1000),
      },
      {
        id: "user-4",
        name: "Katri",
        surname: "Lehtonen",
        email: "katri.lehtonen@email.com",
        password: "password123",
        description:
          "First-time mom with a 4-month-old. Trying to get back into shape with gentle pilates and yoga.",
        picture: "/images/Screenshot 2026-01-23 at 11.14.26.png",
        role: "First-Time Mom",
        createdAt: Math.floor(Date.now() / 1000),
      },
      {
        id: "user-5",
        name: "Laura",
        surname: "Heinonen",
        email: "laura.heinonen@email.com",
        password: "password123",
        description:
          "Mom of two (ages 1 and 4). Pilates enthusiast and love organizing playdate activities for kids while we exercise!",
        picture: "/images/Screenshot 2026-01-23 at 11.15.45.png",
        role: "Active Mom",
        createdAt: Math.floor(Date.now() / 1000),
      },
      {
        id: "user-6",
        name: "Emilia",
        surname: "Jokinen",
        email: "emilia.jokinen@email.com",
        password: "password123",
        description:
          "New to Lahti with my 18-month-old daughter. Looking to meet other moms and stay active together.",
        picture: "/images/Screenshot 2026-01-23 at 11.06.02.png",
        role: "New to Lahti",
        createdAt: Math.floor(Date.now() / 1000),
      },
      {
        id: "user-7",
        name: "Hanna",
        surname: "Laine",
        email: "hanna.laine@email.com",
        password: "password123",
        description:
          "Mom of a 5-year-old and 2-year-old. Certified pilates instructor offering beginner-friendly sessions for busy moms.",
        picture: "/images/pexels-hasmukh-abchung-413074376-34770070.jpg",
        role: "Pilates Instructor",
        createdAt: Math.floor(Date.now() / 1000),
      },
      {
        id: "user-8",
        name: "Sofia",
        surname: "Koskinen",
        email: "sofia.koskinen@email.com",
        password: "password123",
        description:
          "Mother of three. Love the outdoors and organizing hiking groups for moms. Fresh air is the best medicine!",
        picture: "/images/pexels-dantemunozphoto-16259515.jpg",
        role: "Hiking Organizer",
        createdAt: Math.floor(Date.now() / 1000),
      },
      {
        id: "user-9",
        name: "Elina",
        surname: "Rantanen",
        email: "elina.rantanen@email.com",
        password: "password123",
        description:
          "Mom of a 1-year-old. Yoga has been my sanctuary during motherhood. Love sharing calm, mindful practices with other moms.",
        picture: "/images/home/miko/Downloads/pexels-buusecolak-30321633.jpg",
        role: "Yoga Enthusiast",
        createdAt: Math.floor(Date.now() / 1000),
      },
    ];

    const db = await initUserDB();
    for (const user of initialUsers) {
      await db.put(USER_STORE, user);
    }
  } catch (error) {
    console.error("Error seeding users:", error);
    throw error;
  }
}
