// Enhanced API client for the USA VISA Appointment Bot System
// This client handles all API calls to the backend service

type ServerConfig = {
  id: string
  name: string
  baseUrl: string
  isActive: boolean
}

// Types based on the OpenAPI specification
export type BotStatus = "running" | "stopped" | "error" | "completed"

export type LogEntry = {
  message: string
  type: "info" | "warning" | "error"
  timestamp: string
}

export type BotConfig = {
  EMAIL: string
  PASSWORD: string
  COUNTRY: string
  FACILITY_ID?: string | null
  ASC_FACILITY_ID?: string | null
  SCHEDULE_ID?: string | null
  MIN_DATE?: string | null
  MAX_DATE?: string | null
}

export type BotResponse = {
  id: string
  config: BotConfig
  status: BotStatus
  start_time: string
  logs: LogEntry[]
}

export type BotList = {
  bots: BotResponse[]
}

export type GenericResponse = {
  success: boolean
  message: string
}

export type ErrorResponse = {
  success: boolean
  error: string
}

// Add these types to the existing types in the file
export type AppointmentStatus = "pending" | "confirmed" | "cancelled"

// Update the SuccessfulAppointment type to include status
export type SuccessfulAppointment = {
  id: string
  bot_id: string
  email: string
  country: string
  facility_id: string
  facility_name: string
  appointment_date: string
  appointment_time: string
  asc_appointment_date?: string | null
  asc_appointment_time?: string | null
  booked_at: string
  visa_type?: string | null
  schedule_id?: string | null
  notes?: string | null
  status: AppointmentStatus
}

export type AppointmentList = {
  appointments: SuccessfulAppointment[]
  total_count: number
  page: number
  page_size: number
}

// Add statistics types
export type AppointmentStatisticsParams = {
  country?: string
  startDate?: string
  endDate?: string
}

export type AppointmentStatistics = {
  summary: {
    totalAppointments: number
    confirmedAppointments: number
    successRate: number
    averageWaitDays: number
    uniqueUsers: number
    trend: {
      appointmentChange: number
      successRateChange: number
      waitTimeChange: number
    }
  }
  trends: Array<{
    date: string
    value: number
  }>
  waitTimeTrend: Array<{
    date: string
    value: number
  }>
  statusDistribution: Array<{
    status: string
    value: number
    color: string
  }>
  countryDistribution: Array<{
    country: string
    countryName: string
    value: number
  }>
  facilityDistribution: Array<{
    facility: string
    facilityName: string
    value: number
  }>
  timeDistribution: Array<{
    hour: number
    hourLabel: string
    value: number
  }>
  botPerformance: Array<{
    botId: string
    botName: string
    appointments: number
  }>
  botSuccessRate: Array<{
    botId: string
    botName: string
    successRate: number
  }>
  botResponseTime: Array<{
    botId: string
    botName: string
    responseTime: number
  }>
}

// Add this type definition after the other type definitions
export type StatisticsSummary = {
  appointments: {
    total: number
    trend: number
    trendDirection: "up" | "down" | null
  }
  bots: {
    active: number
    total: number
    trend: number
    trendDirection: "up" | "down" | null
  }
  users: {
    total: number
    active: number
    trend: number
    trendDirection: "up" | "down" | null
  }
  waitTime: {
    average: number
    trend: number
    trendDirection: "up" | "down" | null
  }
}

// Update the API client with log-related methods

// Add these types to the existing types in the file
export type LogLevel = "info" | "warning" | "error"

export type LogEntryExtended = {
  id: string
  timestamp: string
  level: LogLevel
  message: string
  botId?: string
  botName?: string
  source?: string
  context?: any
  stackTrace?: string
}

class ApiClient {
  private baseUrl = ""
  private servers: ServerConfig[] = []
  private activeServerId: string | null = null
  private countriesData: Record<string, string> = {}
  private facilitiesData: {
    facilities: Record<string, string>
    asc_facilities: Record<string, string>
  } = { facilities: {}, asc_facilities: {} }

