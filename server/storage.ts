import { type User, type InsertUser } from "@shared/schema";
import { randomUUID } from "crypto";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { users } from "@shared/schema";

// Initialize database connection with error handling and connection pooling
let db: ReturnType<typeof drizzle> | null = null;
let client: ReturnType<typeof postgres> | null = null;

try {
  const databaseUrl = process.env.DATABASE_URL;
  if (databaseUrl) {
    // Configure postgres client with connection pooling and timeout settings
    client = postgres(databaseUrl, {
      max: 10, // Maximum number of connections in the pool
      idle_timeout: 20, // Close idle connections after 20 seconds
      connect_timeout: 10, // Connection timeout in seconds
      prepare: false, // Disable prepared statements for better compatibility
      ssl: 'require', // Ensure SSL is required
      connection: {
        application_name: 'meditrack_app'
      }
    });
    
    db = drizzle(client);
    console.log("Database connection initialized successfully with connection pooling");
    
    // Test the connection
    testDatabaseConnection();
  } else {
    console.warn("DATABASE_URL not set, database operations will not be available");
  }
} catch (error) {
  console.error("Failed to initialize database connection:", error);
}

// Test database connection
async function testDatabaseConnection() {
  if (!client) return;
  
  try {
    await client`SELECT 1 as test`;
    console.log("Database connection test successful");
  } catch (error) {
    console.error("Database connection test failed:", error);
    // Fall back to memory storage if database is not available
    db = null;
    client = null;
  }
}

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserRole(userId: string, role: string): Promise<User>;
  updateUserDetails(userId: string, details: Partial<User>): Promise<User>;
}

