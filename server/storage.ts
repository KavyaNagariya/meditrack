import { 
  type User, 
  type InsertUser, 
  type Patient, 
  type InsertPatient,
  type Doctor, 
  type InsertDoctor,
  type FamilyMember, 
  type InsertFamilyMember 
} from "@shared/schema";
import { randomUUID } from "crypto";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { users, patients, doctors, familyMembers } from "@shared/schema";

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
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserRole(userId: string, role: string): Promise<User>;
  
  // Patient operations
  getPatientByUserId(userId: string): Promise<Patient | undefined>;
  createPatient(patient: InsertPatient): Promise<Patient>;
  updatePatient(userId: string, details: Partial<InsertPatient>): Promise<Patient>;
  
  // Doctor operations
  getDoctorByUserId(userId: string): Promise<Doctor | undefined>;
  createDoctor(doctor: InsertDoctor): Promise<Doctor>;
  updateDoctor(userId: string, details: Partial<InsertDoctor>): Promise<Doctor>;
  
  // Family member operations
  getFamilyMemberByUserId(userId: string): Promise<FamilyMember | undefined>;
  createFamilyMember(familyMember: InsertFamilyMember): Promise<FamilyMember>;
  updateFamilyMember(userId: string, details: Partial<InsertFamilyMember>): Promise<FamilyMember>;
  
  // Helper methods
  getUserWithRoleData(userId: string): Promise<{user: User, roleData: Patient | Doctor | FamilyMember | null} | undefined>;
}