  constructor() {
    // Initialize with default server if available
    if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_AUTOMATION_API_URL) {
      // Add the environment API URL as a server
      const envServer: ServerConfig = {
        id: "default-env",
        name: "API Server",
        baseUrl: process.env.NEXT_PUBLIC_AUTOMATION_API_URL,
        isActive: true,
      }
      
      this.servers = [envServer]
      this.activeServerId = envServer.id
      this.baseUrl = envServer.baseUrl
    }
    
    this.loadServers()
    this.loadCountriesData()
    this.loadFacilitiesData()
  }

  private loadServers(): void {
    if (typeof window === "undefined") {
      return
    }

    const serversJson = localStorage.getItem("servers")
    if (serversJson) {
      try {
        this.servers = JSON.parse(serversJson)
        const activeServer = this.servers.find((server) => server.isActive)
        if (activeServer) {
          this.activeServerId = activeServer.id
          this.baseUrl = activeServer.baseUrl
        }
      } catch (error) {
        console.error("Failed to parse servers from localStorage", error)
      }
    }

    // If no servers are configured, use a default one
    if (this.servers.length === 0) {
      const defaultServer: ServerConfig = {
        id: "default",
        name: "Default Server",
        baseUrl: "https://api.example.com",
        isActive: true,
      }
      this.servers = [defaultServer]
      this.activeServerId = defaultServer.id
      this.baseUrl = defaultServer.baseUrl
      this.saveServers()
    }
  }

  private async loadCountriesData(): Promise<void> {
    try {
      // In a real app, this would be loaded from an API or config
      this.countriesData = {
        ar: "Argentina",
        ec: "Ecuador",
        bs: "The Bahamas",
        gy: "Guyana",
        bb: "Barbados",
        jm: "Jamaica",
        bz: "Belize",
        mx: "Mexico",
        br: "Brazil",
        py: "Paraguay",
        bo: "Bolivia",
        pe: "Peru",
        ca: "Canada",
        sr: "Suriname",
        tt: "Trinidad and Tobago",
        co: "Colombia",
        uy: "Uruguay",
        cw: "Curacao",
        us: "United States (Domestic Visa Renewal)",
        al: "Albania",
        ie: "Ireland",
        am: "Armenia",
        kv: "Kosovo",
        az: "Azerbaijan",
        mk: "North Macedonia",
        be: "Belgium",
        nl: "The Netherlands",
        ba: "Bosnia and Herzegovina",
        pt: "Portugal",
        hr: "Croatia",
        rs: "Serbia",
        cy: "Cyprus",
        es: "Spain and Andorra",
        fr: "France",
        tr: "Turkiye",
        gr: "Greece",
        gb: "United Kingdom",
        it: "Italy",
        il: "Israel, Jerusalem, The West Bank, and Gaza",
        ae: "United Arab Emirates",
        ir: "Iran",
        ao: "Angola",
        rw: "Rwanda",
        cm: "Cameroon",
        sn: "Senegal",
        cv: "Cabo Verde",
        tz: "Tanzania",
        cd: "The Democratic Republic of the Congo",
        za: "South Africa",
        et: "Ethiopia",
        ug: "Uganda",
        ke: "Kenya",
        de: "Germany",
      }
    } catch (error) {
      console.error("Failed to load countries data", error)
    }
  }

  private async loadFacilitiesData(): Promise<void> {
    try {
      // In a real app, this would be loaded from an API or config
      this.facilitiesData = {
        facilities: {
          "89": "Calgary",
          "90": "Halifax",
          "9": "Montreal (Closed)",
          "92": "Ottawa",
          "93": "Quebec City",
          "94": "Toronto",
          "95": "Vancouver",
        },
        asc_facilities: {
          "89": "Calgary ASC",
          "90": "Halifax ASC",
          "92": "Ottawa ASC",
          "93": "Quebec City ASC",
          "94": "Toronto ASC",
          "95": "Vancouver ASC",
        },
      }
    } catch (error) {
      console.error("Failed to load facilities data", error)
    }
  }

  private saveServers(): void {
    if (typeof window === "undefined") {
      return
    }

    localStorage.setItem("servers", JSON.stringify(this.servers))
  }

  public getServers(): ServerConfig[] {
    return [...this.servers]
  }

  public getActiveServer(): ServerConfig | null {
    return this.servers.find((server) => server.id === this.activeServerId) || null
  }

  public addServer(server: Omit<ServerConfig, "id">): ServerConfig {
    const newServer: ServerConfig = {
      ...server,
      id: Date.now().toString(),
    }

    this.servers.push(newServer)

    // If this is the first server, make it active
    if (this.servers.length === 1) {
      newServer.isActive = true
      this.activeServerId = newServer.id
      this.baseUrl = newServer.baseUrl
    }

    this.saveServers()
    return newServer
  }

  public updateServer(id: string, updates: Partial<Omit<ServerConfig, "id">>): ServerConfig | null {
    const serverIndex = this.servers.findIndex((server) => server.id === id)
    if (serverIndex === -1) {
      return null
    }

    const updatedServer = {
      ...this.servers[serverIndex],
      ...updates,
    }

    this.servers[serverIndex] = updatedServer

    // If this is the active server and the baseUrl changed, update it
    if (id === this.activeServerId && updates.baseUrl) {
      this.baseUrl = updates.baseUrl
    }

    // If isActive is being set to true, update the active server
    if (updates.isActive) {
      this.servers.forEach((server) => {
        if (server.id !== id) {
          server.isActive = false
        }
      })
      this.activeServerId = id
      this.baseUrl = updatedServer.baseUrl
    }

    this.saveServers()
    return updatedServer
  }

  public removeServer(id: string): boolean {
    const serverIndex = this.servers.findIndex((server) => server.id === id)
    if (serverIndex === -1) {
      return false
    }

    const wasActive = this.servers[serverIndex].isActive
    this.servers.splice(serverIndex, 1)

    // If we removed the active server, make another one active
    if (wasActive && this.servers.length > 0) {
      this.servers[0].isActive = true
      this.activeServerId = this.servers[0].id
      this.baseUrl = this.servers[0].baseUrl
    } else if (this.servers.length === 0) {
      this.activeServerId = null
      this.baseUrl = ""
    }

    this.saveServers()
    return true
  }

  public setActiveServer(id: string): boolean {
    const server = this.servers.find((server) => server.id === id)
    if (!server) {
      return false
    }

    this.servers.forEach((s) => {
      s.isActive = s.id === id
    })

    this.activeServerId = id
    this.baseUrl = server.baseUrl
    this.saveServers()
    return true
  }

  // Generic request method
  private async request<T>(endpoint: string, method = "GET", data?: any, responseType = "json"): Promise<T> {
    if (!this.baseUrl) {
      throw new Error("No active server configured")
    }

    // Use API key from environment if available
    const apiKey = process.env.NEXT_PUBLIC_API_KEY || localStorage.getItem("api_key")
    const headers: HeadersInit = {
      "Content-Type": "application/json"
    }

    if (apiKey) {
      headers["x-api-key"] = apiKey
    }

    const config: RequestInit = {
      method,
      headers,
      cache: "no-store", // Ensure we always get fresh data
    }

    if (data) {
      config.body = JSON.stringify(data)
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, config)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || errorData.message || `API request failed with status ${response.status}`)
      }

      if (responseType === "blob") {
        return response.blob() as Promise<T>
      } else if (responseType === "text") {
        return response.text() as Promise<T>
      } else {
        return response.json() as Promise<T>
      }
    } catch (error) {
      console.error(`API request error: ${endpoint}`, error)
      throw error
    }
  }

  // Bot Management API Methods
  public async getAllBots(): Promise<BotList> {
    return this.request<BotList>("/bots")
  }

  public async getBot(botId: string): Promise<BotResponse> {
    return this.request<BotResponse>(`/bots/${botId}`)
  }

  public async createBot(config: BotConfig): Promise<BotResponse> {
    return this.request<BotResponse>("/bots", "POST", { config })
  }

  public async deleteBot(botId: string): Promise<GenericResponse> {
    return this.request<GenericResponse>(`/bots/${botId}`, "DELETE")
  }

  public async startBot(botId: string): Promise<GenericResponse> {
    return this.request<GenericResponse>(`/bots/${botId}/start`, "POST")
  }

  public async stopBot(botId: string): Promise<GenericResponse> {
    return this.request<GenericResponse>(`/bots/${botId}/stop`, "POST")
  }

  public async restartBot(botId: string): Promise<GenericResponse> {
    return this.request<GenericResponse>(`/bots/${botId}/restart`, "POST")
  }

  public async getBotLogs(botId: string, limit = 100): Promise<LogEntry[]> {
    return this.request<LogEntry[]>(`/bots/${botId}/logs?limit=${limit}`)
  }

  public async clearBotLogs(botId: string): Promise<GenericResponse> {
    return this.request<GenericResponse>(`/bots/${botId}/logs/clear`, "POST")
  }

  // Appointment Management API Methods
  public async getAllAppointments(
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
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('page_size', pageSize.toString());
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params.append(key, value);
        }
      });
    }
    
    return this.request<AppointmentList>(`/appointments?${params}`);
  }

  public async getAppointment(appointmentId: string): Promise<SuccessfulAppointment> {
    return this.request<SuccessfulAppointment>(`/appointments/${appointmentId}`);
  }

  public async createAppointment(appointmentData: Partial<SuccessfulAppointment>): Promise<SuccessfulAppointment> {
    return this.request<SuccessfulAppointment>('/appointments', 'POST', appointmentData);
  }

  public async updateAppointment(appointmentId: string, appointmentData: Partial<SuccessfulAppointment>): Promise<SuccessfulAppointment> {
    return this.request<SuccessfulAppointment>(`/appointments/${appointmentId}`, 'PUT', appointmentData);
  }

  public async deleteAppointment(appointmentId: string): Promise<GenericResponse> {
    return this.request<GenericResponse>(`/appointments/${appointmentId}`, 'DELETE');
  }

  public async getAppointmentStats(): Promise<any> {
    return this.request<any>('/appointments/stats');
  }

  // Statistics API Methods
  public async getAppointmentStatistics(params: AppointmentStatisticsParams = {}): Promise<AppointmentStatistics> {
    // For demo purposes, return mock data
    return {
      summary: {
        totalAppointments: 124,
        confirmedAppointments: 87,
        successRate: 78,
        averageWaitDays: 42,
        uniqueUsers: 68,
        trend: {
          appointmentChange: 12,
          successRateChange: 5,
          waitTimeChange: -3,
        },
      },
      trends: [
        { date: "2023-04-01", value: 3 },
        { date: "2023-04-02", value: 5 },
        { date: "2023-04-03", value: 2 },
        { date: "2023-04-04", value: 7 },
        { date: "2023-04-05", value: 4 },
        { date: "2023-04-06", value: 6 },
        { date: "2023-04-07", value: 8 },
        { date: "2023-04-08", value: 9 },
        { date: "2023-04-09", value: 5 },
        { date: "2023-04-10", value: 4 },
        { date: "2023-04-11", value: 7 },
        { date: "2023-04-12", value: 10 },
        { date: "2023-04-13", value: 8 },
        { date: "2023-04-14", value: 12 },
      ],
      waitTimeTrend: [
        { date: "2023-04-01", value: 45 },
        { date: "2023-04-02", value: 48 },
        { date: "2023-04-03", value: 47 },
        { date: "2023-04-04", value: 44 },
        { date: "2023-04-05", value: 42 },
        { date: "2023-04-06", value: 40 },
        { date: "2023-04-07", value: 41 },
        { date: "2023-04-08", value: 39 },
        { date: "2023-04-09", value: 38 },
        { date: "2023-04-10", value: 40 },
        { date: "2023-04-11", value: 42 },
        { date: "2023-04-12", value: 41 },
        { date: "2023-04-13", value: 39 },
        { date: "2023-04-14", value: 38 },
      ],
      statusDistribution: [
        { status: "Pending", value: 37, color: "#FFBB28" },
        { status: "Confirmed", value: 87, color: "#00C49F" },
        { status: "Cancelled", value: 12, color: "#FF8042" },
      ],
      countryDistribution: [
        { country: "gb", countryName: "United Kingdom", value: 32 },
        { country: "fr", countryName: "France", value: 24 },
        { country: "de", countryName: "Germany", value: 18 },
        { country: "es", countryName: "Spain", value: 15 },
        { country: "it", countryName: "Italy", value: 12 },
        { country: "ca", countryName: "Canada", value: 10 },
        { country: "mx", countryName: "Mexico", value: 8 },
        { country: "other", countryName: "Other Countries", value: 5 },
      ],
      facilityDistribution: [
        { facility: "94", facilityName: "London Embassy", value: 28 },
        { facility: "92", facilityName: "Paris Embassy", value: 22 },
        { facility: "93", facilityName: "Berlin Consulate", value: 18 },
        { facility: "95", facilityName: "Madrid Embassy", value: 15 },
        { facility: "89", facilityName: "Rome Embassy", value: 12 },
        { facility: "90", facilityName: "Toronto Consulate", value: 10 },
        { facility: "other", facilityName: "Other Facilities", value: 19 },
      ],
      timeDistribution: [
        { hour: 8, hourLabel: "8:00 AM", value: 12 },
        { hour: 9, hourLabel: "9:00 AM", value: 24 },
        { hour: 10, hourLabel: "10:00 AM", value: 32 },
        { hour: 11, hourLabel: "11:00 AM", value: 28 },
        { hour: 12, hourLabel: "12:00 PM", value: 15 },
        { hour: 13, hourLabel: "1:00 PM", value: 18 },
        { hour: 14, hourLabel: "2:00 PM", value: 22 },
        { hour: 15, hourLabel: "3:00 PM", value: 16 },
        { hour: 16, hourLabel: "4:00 PM", value: 8 },
      ],
      botPerformance: [
        { botId: "bot1", botName: "London Bot", appointments: 42 },
        { botId: "bot2", botName: "Paris Bot", appointments: 35 },
        { botId: "bot3", botName: "Berlin Bot", appointments: 28 },
        { botId: "bot4", botName: "Madrid Bot", appointments: 19 },
      ],
      botSuccessRate: [
        { botId: "bot1", botName: "London Bot", successRate: 82 },
        { botId: "bot2", botName: "Paris Bot", successRate: 78 },
        { botId: "bot3", botName: "Berlin Bot", successRate: 75 },
        { botId: "bot4", botName: "Madrid Bot", successRate: 68 },
      ],
      botResponseTime: [
        { botId: "bot1", botName: "London Bot", responseTime: 12 },
        { botId: "bot2", botName: "Paris Bot", responseTime: 15 },
        { botId: "bot3", botName: "Berlin Bot", responseTime: 18 },
        { botId: "bot4", botName: "Madrid Bot", responseTime: 22 },
      ],
    }
    // In a real app, you would use:
    // return this.request<AppointmentStatistics>(`/statistics/appointments`, "GET", params);
  }

  // Helper methods for UI
  public getCountries(): { code: string; name: string }[] {
    return Object.entries(this.countriesData)
      .map(([code, name]) => ({
        code,
        name,
      }))
      .sort((a, b) => a.name.localeCompare(b.name))
  }

  public getCountryName(code: string): string {
    return this.countriesData[code] || code
  }

  public getFacilities(): { id: string; name: string }[] {
    return Object.entries(this.facilitiesData.facilities)
      .map(([id, name]) => ({
        id,
        name,
      }))
      .sort((a, b) => a.name.localeCompare(b.name))
  }

  public getFacilityName(id: string): string {
    return this.facilitiesData.facilities[id] || id
  }

  public getASCFacilities(): { id: string; name: string }[] {
    return Object.entries(this.facilitiesData.asc_facilities)
      .map(([id, name]) => ({
        id,
        name,
      }))
      .sort((a, b) => a.name.localeCompare(b.name))
  }

  public getASCFacilityName(id: string): string {
    return this.facilitiesData.asc_facilities[id] || id
  }

  // Add these methods to the ApiClient class
  public async getAllLogs(limit = 100): Promise<LogEntryExtended[]> {
    try {
      return await this.request<LogEntryExtended[]>(`/logs/stream/general?limit=${limit}`);
    } catch (error) {
      console.error("Failed to fetch general logs:", error);
      return [];
    }
  }

  public async getLogById(logId: string): Promise<LogEntryExtended> {
    // Note: Since there's no specific endpoint for individual logs in the API spec,
    // we're fetching all logs and filtering client-side
    try {
      const allLogs = await this.getAllLogs(500); // Fetch more logs to increase chances of finding the one we want
      const log = allLogs.find((log) => log.id === logId);

      if (!log) {
        throw new Error("Log not found");
      }

      return log;
    } catch (error) {
      console.error(`Failed to fetch log with ID ${logId}:`, error);
      throw error;
    }
  }

  public async clearAllLogs(): Promise<GenericResponse> {
    // Note: This endpoint doesn't exist in the API specification
    // In a real implementation, we might need a custom endpoint for this
    throw new Error("API endpoint not implemented");
  }

  public async exportLogs(format: "json" | "csv" = "json"): Promise<Blob> {
    // Note: This endpoint doesn't exist in the API specification
    // For a real implementation, we would need a custom endpoint that returns a blob
    throw new Error("API endpoint not implemented");
  }

  // Statistics summary method
  public async getStatisticsSummary(): Promise<StatisticsSummary> {
    // Since this isn't in the API spec, we'll derive it from other endpoints
    try {
      const healthPromise = this.request<any>("/health/detailed");
      const statsPromise = this.request<any>('/appointments/stats');
      
      const [health, stats] = await Promise.all([healthPromise, statsPromise]);
      
      // Create a summary based on available data
      return {
        appointments: {
          total: stats.total_appointments || 0,
          trend: 0, // Would need historical data
          trendDirection: null,
        },
        bots: {
          active: Object.values(health.bots || {}).filter(status => status === 'running').length,
          total: Object.keys(health.bots || {}).length,
          trend: 0, // Would need historical data
          trendDirection: null,
        },
        users: {
          total: Object.keys(stats.bookings_by_country || {}).reduce((sum, key) => sum + (stats.bookings_by_country[key] || 0), 0),
          active: 0, // Not available in the API
          trend: 0, // Would need historical data
          trendDirection: null,
        },
        waitTime: {
          average: stats.average_wait_days || 0,
          trend: 0, // Would need historical data
          trendDirection: null,
        }
      };
    } catch (error) {
      console.error("Failed to get statistics summary", error);
      return {
        appointments: { total: 0, trend: 0, trendDirection: null },
        bots: { active: 0, total: 0, trend: 0, trendDirection: null },
        users: { total: 0, active: 0, trend: 0, trendDirection: null },
        waitTime: { average: 0, trend: 0, trendDirection: null },
      };
    }
  }
}

// Export a singleton instance
export const apiClient = new ApiClient()
