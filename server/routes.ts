import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import passport from "passport";
import { Strategy as GoogleStrategy, type VerifyCallback } from "passport-google-oauth20";
import session from "express-session";
import { randomUUID } from "crypto";
import type { Profile } from "passport-google-oauth20";
import { type User, type InsertUser } from "@shared/schema";

// Extend Express session type
declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}

// Store Google OAuth credentials at module level
let googleClientId: string | undefined;
let googleClientSecret: string | undefined;

// Initialize passport
export function initializeAuth(app: Express) {
  // Load environment variables
  googleClientId = process.env.GOOGLE_CLIENT_ID;
  googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
  
  console.log("Google OAuth Configuration Check:");
  console.log("  GOOGLE_CLIENT_ID:", googleClientId ? `${googleClientId.substring(0, 20)}...` : "NOT SET");
  console.log("  GOOGLE_CLIENT_SECRET:", googleClientSecret ? "SET" : "NOT SET");
  
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "fallback_secret_key_for_development",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  // Passport configuration
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  // Google OAuth strategy
  if (googleClientId && googleClientSecret) {
    // Determine the callback URL - prioritize explicit setting, then BASE_URL, then default
    const port = process.env.PORT || "3000";
    const baseUrl = process.env.BASE_URL || `http://localhost:${port}`;
    const callbackURL = process.env.GOOGLE_CALLBACK_URL || `${baseUrl}/auth/google/callback`;
    console.log("  Callback URL:", callbackURL);
    console.log("  ⚠️  IMPORTANT: This callback URL must match EXACTLY in Google Cloud Console");
    
    passport.use(new GoogleStrategy({
      clientID: googleClientId,
      clientSecret: googleClientSecret,
      callbackURL: callbackURL,
    }, async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
      try {
        console.log("Google OAuth profile received:", {
          id: profile.id,
          displayName: profile.displayName,
          emails: profile.emails?.map(e => e.value),
        });
        
        // Use email as username, fallback to profile ID
        const username = profile.emails && profile.emails[0]?.value 
          ? profile.emails[0].value 
          : profile.id;
        
        if (!username) {
          console.error("Google OAuth: No username available from profile");
          return done(new Error("Unable to get user information from Google"), undefined);
        }
        
        console.log("Using username for Google OAuth user:", username);
        
        // Check if user already exists
        let user = await storage.getUserByUsername(username);
        
        if (!user) {
          console.log("Creating new user for Google OAuth:", username);
          // Create new user with no password for Google OAuth
          user = await storage.createUser({
            username: username,
            password: null, // No password for Google auth users
            role: null,
            name: profile.displayName || null,
            contactNo: null,
            age: null,
            gender: null,
            dateOfBirth: null,
            occupation: null,
            relationWithPatient: null,
            patientName: null,
            employeeId: null,
            experience: null,
            qualifications: null
          } as InsertUser);
          console.log("New user created:", user.id);
        } else {
          console.log("Existing user found:", user.id);
        }
        
        return done(null, user);
      } catch (error) {
        console.error("Google OAuth error:", error);
        return done(error as Error, undefined);
      }
    }));
  } else {
    console.warn("Google OAuth not configured - missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET");
  }
}

// Middleware to check if user is authenticated
function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session!.userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize authentication
  initializeAuth(app);

  // put application routes here
  // prefix all routes with /api

  // Auth routes
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      // Validate input
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      // Find user
      const user = await storage.getUserByUsername(username);
      
      // Check if user exists and password matches
      // Note: In a real app, you would hash the password
      // OAuth users have null/undefined password
      if (user && user.password && user.password === password) {
        // Set session
        req.session!.userId = user.id;
        return res.json({ 
          message: "Login successful", 
          user: { id: user.id, username: user.username } 
        });
      }
      
      return res.status(401).json({ message: "Invalid credentials" });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/auth/signup", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      // Validate input
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }
      
      // Create user
      const user = await storage.createUser({ username, password });
      
      // Set session
      req.session!.userId = user.id;
      
      return res.status(201).json({ 
        message: "Signup successful", 
        user: { id: user.id, username: user.username } 
      });
    } catch (error) {
      console.error("Signup error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.session!.destroy(() => {});
    res.json({ message: "Logout successful" });
  });

  app.get("/api/auth/user", (req: Request, res: Response) => {
    if (req.session!.userId) {
      return res.json({ userId: req.session!.userId });
    }
    return res.status(401).json({ message: "Not authenticated" });
  });

  // Role routes
  app.get("/api/auth/role", requireAuth, async (req: Request, res: Response) => {
    try {
      // Check if userId exists
      if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.json({ role: user.role || null });
    } catch (error) {
      console.error("Get role error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/auth/role", requireAuth, async (req: Request, res: Response) => {
    try {
      const { role } = req.body;
      
      // Validate input
      if (!role) {
        return res.status(400).json({ message: "Role is required" });
      }
      
      // Check if userId exists
      if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      // Update user role
      const updatedUser = await storage.updateUserRole(req.session.userId, role);
      
      return res.json({ message: "Role updated successfully" });
    } catch (error) {
      console.error("Set role error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // User details routes
  app.get("/api/auth/details", requireAuth, async (req: Request, res: Response) => {
    try {
      // Check if userId exists
      if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Return user details (excluding sensitive information)
      const { id, username, password, ...details } = user;
      return res.json(details);
    } catch (error) {
      console.error("Get details error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/auth/details", requireAuth, async (req: Request, res: Response) => {
    try {
      // Check if userId exists
      if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const details = req.body;
      
      // Update user details
      const updatedUser = await storage.updateUserDetails(req.session.userId, details);
      
      return res.json({ message: "Details updated successfully" });
    } catch (error) {
      console.error("Set details error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Google OAuth routes
  app.get(
    "/auth/google",
    (req: Request, res: Response, next: NextFunction) => {
      if (!googleClientId || !googleClientSecret) {
        console.error("Google OAuth not configured - missing credentials");
        return res.status(500).json({ 
          message: "Google OAuth is not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your environment variables." 
        });
      }
      console.log("Initiating Google OAuth authentication...");
      passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
    }
  );

  app.get(
    "/auth/google/callback",
    (req: Request, res: Response, next: NextFunction) => {
      passport.authenticate("google", { failureRedirect: "/login?error=google_auth_failed" })(
        req,
        res,
        (err: any) => {
          if (err) {
            console.error("Google OAuth authentication error:", err);
            return res.redirect("/login?error=google_auth_failed");
          }
          
          try {
            // Set session after successful Google authentication
            if (req.user && typeof req.user === 'object' && 'id' in req.user) {
              req.session!.userId = req.user.id as string;
              console.log("Google OAuth successful, session set for user:", req.user.id);
            } else {
              console.error("Google OAuth successful but user object is invalid:", req.user);
              return res.redirect("/login?error=callback_error");
            }
            // Successful authentication, redirect to role selection
            res.redirect("/role-selection");
          } catch (error) {
            console.error("Google OAuth callback error:", error);
            res.redirect("/login?error=callback_error");
          }
        }
      );
    }
  );

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  const httpServer = createServer(app);

  return httpServer;
}