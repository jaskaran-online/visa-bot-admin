// API handler for health-related endpoints

import { apiClient } from '../api-client';

export async function getBasicHealth(): Promise<any> {
  try {
    return await apiClient.request<any>('/health');
  } catch (error) {
    console.error('Health check error:', error);
    throw error;
  }
}

export async function getDetailedHealth(): Promise<any> {
  try {
    return await apiClient.request<any>('/health/detailed');
  } catch (error) {
    console.error('Detailed health check error:', error);
    throw error;
  }
}

export async function getApiRoot(): Promise<any> {
  try {
    return await apiClient.request<any>('/');
  } catch (error) {
    console.error('API root error:', error);
    throw error;
  }
}
