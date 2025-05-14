// API handler for logs endpoints

import { apiClient, LogEntryExtended } from '../api-client';

export async function getAllLogs(limit = 100, filters?: {
  botId?: string;
  level?: string;
  fromDate?: Date;
  toDate?: Date;
  searchQuery?: string;
}): Promise<LogEntryExtended[]> {
  try {
    let logs = await apiClient.getAllLogs(limit);
    
    // Apply filters if provided
    if (filters) {
      // Filter by bot ID
      if (filters.botId && filters.botId !== 'all' && filters.botId !== 'general') {
        logs = logs.filter(log => log.botId === filters.botId);
      }
      
      // Special case for 'general' logs (system logs without bot ID)
      if (filters.botId === 'general') {
        logs = logs.filter(log => !log.botId);
      }
      
      // Filter by log level
      if (filters.level && filters.level !== 'all') {
        logs = logs.filter(log => log.level === filters.level);
      }
      
      // Filter by date range
      if (filters.fromDate && filters.toDate) {
        logs = logs.filter(log => {
          const logDate = new Date(log.timestamp);
          return logDate >= filters.fromDate! && logDate <= filters.toDate!;
        });
      }
      
      // Filter by search query
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        logs = logs.filter(log => 
          log.message.toLowerCase().includes(query) ||
          (log.botName && log.botName.toLowerCase().includes(query)) ||
          (log.source && log.source.toLowerCase().includes(query)) ||
          (log.context && JSON.stringify(log.context).toLowerCase().includes(query))
        );
      }
    }
    
    return logs;
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

export async function exportLogs(format: 'json' | 'csv' = 'json'): Promise<Blob> {
  try {
    // For CSV format, we would return a CSV blob
    // For now, we're only implementing JSON export which is handled in the UI
    if (format === 'csv') {
      const logs = await getAllLogs(1000); // Get a larger set for export
      const csv = convertLogsToCSV(logs);
      return new Blob([csv], { type: 'text/csv' });
    }
    
    throw new Error('Export format not implemented');
  } catch (error) {
    console.error(`Export logs error:`, error);
    throw error;
  }
}

// Helper function to convert logs to CSV format
function convertLogsToCSV(logs: LogEntryExtended[]): string {
  const headers = ['Timestamp', 'Level', 'Message', 'Bot ID', 'Bot Name', 'Source'];
  let csv = headers.join(',') + '\n';
  
  logs.forEach(log => {
    const row = [
      `"${log.timestamp}"`,
      `"${log.level}"`,
      `"${log.message.replace(/"/g, '""')}"`, // Escape quotes
      `"${log.botId || ''}"`,
      `"${log.botName || ''}"`,
      `"${log.source || ''}"`,
    ];
    csv += row.join(',') + '\n';
  });
  
  return csv;
}