export class DbStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    if (!db || !client) {
      console.warn("Database not available, returning undefined for getUser");
      return undefined;
    }
    
    try {
      // Add timeout to the query
      const result = await Promise.race([
        db.select().from(users).where(eq(users.id, id)),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Query timeout')), 5000)
        )
      ]);
      return result[0];
    } catch (error) {
      console.error("Error in getUser:", error);
      
      // If it's a connection error, try to reconnect
      if (error instanceof Error && error.message.includes('timeout')) {
        console.log("Attempting to reconnect to database...");
        await testDatabaseConnection();
      }
      
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    if (!db || !client) {
      console.warn("Database not available, returning undefined for getUserByUsername");
      return undefined;
    }
    
    try {
      // Add timeout to the query
      const result = await Promise.race([
        db.select().from(users).where(eq(users.username, username)),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Query timeout')), 5000)
        )
      ]);
      return result[0];
    } catch (error) {
      console.error("Error in getUserByUsername:", error);
      
      // If it's a connection error, try to reconnect
      if (error instanceof Error && error.message.includes('timeout')) {
        console.log("Attempting to reconnect to database...");
        await testDatabaseConnection();
      }
      
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    if (!db) {
      throw new Error("Database not available");
    }
    
    try {
      // Handle null/undefined password for OAuth users
      const userData: any = {
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

  async updateUserRole(userId: string, role: string): Promise<User> {
    if (!db) {
      throw new Error("Database not available");
    }
    
    try {
      const result = await db.update(users)
        .set({ role })
        .where(eq(users.id, userId))
        .returning();
      return result[0];
    } catch (error) {
      console.error("Error in updateUserRole:", error);
      throw error;
    }
  }

  async updateUserDetails(userId: string, details: Partial<User>): Promise<User> {
    if (!db) {
      throw new Error("Database not available");
    }
    
    try {
      const result = await db.update(users)
        .set(details)
        .where(eq(users.id, userId))
        .returning();
      return result[0];
    } catch (error) {
      console.error("Error in updateUserDetails:", error);
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
      id,
      username: insertUser.username,
      password: insertUser.password ?? null,
      role: insertUser.role ?? null,
      name: insertUser.name ?? null,
      contactNo: insertUser.contactNo ?? null,
      age: insertUser.age ?? null,
      gender: insertUser.gender ?? null,
      dateOfBirth: insertUser.dateOfBirth ?? null,
      occupation: insertUser.occupation ?? null,
      relationWithPatient: insertUser.relationWithPatient ?? null,
      patientName: insertUser.patientName ?? null,
      employeeId: insertUser.employeeId ?? null,
      experience: insertUser.experience ?? null,
      qualifications: insertUser.qualifications ?? null
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserRole(userId: string, role: string): Promise<User> {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error("User not found");
    }
    
    const updatedUser = { ...user, role };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async updateUserDetails(userId: string, details: Partial<User>): Promise<User> {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error("User not found");
    }
    
    const updatedUser = { ...user, ...details };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }
}

// Hybrid storage that falls back to memory when database is unavailable
class HybridStorage implements IStorage {
  private dbStorage: DbStorage;
  private memStorage: MemStorage;
  private useDatabase: boolean;

  constructor() {
    this.dbStorage = new DbStorage();
    this.memStorage = new MemStorage();
    this.useDatabase = db !== null;
  }

  async getUser(id: string): Promise<User | undefined> {
    if (this.useDatabase) {
      try {
        const result = await this.dbStorage.getUser(id);
        return result;
      } catch (error) {
        console.warn("Database operation failed, falling back to memory storage");
        this.useDatabase = false;
        return this.memStorage.getUser(id);
      }
    }
    return this.memStorage.getUser(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    if (this.useDatabase) {
      try {
        const result = await this.dbStorage.getUserByUsername(username);
        return result;
      } catch (error) {
        console.warn("Database operation failed, falling back to memory storage");
        this.useDatabase = false;
        return this.memStorage.getUserByUsername(username);
      }
    }
    return this.memStorage.getUserByUsername(username);
  }

  async createUser(user: InsertUser): Promise<User> {
    if (this.useDatabase) {
      try {
        const result = await this.dbStorage.createUser(user);
        // Also store in memory as backup
        await this.memStorage.createUser(user);
        return result;
      } catch (error) {
        console.warn("Database operation failed, falling back to memory storage");
        this.useDatabase = false;
        return this.memStorage.createUser(user);
      }
    }
    return this.memStorage.createUser(user);
  }

  async updateUserRole(userId: string, role: string): Promise<User> {
    if (this.useDatabase) {
      try {
        const result = await this.dbStorage.updateUserRole(userId, role);
        // Also update in memory as backup
        try {
          await this.memStorage.updateUserRole(userId, role);
        } catch (e) {
          // Ignore memory storage errors for updates
        }
        return result;
      } catch (error) {
        console.warn("Database operation failed, falling back to memory storage");
        this.useDatabase = false;
        return this.memStorage.updateUserRole(userId, role);
      }
    }
    return this.memStorage.updateUserRole(userId, role);
  }

  async updateUserDetails(userId: string, details: Partial<User>): Promise<User> {
    if (this.useDatabase) {
      try {
        const result = await this.dbStorage.updateUserDetails(userId, details);
        // Also update in memory as backup
        try {
          await this.memStorage.updateUserDetails(userId, details);
        } catch (e) {
          // Ignore memory storage errors for updates
        }
        return result;
      } catch (error) {
        console.warn("Database operation failed, falling back to memory storage");
        this.useDatabase = false;
        return this.memStorage.updateUserDetails(userId, details);
      }
    }
    return this.memStorage.updateUserDetails(userId, details);
  }

  // Method to check if database is available and switch back if it becomes available
  async checkDatabaseHealth(): Promise<boolean> {
    if (!this.useDatabase && db) {
      try {
        await this.dbStorage.getUserByUsername("health_check_test");
        console.log("Database is back online, switching to database storage");
        this.useDatabase = true;
        return true;
      } catch (error) {
        return false;
      }
    }
    return this.useDatabase;
  }
}

// Use hybrid storage that can fall back between database and memory
export const storage = new HybridStorage();

// Periodic health check to reconnect to database if it becomes available
if (typeof setInterval !== 'undefined') {
  setInterval(async () => {
    try {
      await (storage as HybridStorage).checkDatabaseHealth();
    } catch (error) {
      // Ignore errors in health check
    }
  }, 30000); // Check every 30 seconds
}