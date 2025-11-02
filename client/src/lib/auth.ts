// Authentication utility functions

export interface AuthUser {
  userId: string;
}

export interface UserRole {
  role: string | null;
}

export interface ProfileStatus {
  hasRole: boolean;
  hasRoleData: boolean;
  role: string | null;
  shouldRedirectToDashboard: boolean;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const response = await fetch("/api/auth/user", {
      credentials: "include",
    });
    
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

export async function getUserRole(): Promise<UserRole> {
  try {
    const response = await fetch("/api/auth/role", {
      credentials: "include",
    });
    
    if (response.ok) {
      return await response.json();
    }
    return { role: null };
  } catch (error) {
    console.error("Error getting user role:", error);
    return { role: null };
  }
}

export async function getUserDetails(): Promise<any> {
  try {
    const response = await fetch("/api/auth/details", {
      credentials: "include",
    });
    
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error("Error getting user details:", error);
    return null;
  }
}

export async function getProfileStatus(): Promise<ProfileStatus | null> {
  try {
    const response = await fetch("/api/auth/profile-status", {
      credentials: "include",
    });
    
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error("Error getting profile status:", error);
    return null;
  }
}

export async function logout(): Promise<boolean> {
  try {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    
    return response.ok;
  } catch (error) {
    console.error("Error during logout:", error);
    return false;
  }
}

// Smart redirect function
export function getRedirectPath(profileStatus: ProfileStatus): string {
  if (!profileStatus.hasRole) {
    return "/role-selection";
  }
  
  if (!profileStatus.hasRoleData) {
    return `/details/${profileStatus.role}`;
  }
  
  return `/dashboard/${profileStatus.role}`;
}

// Additional auth functions for backward compatibility
export async function signup(credentials: { username: string; password: string }): Promise<any> {
  try {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(credentials),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Signup failed");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
}

export async function login(credentials: { username: string; password: string }): Promise<any> {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(credentials),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

export async function setUserDetails(details: any): Promise<any> {
  try {
    const response = await fetch("/api/auth/details", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(details),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update details");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Set details error:", error);
    throw error;
  }
}

export async function setUserRole(role: string): Promise<any> {
  try {
    const response = await fetch("/api/auth/role", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ role }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to set role");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Set role error:", error);
    throw error;
  }
}

export async function isGoogleOAuthConfigured(): Promise<boolean> {
  try {
    // Make a simple GET request to check if the endpoint exists
    const response = await fetch("/auth/google", { 
      method: "GET",
      redirect: "manual" // Don't follow redirects
    });
    
    // If we get a redirect (302/301) or success (200), Google OAuth is configured
    // If we get 500, it means the configuration is missing
    return response.status !== 500;
  } catch (error) {
    // If there's a network error, assume it's configured
    console.log("Google OAuth configuration check failed, assuming configured:", error);
    return true;
  }
}