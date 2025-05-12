// API handler for appointment management endpoints

import { apiClient, AppointmentList, GenericResponse, SuccessfulAppointment } from '../api-client';

export async function getAllAppointments(
  page = 1, 
  pageSize = 10, 
  filters?: {
    email?: string;
    country?: string;
    facility_id?: string;
    from_date?: string;
    to_date?: string;
    sort_by?: string;
    sort_order?: string;
  }
): Promise<AppointmentList> {
  try {
    return await apiClient.getAllAppointments(page, pageSize, filters);
  } catch (error) {
    console.error('Get all appointments error:', error);
    throw error;
  }
}

export async function getAppointment(appointmentId: string): Promise<SuccessfulAppointment> {
  try {
    return await apiClient.getAppointment(appointmentId);
  } catch (error) {
    console.error(`Get appointment error for ID ${appointmentId}:`, error);
    throw error;
  }
}

export async function createAppointment(appointmentData: Partial<SuccessfulAppointment>): Promise<SuccessfulAppointment> {
  try {
    return await apiClient.createAppointment(appointmentData);
  } catch (error) {
    console.error('Create appointment error:', error);
    throw error;
  }
}

export async function updateAppointment(
  appointmentId: string, 
  appointmentData: Partial<SuccessfulAppointment>
): Promise<SuccessfulAppointment> {
  try {
    return await apiClient.updateAppointment(appointmentId, appointmentData);
  } catch (error) {
    console.error(`Update appointment error for ID ${appointmentId}:`, error);
    throw error;
  }
}

export async function deleteAppointment(appointmentId: string): Promise<GenericResponse> {
  try {
    return await apiClient.deleteAppointment(appointmentId);
  } catch (error) {
    console.error(`Delete appointment error for ID ${appointmentId}:`, error);
    throw error;
  }
}

export async function getAppointmentStats(): Promise<any> {
  try {
    return await apiClient.getAppointmentStats();
  } catch (error) {
    console.error('Get appointment stats error:', error);
    throw error;
  }
}
