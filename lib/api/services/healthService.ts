// lib/api/services/healthService.ts
import axios from 'axios';
import { BasicHealthResponse, HealthResponse } from '../types/health';

// TODO: Replace with your actual API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_AUTOMATION_API_URL || 'http://localhost:8000'; // Example fallback

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Fetches basic health status of the API service.
 * Corresponds to GET /health
 */
export const getBasicHealth = async (): Promise<BasicHealthResponse> => {
  const response = await apiClient.get<BasicHealthResponse>('/health');
  return response.data;
};

/**
 * Fetches detailed health information including system statistics and bot statuses.
 * Corresponds to GET /health/detailed
 * @param apiKey Optional API key for authentication.
 */
export const getDetailedHealth = async (apiKey?: string): Promise<HealthResponse> => {
  const headers: Record<string, string> = {};
  if (apiKey) {
    headers['x-api-key'] = apiKey;
  }
  const response = await apiClient.get<HealthResponse>('/health/detailed', { headers });
  return response.data;
};

/**
 * Fetches the API status and version from the root endpoint.
 * Corresponds to GET /
 */
export const getApiRootStatus = async (): Promise<BasicHealthResponse> => {
  const response = await apiClient.get<BasicHealthResponse>('/');
  return response.data;
};

// Example of how to use an API key from environment variables if needed for all requests
// if (process.env.NEXT_PUBLIC_AUTOMATION_API_KEY) {
//   apiClient.defaults.headers.common['x-api-key'] = process.env.NEXT_PUBLIC_AUTOMATION_API_KEY;
// }

export default apiClient;
