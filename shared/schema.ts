import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, date, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Main users table for authentication
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password"), // Nullable for OAuth users
  role: text("role"), // User role: 'patient', 'doctor', 'family'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Patients table
export const patients = pgTable("patients", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  contactNo: text("contact_no"),
  age: integer("age"),
  gender: text("gender"),
  dateOfBirth: date("date_of_birth"),
  occupation: text("occupation"),
  emergencyContact: text("emergency_contact"),
  address: text("address"),
  medicalHistory: text("medical_history"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Doctors table
export const doctors = pgTable("doctors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  contactNo: text("contact_no"),
  employeeId: text("employee_id").unique(),
  gender: text("gender"),
  age: integer("age"),
  experience: integer("experience"),
  qualifications: text("qualifications"),
  specialization: text("specialization"),
  department: text("department"),
  licenseNumber: text("license_number"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Family members table
export const familyMembers = pgTable("family_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  patientId: varchar("patient_id").notNull().references(() => patients.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  contactNo: text("contact_no"),
  relationWithPatient: text("relation_with_patient").notNull(),
  gender: text("gender"),
  age: integer("age"),
  isEmergencyContact: text("is_emergency_contact").default("false"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Schema validations
export const insertUserSchema = createInsertSchema(users, {
  password: z.string().optional().nullable(),
  role: z.enum(["patient", "doctor", "family"]).optional().nullable(),
}).pick({
  username: true,
  password: true,
  role: true,
});

export const insertPatientSchema = createInsertSchema(patients, {
  name: z.string().min(1, "Name is required"),
  contactNo: z.string().optional().nullable(),
  age: z.number().min(0).max(150).optional().nullable(),
  gender: z.enum(["male", "female", "other"]).optional().nullable(),
  dateOfBirth: z.string().optional().nullable(),
  occupation: z.string().optional().nullable(),
  emergencyContact: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  medicalHistory: z.string().optional().nullable(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDoctorSchema = createInsertSchema(doctors, {
  name: z.string().min(1, "Name is required"),
  contactNo: z.string().optional().nullable(),
  employeeId: z.string().min(1, "Employee ID is required"),
  gender: z.enum(["male", "female", "other"]).optional().nullable(),
  age: z.number().min(18).max(100).optional().nullable(),
  experience: z.number().min(0).max(50).optional().nullable(),
  qualifications: z.string().optional().nullable(),
  specialization: z.string().optional().nullable(),
  department: z.string().optional().nullable(),
  licenseNumber: z.string().optional().nullable(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFamilyMemberSchema = createInsertSchema(familyMembers, {
  name: z.string().min(1, "Name is required"),
  contactNo: z.string().optional().nullable(),
  relationWithPatient: z.string().min(1, "Relationship is required"),
  gender: z.enum(["male", "female", "other"]).optional().nullable(),
  age: z.number().min(0).max(150).optional().nullable(),
  isEmergencyContact: z.enum(["true", "false"]).default("false"),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type User = {
  id: string;
  username: string;
  password: string | null;
  role: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export type Patient = {
  id: string;
  userId: string;
  name: string;
  contactNo: string | null;
  age: number | null;
  gender: string | null;
  dateOfBirth: string | null;
  occupation: string | null;
  emergencyContact: string | null;
  address: string | null;
  medicalHistory: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export type Doctor = {
  id: string;
  userId: string;
  name: string;
  contactNo: string | null;
  employeeId: string | null;
  gender: string | null;
  age: number | null;
  experience: number | null;
  qualifications: string | null;
  specialization: string | null;
  department: string | null;
  licenseNumber: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export type FamilyMember = {
  id: string;
  userId: string;
  patientId: string;
  name: string;
  contactNo: string | null;
  relationWithPatient: string;
  gender: string | null;
  age: number | null;
  isEmergencyContact: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertPatient = z.infer<typeof insertPatientSchema>;
export type InsertDoctor = z.infer<typeof insertDoctorSchema>;
export type InsertFamilyMember = z.infer<typeof insertFamilyMemberSchema>;