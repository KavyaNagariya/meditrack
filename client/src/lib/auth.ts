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