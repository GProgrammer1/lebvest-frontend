import axios from 'axios';
import { Goal } from '@/lib/types';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';
const GOALS_ENDPOINT = '/investors/me/goals';

const goalsHttpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

goalsHttpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');

  if (token) {
    if (config.headers && typeof config.headers.set === 'function') {
      // Axios v1: headers is AxiosHeaders instance
      config.headers.set('Authorization', `Bearer ${token}`);
    } else if (config.headers) {
      // Fallback for plain object headers
      (config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
  }

  // Log request payload for debugging
  if (config.data && config.method === 'post') {
    console.log('Sending goal payload:', JSON.stringify(config.data, null, 2));
  }

  return config;
});

goalsHttpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log detailed error information
    if (error.response) {
      console.error('API Error Response Status:', error.response.status);
      console.error('API Error Response Data:', JSON.stringify(error.response.data, null, 2));
      console.error('Full Error Response:', error.response);
    }

    // Handle 403 Forbidden - token might be missing or invalid
    if (error.response?.status === 403) {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('No auth token found. Please sign in.');
      } else {
        console.error('Request forbidden. Token may be invalid or expired.');
      }
    }
    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/sign-in';
    }
    return Promise.reject(error);
  }
);

export interface CreateGoalPayload {
  title: string;
  targetAmount: number;
  deadline: string;
  description?: string;
  currentAmount?: number;
}

export interface UpdateGoalPayload extends Partial<CreateGoalPayload> {}

// Transform frontend payload to backend format
// Backend expects 'name' instead of 'title'
const transformPayloadForBackend = (payload: CreateGoalPayload | UpdateGoalPayload): any => {
  const backendPayload: any = { ...payload };
  
  // Map 'title' to 'name' for backend
  if ('title' in backendPayload && backendPayload.title !== undefined) {
    backendPayload.name = backendPayload.title;
    delete backendPayload.title;
  }
  
  return backendPayload;
};

// Transform backend response to frontend format
// Backend returns 'name', frontend expects 'title'
const transformResponseFromBackend = (backendGoal: any): Goal => {
  const frontendGoal: any = { ...backendGoal };
  
  // Map 'name' to 'title' for frontend
  if ('name' in frontendGoal && frontendGoal.name !== undefined) {
    frontendGoal.title = frontendGoal.name;
    delete frontendGoal.name;
  }
  
  return frontendGoal as Goal;
};

export const goalsApi = {
  async createGoal(payload: CreateGoalPayload): Promise<Goal> {
    // Transform payload: frontend uses 'title', backend expects 'name'
    const backendPayload = transformPayloadForBackend(payload);
    const response = await goalsHttpClient.post<any>(GOALS_ENDPOINT, backendPayload);
    // Transform response: backend returns 'name', frontend expects 'title'
    // Backend returns wrapped response: { status, message, data: { goal: { ... } } }
    return transformResponseFromBackend(response.data.data.goal);
  },

  async updateGoal(goalId: string, payload: UpdateGoalPayload): Promise<Goal> {
    // Transform payload: frontend uses 'title', backend expects 'name'
    const backendPayload = transformPayloadForBackend(payload);
    const response = await goalsHttpClient.patch<any>(`${GOALS_ENDPOINT}/${goalId}`, backendPayload);
    // Transform response: backend returns 'name', frontend expects 'title'
    // Backend returns wrapped response: { status, message, data: { goal: { ... } } }
    return transformResponseFromBackend(response.data.data.goal);
  },

  async deleteGoal(goalId: string): Promise<void> {
    await goalsHttpClient.delete(`${GOALS_ENDPOINT}/${goalId}`);
  },
};

export type GoalsApi = typeof goalsApi;
