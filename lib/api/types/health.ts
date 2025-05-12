// lib/api/types/health.ts

export interface BasicHealthResponse {
  name: string;
  version: string;
  description: string;
  status: string;
}

export interface SystemStatus {
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
  uptime: number;
}

export interface BotStatus {
  id: string;
  status: string;
  last_active: string; // ISO date-time string
  error_count: number;
}

export interface HealthResponse extends BasicHealthResponse {
  system_status: SystemStatus;
  bots_status: BotStatus[];
}