export class DbStorage implements IStorage {
  private async executeWithTimeout<T>(operation: Promise<T>, timeoutMs: number = 5000): Promise<T> {
    return Promise.race([
      operation,
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Query timeout')), timeoutMs)
      )
    ]);
  }

  async getUser(id: string): Promise<User | undefined> {
    if (!db || !client) {
      console.warn("Database not available, returning undefined for getUser");
      return undefined;
    }
    
    try {
      const result = await this.executeWithTimeout(
        db.select().from(users).where(eq(users.id, id))
      );
      return result[0];
    } catch (error) {
      console.error("Error in getUser:", error);
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
      const result = await this.executeWithTimeout(
        db.select().from(users).where(eq(users.username, username))
      );
      return result[0];
    } catch (error) {
      console.error("Error in getUserByUsername:", error);
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
      const userData = {
        ...insertUser,
        password: insertUser.password || null
      };
      
      const result = await this.executeWithTimeout(
        db.insert(users).values(userData).returning()
      );
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
      const result = await this.executeWithTimeout(
        db.update(users).set({ role, updatedAt: new Date() }).where(eq(users.id, userId)).returning()
      );
      return result[0];
    } catch (error) {
      console.error("Error in updateUserRole:", error);
      throw error;
    }
  }

  // Patient operations
  async getPatientByUserId(userId: string): Promise<Patient | undefined> {
    if (!db) return undefined;
    
    try {
      const result = await this.executeWithTimeout(
        db.select().from(patients).where(eq(patients.userId, userId))
      );
      return result[0];
    } catch (error) {
      console.error("Error in getPatientByUserId:", error);
      return undefined;
    }
  }

  async createPatient(patient: InsertPatient): Promise<Patient> {
    if (!db) throw new Error("Database not available");
    
    try {
      const result = await this.executeWithTimeout(
        db.insert(patients).values(patient).returning()
      );
      return result[0];
    } catch (error) {
      console.error("Error in createPatient:", error);
      throw error;
    }
  }

  async updatePatient(userId: string, details: Partial<InsertPatient>): Promise<Patient> {
    if (!db) throw new Error("Database not available");
    
    try {
      const result = await this.executeWithTimeout(
        db.update(patients).set({ ...details, updatedAt: new Date() }).where(eq(patients.userId, userId)).returning()
      );
      return result[0];
    } catch (error) {
      console.error("Error in updatePatient:", error);
      throw error;
    }
  }

  // Doctor operations
  async getDoctorByUserId(userId: string): Promise<Doctor | undefined> {
    if (!db) return undefined;
    
    try {
      const result = await this.executeWithTimeout(
        db.select().from(doctors).where(eq(doctors.userId, userId))
      );
      return result[0];
    } catch (error) {
      console.error("Error in getDoctorByUserId:", error);
      return undefined;
    }
  }

  async createDoctor(doctor: InsertDoctor): Promise<Doctor> {
    if (!db) throw new Error("Database not available");
    
    try {
      const result = await this.executeWithTimeout(
        db.insert(doctors).values(doctor).returning()
      );
      return result[0];
    } catch (error) {
      console.error("Error in createDoctor:", error);
      throw error;
    }
  }

  async updateDoctor(userId: string, details: Partial<InsertDoctor>): Promise<Doctor> {
    if (!db) throw new Error("Database not available");
    
    try {
      const result = await this.executeWithTimeout(
        db.update(doctors).set({ ...details, updatedAt: new Date() }).where(eq(doctors.userId, userId)).returning()
      );
      return result[0];
    } catch (error) {
      console.error("Error in updateDoctor:", error);
      throw error;
    }
  }

  // Family member operations
  async getFamilyMemberByUserId(userId: string): Promise<FamilyMember | undefined> {
    if (!db) return undefined;
    
    try {
      const result = await this.executeWithTimeout(
        db.select().from(familyMembers).where(eq(familyMembers.userId, userId))
      );
      return result[0];
    } catch (error) {
      console.error("Error in getFamilyMemberByUserId:", error);
      return undefined;
    }
  }

  async createFamilyMember(familyMember: InsertFamilyMember): Promise<FamilyMember> {
    if (!db) throw new Error("Database not available");
    
    try {
      const result = await this.executeWithTimeout(
        db.insert(familyMembers).values(familyMember).returning()
      );
      return result[0];
    } catch (error) {
      console.error("Error in createFamilyMember:", error);
      throw error;
    }
  }

  async updateFamilyMember(userId: string, details: Partial<InsertFamilyMember>): Promise<FamilyMember> {
    if (!db) throw new Error("Database not available");
    
    try {
      const result = await this.executeWithTimeout(
        db.update(familyMembers).set({ ...details, updatedAt: new Date() }).where(eq(familyMembers.userId, userId)).returning()
      );
      return result[0];
    } catch (error) {
      console.error("Error in updateFamilyMember:", error);
      throw error;
    }
  }

  async getUserWithRoleData(userId: string): Promise<{user: User, roleData: Patient | Doctor | FamilyMember | null} | undefined> {
    try {
      const user = await this.getUser(userId);
      if (!user) return undefined;

      let roleData: Patient | Doctor | FamilyMember | null = null;

      switch (user.role) {
        case 'patient':
          roleData = await this.getPatientByUserId(userId);
          break;
        case 'doctor':
          roleData = await this.getDoctorByUserId(userId);
          break;
        case 'family':
          roleData = await this.getFamilyMemberByUserId(userId);
          break;
      }

      return { user, roleData };
    } catch (error) {
      console.error("Error in getUserWithRoleData:", error);
      return undefined;
    }
  }
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private patients: Map<string, Patient> = new Map();
  private doctors: Map<string, Doctor> = new Map();
  private familyMembers: Map<string, FamilyMember> = new Map();

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
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserRole(userId: string, role: string): Promise<User> {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error("User not found");
    }
    
    const updatedUser = { ...user, role, updatedAt: new Date() };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  // Patient operations
  async getPatientByUserId(userId: string): Promise<Patient | undefined> {
    return Array.from(this.patients.values()).find(p => p.userId === userId);
  }

  async createPatient(patient: InsertPatient): Promise<Patient> {
    const id = randomUUID();
    const newPatient: Patient = {
      id,
      ...patient,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.patients.set(id, newPatient);
    return newPatient;
  }

  async updatePatient(userId: string, details: Partial<InsertPatient>): Promise<Patient> {
    const patient = Array.from(this.patients.values()).find(p => p.userId === userId);
    if (!patient) {
      throw new Error("Patient not found");
    }
    
    const updatedPatient = { ...patient, ...details, updatedAt: new Date() };
    this.patients.set(patient.id, updatedPatient);
    return updatedPatient;
  }

  // Doctor operations
  async getDoctorByUserId(userId: string): Promise<Doctor | undefined> {
    return Array.from(this.doctors.values()).find(d => d.userId === userId);
  }

  async createDoctor(doctor: InsertDoctor): Promise<Doctor> {
    const id = randomUUID();
    const newDoctor: Doctor = {
      id,
      ...doctor,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.doctors.set(id, newDoctor);
    return newDoctor;
  }

  async updateDoctor(userId: string, details: Partial<InsertDoctor>): Promise<Doctor> {
    const doctor = Array.from(this.doctors.values()).find(d => d.userId === userId);
    if (!doctor) {
      throw new Error("Doctor not found");
    }
    
    const updatedDoctor = { ...doctor, ...details, updatedAt: new Date() };
    this.doctors.set(doctor.id, updatedDoctor);
    return updatedDoctor;
  }

  // Family member operations
  async getFamilyMemberByUserId(userId: string): Promise<FamilyMember | undefined> {
    return Array.from(this.familyMembers.values()).find(f => f.userId === userId);
  }

  async createFamilyMember(familyMember: InsertFamilyMember): Promise<FamilyMember> {
    const id = randomUUID();
    const newFamilyMember: FamilyMember = {
      id,
      ...familyMember,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.familyMembers.set(id, newFamilyMember);
    return newFamilyMember;
  }

  async updateFamilyMember(userId: string, details: Partial<InsertFamilyMember>): Promise<FamilyMember> {
    const familyMember = Array.from(this.familyMembers.values()).find(f => f.userId === userId);
    if (!familyMember) {
      throw new Error("Family member not found");
    }
    
    const updatedFamilyMember = { ...familyMember, ...details, updatedAt: new Date() };
    this.familyMembers.set(familyMember.id, updatedFamilyMember);
    return updatedFamilyMember;
  }

  async getUserWithRoleData(userId: string): Promise<{user: User, roleData: Patient | Doctor | FamilyMember | null} | undefined> {
    const user = await this.getUser(userId);
    if (!user) return undefined;

    let roleData: Patient | Doctor | FamilyMember | null = null;

    switch (user.role) {
      case 'patient':
        roleData = await this.getPatientByUserId(userId);
        break;
      case 'doctor':
        roleData = await this.getDoctorByUserId(userId);
        break;
      case 'family':
        roleData = await this.getFamilyMemberByUserId(userId);
        break;
    }

    return { user, roleData };
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

  private async executeWithFallback<T>(
    dbOperation: () => Promise<T>,
    memOperation: () => Promise<T>
  ): Promise<T> {
    if (this.useDatabase) {
      try {
        return await dbOperation();
      } catch (error) {
        console.warn("Database operation failed, falling back to memory storage");
        this.useDatabase = false;
        return await memOperation();
      }
    }
    return await memOperation();
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.executeWithFallback(
      () => this.dbStorage.getUser(id),
      () => this.memStorage.getUser(id)
    );
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.executeWithFallback(
      () => this.dbStorage.getUserByUsername(username),
      () => this.memStorage.getUserByUsername(username)
    );
  }

  async createUser(user: InsertUser): Promise<User> {
    return this.executeWithFallback(
      async () => {
        const result = await this.dbStorage.createUser(user);
        // Backup to memory
        try { await this.memStorage.createUser(user); } catch (e) {}
        return result;
      },
      () => this.memStorage.createUser(user)
    );
  }

  async updateUserRole(userId: string, role: string): Promise<User> {
    return this.executeWithFallback(
      async () => {
        const result = await this.dbStorage.updateUserRole(userId, role);
        // Backup to memory
        try { await this.memStorage.updateUserRole(userId, role); } catch (e) {}
        return result;
      },
      () => this.memStorage.updateUserRole(userId, role)
    );
  }

  // Patient operations
  async getPatientByUserId(userId: string): Promise<Patient | undefined> {
    return this.executeWithFallback(
      () => this.dbStorage.getPatientByUserId(userId),
      () => this.memStorage.getPatientByUserId(userId)
    );
  }

  async createPatient(patient: InsertPatient): Promise<Patient> {
    return this.executeWithFallback(
      async () => {
        const result = await this.dbStorage.createPatient(patient);
        try { await this.memStorage.createPatient(patient); } catch (e) {}
        return result;
      },
      () => this.memStorage.createPatient(patient)
    );
  }

  async updatePatient(userId: string, details: Partial<InsertPatient>): Promise<Patient> {
    return this.executeWithFallback(
      async () => {
        const result = await this.dbStorage.updatePatient(userId, details);
        try { await this.memStorage.updatePatient(userId, details); } catch (e) {}
        return result;
      },
      () => this.memStorage.updatePatient(userId, details)
    );
  }

  // Doctor operations
  async getDoctorByUserId(userId: string): Promise<Doctor | undefined> {
    return this.executeWithFallback(
      () => this.dbStorage.getDoctorByUserId(userId),
      () => this.memStorage.getDoctorByUserId(userId)
    );
  }

  async createDoctor(doctor: InsertDoctor): Promise<Doctor> {
    return this.executeWithFallback(
      async () => {
        const result = await this.dbStorage.createDoctor(doctor);
        try { await this.memStorage.createDoctor(doctor); } catch (e) {}
        return result;
      },
      () => this.memStorage.createDoctor(doctor)
    );
  }

  async updateDoctor(userId: string, details: Partial<InsertDoctor>): Promise<Doctor> {
    return this.executeWithFallback(
      async () => {
        const result = await this.dbStorage.updateDoctor(userId, details);
        try { await this.memStorage.updateDoctor(userId, details); } catch (e) {}
        return result;
      },
      () => this.memStorage.updateDoctor(userId, details)
    );
  }

  // Family member operations
  async getFamilyMemberByUserId(userId: string): Promise<FamilyMember | undefined> {
    return this.executeWithFallback(
      () => this.dbStorage.getFamilyMemberByUserId(userId),
      () => this.memStorage.getFamilyMemberByUserId(userId)
    );
  }

  async createFamilyMember(familyMember: InsertFamilyMember): Promise<FamilyMember> {
    return this.executeWithFallback(
      async () => {
        const result = await this.dbStorage.createFamilyMember(familyMember);
        try { await this.memStorage.createFamilyMember(familyMember); } catch (e) {}
        return result;
      },
      () => this.memStorage.createFamilyMember(familyMember)
    );
  }

  async updateFamilyMember(userId: string, details: Partial<InsertFamilyMember>): Promise<FamilyMember> {
    return this.executeWithFallback(
      async () => {
        const result = await this.dbStorage.updateFamilyMember(userId, details);
        try { await this.memStorage.updateFamilyMember(userId, details); } catch (e) {}
        return result;
      },
      () => this.memStorage.updateFamilyMember(userId, details)
    );
  }

  async getUserWithRoleData(userId: string): Promise<{user: User, roleData: Patient | Doctor | FamilyMember | null} | undefined> {
    return this.executeWithFallback(
      () => this.dbStorage.getUserWithRoleData(userId),
      () => this.memStorage.getUserWithRoleData(userId)
    );
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