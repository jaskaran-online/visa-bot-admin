// API handler for dashboard data

import { apiClient, StatisticsSummary } from "../api-client";
import { getDetailedHealth } from "./health";
import { getAllBots } from "./bots";
import { getAllAppointments, getAppointmentStats } from "./appointments";

// Function to get dashboard summary data
export async function getDashboardSummary(): Promise<StatisticsSummary> {
  try {
    return await apiClient.getStatisticsSummary();
  } catch (error) {
    console.error("Failed to get dashboard summary:", error);
    throw error;
  }
}

// Function to get recent appointments
export async function getRecentAppointments(limit = 3) {
  try {
    const data = await getAllAppointments(1, limit, {
      sort_by: "booked_at",
      sort_order: "desc"
    });
    return data.appointments;
  } catch (error) {
    console.error("Failed to get recent appointments:", error);
    throw error;
  }
}

// Function to get system health data
export async function getSystemHealth() {
  try {
    return await getDetailedHealth();
  } catch (error) {
    console.error("Failed to get system health:", error);
    throw error;
  }
}

// Function to get bot status counts
export async function getBotStatusCounts() {
  try {
    const response = await getAllBots();
    const bots = response.bots;
    
    // Count bots by status
    const counts = {
      total: bots.length,
      running: 0,
      stopped: 0,
      error: 0,
      completed: 0
    };
    
    bots.forEach(bot => {
      counts[bot.status]++;
    });
    
    return counts;
  } catch (error) {
    console.error("Failed to get bot status counts:", error);
    throw error;
  }
}

// Function to get appointment statistics
export async function getAppointmentStatistics() {
  try {
    return await getAppointmentStats();
  } catch (error) {
    console.error("Failed to get appointment statistics:", error);
    throw error;
  }
}
