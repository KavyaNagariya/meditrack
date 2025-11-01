import { type User, type InsertUser } from "@shared/schema";
import { randomUUID } from "crypto";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { users } from "@shared/schema";

// Initialize database connection with error handling
let db: ReturnType<typeof drizzle> | null = null;
let client: ReturnType<typeof postgres> | null = null;

try {
  const databaseUrl = process.env.DATABASE_URL;
  if (databaseUrl) {
    client = postgres(databaseUrl);
    db = drizzle(client);
    console.log("Database connection initialized successfully");
  } else {
    console.warn("DATABASE_URL not set, database operations will not be available");
  }
} catch (error) {
  console.error("Failed to initialize database connection:", error);
}

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

export class DbStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    if (!db) {
      console.warn("Database not available, returning undefined for getUser");
      return undefined;
    }
    
    try {
      const result = await db.select().from(users).where(eq(users.id, id));
      return result[0];
    } catch (error) {
      console.error("Error in getUser:", error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    if (!db) {
      console.warn("Database not available, returning undefined for getUserByUsername");
      return undefined;
    }
    
    try {
      const result = await db.select().from(users).where(eq(users.username, username));
      return result[0];
    } catch (error) {
      console.error("Error in getUserByUsername:", error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    if (!db) {
      throw new Error("Database not available");
    }
    
    try {
      // Handle null/undefined password for OAuth users
      const userData = {
        ...insertUser,
        password: insertUser.password || null
      };
      
      const result = await db.insert(users).values(userData).returning();
      return result[0];
    } catch (error) {
      console.error("Error in createUser:", error);
      throw error;
    }
  }
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;

  constructor() {
    this.users = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      password: insertUser.password ?? null 
    };
    this.users.set(id, user);
    return user;
  }
}

// Use database storage if available, otherwise fall back to memory storage
export const storage = db ? new DbStorage() : new MemStorage();