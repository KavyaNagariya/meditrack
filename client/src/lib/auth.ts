// Auth service for handling authentication API calls

const API_BASE_URL = "/api/auth";

interface LoginCredentials {
  username: string;
  password: string;
}

interface SignupCredentials {
  username: string;
  password: string;
}

interface AuthResponse {
  message: string;
  user?: {
    id: string;
    username: string;
  };
}

interface UserRole {
  role: string | null;
}

interface UserDetails {
  name?: string;
  contactNo?: string;
  age?: number;
  gender?: string;
  dateOfBirth?: string;
  occupation?: string;
  relationWithPatient?: string;
  patientName?: string;
  experience?: number;
  qualifications?: string;
  employeeId?: string;
}

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Login failed");
  }

  return response.json();
}

export async function signup(credentials: SignupCredentials): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Signup failed");
  }

  return response.json();
}

export async function logout(): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/logout`, {
    method: "POST",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Logout failed");
  }
}

export async function getCurrentUser(): Promise<{ userId: string } | null> {
  const response = await fetch(`${API_BASE_URL}/user`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}

// Check if Google OAuth is configured on the backend
export async function isGoogleOAuthConfigured(): Promise<boolean> {
  try {
    // Try to access the Google OAuth endpoint
    const response = await fetch("/auth/google", { method: "HEAD", redirect: "manual" });
    // If we get a redirect (302) or a specific error, Google OAuth is configured
    // If we get a 500 or 404, it's not configured
    return !(response.status === 500 || response.status === 404);
  } catch (error) {
    // If there's a network error, we assume it's configured
    return true;
  }
}

// Get user role
export async function getUserRole(): Promise<UserRole> {
  const response = await fetch(`${API_BASE_URL}/role`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user role");
  }

  return response.json();
}

// Set user role
export async function setUserRole(role: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/role`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ role }),
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to set user role");
  }
}

// Get user details
export async function getUserDetails(): Promise<UserDetails> {
  const response = await fetch(`${API_BASE_URL}/details`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user details");
  }

  return response.json();
}

// Set user details
export async function setUserDetails(details: UserDetails): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/details`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(details),
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to save user details");
  }
}