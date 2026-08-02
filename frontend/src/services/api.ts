import axios from 'axios';
import type { LoggedEvent } from '../store/useStore';

// The FastAPI backend runs on localhost:8000 by default (set via config.py)
const API_BASE_URL = 'http://127.0.0.1:8000';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  /**
   * Log behavioral events history to the backend database.
   */
  logEvents: async (events: LoggedEvent[]): Promise<any> => {
    try {
      const response = await client.post('/log-events', { events });
      return response.data;
    } catch (error) {
      console.warn("Failed to log events to backend database:", error);
      throw error;
    }
  },

  /**
   * Post session behavioral context to calculate real-time predictions.
   *
   * Input payload structure:
   * {
   *   "session_data": { ... },
   *   "product_metadata": { ... },
   *   "user_metadata": { ... }
   * }
   */
  predictAbandonment: async (payload: {
    session_data: Record<string, any>;
    product_metadata?: Record<string, any> | null;
    user_metadata?: Record<string, any> | null;
  }): Promise<any> => {
    try {
      const response = await client.post('/predict', payload);
      return response.data;
    } catch (error) {
      console.warn("Failed to retrieve real-time prediction from API backend:", error);
      throw error;
    }
  }
};
