import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password"), // Nullable for OAuth users
  role: text("role"), // User role
  // Patient details
  name: text("name"),
  contactNo: text("contact_no"),
  age: integer("age"),
  gender: text("gender"),
  dateOfBirth: date("date_of_birth"),
  occupation: text("occupation"),
  // Family details
  relationWithPatient: text("relation_with_patient"),
  patientName: text("patient_name"),
  // Doctor details
  employeeId: text("employee_id"),
  experience: integer("experience"),
  qualifications: text("qualifications"),
});

export const insertUserSchema = createInsertSchema(users, {
  password: z.string().optional().nullable(),
  role: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  contactNo: z.string().optional().nullable(),
  age: z.number().optional().nullable(),
  gender: z.string().optional().nullable(),
  dateOfBirth: z.string().optional().nullable(),
  occupation: z.string().optional().nullable(),
  relationWithPatient: z.string().optional().nullable(),
  patientName: z.string().optional().nullable(),
  employeeId: z.string().optional().nullable(),
  experience: z.number().optional().nullable(),
  qualifications: z.string().optional().nullable(),
}).pick({
  username: true,
  password: true,
  role: true,
  name: true,
  contactNo: true,
  age: true,
  gender: true,
  dateOfBirth: true,
  occupation: true,
  relationWithPatient: true,
  patientName: true,
  employeeId: true,
  experience: true,
  qualifications: true,
});

// Define the User type manually to avoid type issues
export type User = {
  id: string;
  username: string;
  password: string | null;
  role: string | null;
  name: string | null;
  contactNo: string | null;
  age: number | null;
  gender: string | null;
  dateOfBirth: string | null;
  occupation: string | null;
  relationWithPatient: string | null;
  patientName: string | null;
  employeeId: string | null;
  experience: number | null;
  qualifications: string | null;
};

export type InsertUser = z.infer<typeof insertUserSchema>;