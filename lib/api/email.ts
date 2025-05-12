// API handler for testing email functionality

import { apiClient } from '../api-client';

export async function testEmail(email: string): Promise<any> {
  try {
    return await apiClient.request<any>(`/test-email?email=${encodeURIComponent(email)}`);
  } catch (error) {
    console.error('Email test error:', error);
    throw error;
  }
}
