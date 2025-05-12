// API handler for logs endpoints

import { apiClient, LogEntryExtended } from '../api-client';

export async function getAllLogs(limit = 100): Promise<LogEntryExtended[]> {
  try {
    return await apiClient.getAllLogs(limit);
  } catch (error) {
    console.error('Get all logs error:', error);
    throw error;
  }
}

export async function getLogById(logId: string): Promise<LogEntryExtended> {
  try {
    return await apiClient.getLogById(logId);
  } catch (error) {
    console.error(`Get log error for ID ${logId}:`, error);
    throw error;
  }
}
