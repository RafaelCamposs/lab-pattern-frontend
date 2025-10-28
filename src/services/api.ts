const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export interface SignUpRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthenticationResponse {
  token: string;
}

export type Pattern = {
  id: string;
  name: string;
};

export type Challenge = {
  id: string;
  description: string;
  title: string;
  isDaily: boolean;
  publishedAt: string;
  expectedPatternId: string;
};

export const authApi = {
  signup: async (data: SignUpRequest): Promise<AuthenticationResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Signup failed');
    }

    return response.json();
  },

  login: async (data: LoginRequest): Promise<AuthenticationResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Login failed');
    }

    return response.json();
  },
};

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// Helper function to decode JWT token and extract userId
export const getUserIdFromToken = (): string | null => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    // JWT tokens have 3 parts separated by dots: header.payload.signature
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    const payload = JSON.parse(jsonPayload);
    // Prioritize userId claim over sub
    return payload.userId || payload.sub || null;
  } catch (error) {
    console.error('Failed to decode JWT token:', error);
    return null;
  }
};

// Helper function to check if token is expired
export const isTokenExpired = (): boolean => {
  const token = localStorage.getItem('token');
  if (!token) return true;

  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    const payload = JSON.parse(jsonPayload);
    if (!payload.exp) return true;

    // exp is in seconds, Date.now() is in milliseconds
    const expirationTime = payload.exp * 1000;
    const currentTime = Date.now();

    return currentTime >= expirationTime;
  } catch (error) {
    console.error('Failed to check token expiration:', error);
    return true;
  }
};

// Event listener for token expiration
let tokenExpirationCallback: (() => void) | null = null;

export const setTokenExpirationCallback = (callback: () => void) => {
  tokenExpirationCallback = callback;
};

export const handleTokenExpiration = () => {
  if (tokenExpirationCallback) {
    tokenExpirationCallback();
  }
};

export const patternApi = {
  getAllPatterns: async (): Promise<Pattern[]> => {
    const response = await fetch(`${API_BASE_URL}/v1/patterns`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to fetch patterns');
    }

    return response.json();
  },
};

export const challengeApi = {
  generateChallenge: async (): Promise<Challenge> => {
    const response = await fetch(`${API_BASE_URL}/v1/challenges`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      // Handle 403 Forbidden - likely token expiration
      if (response.status === 403) {
        console.error('403 Forbidden: Token may be expired');
        handleTokenExpiration();
        throw new Error('Your session has expired. Please log in again.');
      }
      const error = await response.text();
      throw new Error(error || 'Failed to generate challenge');
    }

    return response.json();
  },

  getDailyChallenge: async (): Promise<Challenge> => {
    const response = await fetch(`${API_BASE_URL}/v1/challenges/daily`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      // Handle 403 Forbidden - likely token expiration
      if (response.status === 403) {
        console.error('403 Forbidden: Token may be expired');
        handleTokenExpiration();
        throw new Error('Your session has expired. Please log in again.');
      }
      const error = await response.text();
      throw new Error(error || 'Failed to fetch daily challenge');
    }

    return response.json();
  },
};

export interface SubmitSolutionRequest {
  userId: string;
  challengeId: string;
  patternId: string;
  code: string;
  language: string;
}

export interface Feedback {
  keyPoints: string[];
  strengths: string[];
  improvements: string[];
}

export interface SubmissionResponse {
  id: string;
  userId: string;
  challengeId: string;
  patternId: string;
  code: string;
  language: string;
  submittedAt: string;
  evaluation: {
    score: number;
    feedback: Feedback;
  } | null;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export const submissionApi = {
  submitSolution: async (data: SubmitSolutionRequest): Promise<SubmissionResponse> => {
    const response = await fetch(`${API_BASE_URL}/v1/submissions`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      // Handle 403 Forbidden - likely token expiration
      if (response.status === 403) {
        console.error('403 Forbidden: Token may be expired');
        handleTokenExpiration();
        throw new Error('Your session has expired. Please log in again.');
      }
      const error = await response.text();
      throw new Error(error || 'Failed to submit solution');
    }

    return response.json();
  },

  getUserSubmissionsForChallenge: async (userId: string, challengeId: string): Promise<SubmissionResponse[]> => {
    const response = await fetch(`${API_BASE_URL}/v1/users/${userId}/challenges/${challengeId}/submissions`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      // Handle 403 Forbidden - likely token expiration
      if (response.status === 403) {
        console.error('403 Forbidden: Token may be expired');
        handleTokenExpiration();
        throw new Error('Your session has expired. Please log in again.');
      }
      const error = await response.text();
      throw new Error(error || 'Failed to fetch submissions');
    }

    return response.json();
  },
};

export interface UserStatistics {
  completedChallenges: number;
  percentage: number;
  currentStreak: number;
  longestStreak: number;
}

export const userApi = {
  getUserChallenges: async (userId: string, page: number = 0, pageSize: number = 15): Promise<PageResponse<Challenge>> => {
    const response = await fetch(`${API_BASE_URL}/v1/users/${userId}/challenges?page=${page}&pageSize=${pageSize}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      // Handle 403 Forbidden - likely token expiration
      if (response.status === 403) {
        console.error('403 Forbidden: Token may be expired');
        handleTokenExpiration();
        throw new Error('Your session has expired. Please log in again.');
      }
      const error = await response.text();
      throw new Error(error || 'Failed to fetch user challenges');
    }

    return response.json();
  },

  getUserStatistics: async (userId: string): Promise<UserStatistics> => {
    const response = await fetch(`${API_BASE_URL}/v1/users/${userId}/statistics`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      // Handle 403 Forbidden - likely token expiration
      if (response.status === 403) {
        console.error('403 Forbidden: Token may be expired');
        handleTokenExpiration();
        throw new Error('Your session has expired. Please log in again.');
      }
      const error = await response.text();
      throw new Error(error || 'Failed to fetch user statistics');
    }

    return response.json();
  },
};
