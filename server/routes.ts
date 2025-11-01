import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import passport from "passport";
import { Strategy as GoogleStrategy, type VerifyCallback } from "passport-google-oauth20";
import session from "express-session";
import { randomUUID } from "crypto";
import type { Profile } from "passport-google-oauth20";

// Extend Express session type
declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}

// Initialize passport
export function initializeAuth(app: Express) {
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
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: "/auth/google/callback",
        },
        async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
          try {
            // Check if user already exists
            let user = await storage.getUserByUsername(profile.id);
            
            if (!user) {
              // Create new user
              user = await storage.createUser({
                username: profile.id,
                password: "", // No password for Google auth users
              });
            }
            
            return done(null, user);
          } catch (error) {
            return done(error as Error, undefined);
          }
        }
      )
    );
  }
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
      if (user && user.password === password) {
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

  // Google OAuth routes
  app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile"] })
  );

  app.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req: Request, res: Response) => {
      // Successful authentication, redirect to home
      res.redirect("/");
    }
  );

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  const httpServer = createServer(app);

  return httpServer;
}