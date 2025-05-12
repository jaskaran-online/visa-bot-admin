// API handler for bot management endpoints

import { apiClient, BotConfig, BotList, BotResponse, GenericResponse, LogEntry } from '../api-client';

export async function getAllBots(): Promise<BotList> {
  try {
    return await apiClient.getAllBots();
  } catch (error) {
    console.error('Get all bots error:', error);
    throw error;
  }
}

export async function getBot(botId: string): Promise<BotResponse> {
  try {
    return await apiClient.getBot(botId);
  } catch (error) {
    console.error(`Get bot error for ID ${botId}:`, error);
    throw error;
  }
}

export async function createBot(config: BotConfig): Promise<BotResponse> {
  try {
    return await apiClient.createBot(config);
  } catch (error) {
    console.error('Create bot error:', error);
    throw error;
  }
}

export async function deleteBot(botId: string): Promise<GenericResponse> {
  try {
    return await apiClient.deleteBot(botId);
  } catch (error) {
    console.error(`Delete bot error for ID ${botId}:`, error);
    throw error;
  }
}

export async function startBot(botId: string): Promise<GenericResponse> {
  try {
    return await apiClient.startBot(botId);
  } catch (error) {
    console.error(`Start bot error for ID ${botId}:`, error);
    throw error;
  }
}

export async function stopBot(botId: string): Promise<GenericResponse> {
  try {
    return await apiClient.stopBot(botId);
  } catch (error) {
    console.error(`Stop bot error for ID ${botId}:`, error);
    throw error;
  }
}

export async function restartBot(botId: string): Promise<GenericResponse> {
  try {
    return await apiClient.restartBot(botId);
  } catch (error) {
    console.error(`Restart bot error for ID ${botId}:`, error);
    throw error;
  }
}

export async function getBotLogs(botId: string, limit = 15): Promise<LogEntry[]> {
  try {
    return await apiClient.getBotLogs(botId, limit);
  } catch (error) {
    console.error(`Get bot logs error for ID ${botId}:`, error);
    throw error;
  }
}

export async function clearBotLogs(botId: string): Promise<GenericResponse> {
  try {
    return await apiClient.clearBotLogs(botId);
  } catch (error) {
    console.error(`Clear bot logs error for ID ${botId}:`, error);
    throw error;
  }
}
