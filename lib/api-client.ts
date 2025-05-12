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
  private async request<T>(endpoint: string, method = "GET", data?: any): Promise<T> {
    if (!this.baseUrl) {
      throw new Error("No active server configured")
    }

    const token = localStorage.getItem("token")
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    const config: RequestInit = {
      method,
      headers,
    }

    if (data) {
      config.body = JSON.stringify(data)
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, config)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `API request failed with status ${response.status}`)
    }

    return response.json()
  }

  // Bot Management API Methods
  public async getAllBots(): Promise<BotList> {
    // For demo purposes, return mock data
    return {
      bots: [
        {
          id: "bot1",
          config: {
            EMAIL: "user1@example.com",
            PASSWORD: "password123",
            COUNTRY: "gb",
            FACILITY_ID: "94",
            ASC_FACILITY_ID: "94",
            MIN_DATE: "2023-06-01",
            MAX_DATE: "2023-12-31",
          },
          status: "running",
          start_time: "2023-05-01T12:00:00Z",
          logs: [
            {
              message: "Bot started successfully",
              type: "info",
              timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
            },
            {
              message: "Logging in to appointment system",
              type: "info",
              timestamp: new Date(Date.now() - 4 * 60000).toISOString(),
            },
          ],
        },
        {
          id: "bot2",
          config: {
            EMAIL: "user2@example.com",
            PASSWORD: "password456",
            COUNTRY: "fr",
            FACILITY_ID: "92",
            MIN_DATE: "2023-07-01",
            MAX_DATE: "2023-11-30",
          },
          status: "stopped",
          start_time: "2023-05-02T14:30:00Z",
          logs: [],
        },
        {
          id: "bot3",
          config: {
            EMAIL: "user3@example.com",
            PASSWORD: "password789",
            COUNTRY: "es",
            FACILITY_ID: "93",
            MIN_DATE: "2023-08-01",
            MAX_DATE: "2023-10-31",
          },
          status: "error",
          start_time: "2023-05-03T09:15:00Z",
          logs: [
            {
              message: "Failed to connect to appointment system: Connection timeout",
              type: "error",
              timestamp: new Date(Date.now() - 30000).toISOString(),
            },
          ],
        },
      ],
    }
    // In a real app, you would use:
    // return this.request<BotList>("/bots");
  }

  public async getBot(botId: string): Promise<BotResponse> {
    // For demo purposes, return mock data
    const mockBots = {
      bot1: {
        id: "bot1",
        config: {
          EMAIL: "user1@example.com",
          PASSWORD: "password123",
          COUNTRY: "gb",
          FACILITY_ID: "94",
          ASC_FACILITY_ID: "94",
          MIN_DATE: "2023-06-01",
          MAX_DATE: "2023-12-31",
        },
        status: "running",
        start_time: "2023-05-01T12:00:00Z",
        logs: [
          {
            message: "Bot started successfully",
            type: "info",
            timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
          },
          {
            message: "Logging in to appointment system",
            type: "info",
            timestamp: new Date(Date.now() - 4 * 60000).toISOString(),
          },
        ],
      },
      bot2: {
        id: "bot2",
        config: {
          EMAIL: "user2@example.com",
          PASSWORD: "password456",
          COUNTRY: "fr",
          FACILITY_ID: "92",
          MIN_DATE: "2023-07-01",
          MAX_DATE: "2023-11-30",
        },
        status: "stopped",
        start_time: "2023-05-02T14:30:00Z",
        logs: [],
      },
      bot3: {
        id: "bot3",
        config: {
          EMAIL: "user3@example.com",
          PASSWORD: "password789",
          COUNTRY: "es",
          FACILITY_ID: "93",
          MIN_DATE: "2023-08-01",
          MAX_DATE: "2023-10-31",
        },
        status: "error",
        start_time: "2023-05-03T09:15:00Z",
        logs: [
          {
            message: "Failed to connect to appointment system: Connection timeout",
            type: "error",
            timestamp: new Date(Date.now() - 30000).toISOString(),
          },
        ],
      },
    }

    if (botId in mockBots) {
      return mockBots[botId as keyof typeof mockBots]
    }

    throw new Error("Bot not found")
    // In a real app, you would use:
    // return this.request<BotResponse>(`/bots/${botId}`);
  }

  public async createBot(config: BotConfig): Promise<BotResponse> {
    // For demo purposes, return mock data
    return {
      id: "new-bot-" + Date.now(),
      config,
      status: "stopped",
      start_time: new Date().toISOString(),
      logs: [],
    }
    // In a real app, you would use:
    // return this.request<BotResponse>("/bots", "POST", { config });
  }

  public async deleteBot(botId: string): Promise<GenericResponse> {
    // For demo purposes, return mock data
    return {
      success: true,
      message: `Bot ${botId} deleted successfully`,
    }
    // In a real app, you would use:
    // return this.request<GenericResponse>(`/bots/${botId}`, "DELETE");
  }

  public async startBot(botId: string): Promise<GenericResponse> {
    // For demo purposes, return mock data
    return {
      success: true,
      message: `Bot ${botId} started successfully`,
    }
    // In a real app, you would use:
    // return this.request<GenericResponse>(`/bots/${botId}/start`, "POST");
  }

  public async stopBot(botId: string): Promise<GenericResponse> {
    // For demo purposes, return mock data
    return {
      success: true,
      message: `Bot ${botId} stopped successfully`,
    }
    // In a real app, you would use:
    // return this.request<GenericResponse>(`/bots/${botId}/stop`, "POST");
  }

  public async restartBot(botId: string): Promise<GenericResponse> {
    // For demo purposes, return mock data
    return {
      success: true,
      message: `Bot ${botId} restarted successfully`,
    }
    // In a real app, you would use:
    // return this.request<GenericResponse>(`/bots/${botId}/restart`, "POST");
  }

  public async getBotLogs(botId: string, limit = 100): Promise<LogEntry[]> {
    // For demo purposes, return mock data
    const mockLogs: Record<string, LogEntry[]> = {
      bot1: [
        {
          message: "Bot started successfully",
          type: "info",
          timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
        },
        {
          message: "Logging in to appointment system",
          type: "info",
          timestamp: new Date(Date.now() - 4 * 60000).toISOString(),
        },
        {
          message: "Login successful",
          type: "info",
          timestamp: new Date(Date.now() - 3 * 60000).toISOString(),
        },
        {
          message: "Searching for available appointments",
          type: "info",
          timestamp: new Date(Date.now() - 2 * 60000).toISOString(),
        },
        {
          message: "Found appointment on 2023-06-15",
          type: "info",
          timestamp: new Date(Date.now() - 1 * 60000).toISOString(),
        },
      ],
      bot2: [
        {
          message: "Bot started successfully",
          type: "info",
          timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
        },
        {
          message: "Logging in to appointment system",
          type: "info",
          timestamp: new Date(Date.now() - 29 * 60000).toISOString(),
        },
        {
          message: "Login successful",
          type: "info",
          timestamp: new Date(Date.now() - 28 * 60000).toISOString(),
        },
        {
          message: "No available appointments found",
          type: "warning",
          timestamp: new Date(Date.now() - 27 * 60000).toISOString(),
        },
        {
          message: "Bot stopped by user",
          type: "info",
          timestamp: new Date(Date.now() - 26 * 60000).toISOString(),
        },
      ],
      bot3: [
        {
          message: "Bot started successfully",
          type: "info",
          timestamp: new Date(Date.now() - 10 * 60000).toISOString(),
        },
        {
          message: "Logging in to appointment system",
          type: "info",
          timestamp: new Date(Date.now() - 9 * 60000).toISOString(),
        },
        {
          message: "Login failed: Invalid credentials",
          type: "error",
          timestamp: new Date(Date.now() - 8 * 60000).toISOString(),
        },
        {
          message: "Retrying login...",
          type: "info",
          timestamp: new Date(Date.now() - 7 * 60000).toISOString(),
        },
        {
          message: "Login failed: Invalid credentials",
          type: "error",
          timestamp: new Date(Date.now() - 6 * 60000).toISOString(),
        },
        {
          message: "Bot stopped due to error",
          type: "error",
          timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
        },
      ],
    }

    if (botId in mockLogs) {
      return mockLogs[botId].slice(0, limit)
    }

    return []
    // In a real app, you would use:
    // return this.request<LogEntry[]>(`/bots/${botId}/logs?limit=${limit}`);
  }

  public async clearBotLogs(botId: string): Promise<GenericResponse> {
    // For demo purposes, return mock data
    return {
      success: true,
      message: `Logs for bot ${botId} cleared successfully`,
    }
    // In a real app, you would use:
    // return this.request<GenericResponse>(`/bots/${botId}/logs/clear`, "POST");
  }

  // Appointment Management API Methods
  public async getAllAppointments(page = 1, pageSize = 10): Promise<AppointmentList> {
    // For demo purposes, return mock data
    return {
      appointments: [
        {
          id: "appt1",
          bot_id: "bot1",
          email: "user1@example.com",
          country: "gb",
          facility_id: "94",
          facility_name: "London Embassy",
          appointment_date: "2025-05-15",
          appointment_time: "10:30 AM",
          booked_at: "2023-05-01T12:30:00Z",
          status: "pending",
        },
        {
          id: "appt2",
          bot_id: "bot2",
          email: "user2@example.com",
          country: "fr",
          facility_id: "92",
          facility_name: "Paris Embassy",
          appointment_date: "2025-05-10",
          appointment_time: "9:00 AM",
          booked_at: "2023-04-28T14:15:00Z",
          status: "confirmed",
        },
        {
          id: "appt3",
          bot_id: "bot3",
          email: "user3@example.com",
          country: "de",
          facility_id: "93",
          facility_name: "Berlin Consulate",
          appointment_date: "2025-05-12",
          appointment_time: "2:15 PM",
          asc_appointment_date: "2025-05-05",
          asc_appointment_time: "11:00 AM",
          booked_at: "2023-04-30T09:45:00Z",
          visa_type: "B1/B2",
          notes: "Applicant requested wheelchair access",
          status: "pending",
        },
      ],
      total_count: 3,
      page,
      page_size: pageSize,
    }
    // In a real app, you would use:
    // return this.request<AppointmentList>(`/appointments?page=${page}&page_size=${pageSize}`);
  }

  public async getAppointment(appointmentId: string): Promise<SuccessfulAppointment> {
    // For demo purposes, return mock data
    const mockAppointments: Record<string, SuccessfulAppointment> = {
      appt1: {
        id: "appt1",
        bot_id: "bot1",
        email: "user1@example.com",
        country: "gb",
        facility_id: "94",
        facility_name: "London Embassy",
        appointment_date: "2025-05-15",
        appointment_time: "10:30 AM",
        booked_at: "2023-05-01T12:30:00Z",
        status: "pending",
      },
      appt2: {
        id: "appt2",
        bot_id: "bot2",
        email: "user2@example.com",
        country: "fr",
        facility_id: "92",
        facility_name: "Paris Embassy",
        appointment_date: "2025-05-10",
        appointment_time: "9:00 AM",
        booked_at: "2023-04-28T14:15:00Z",
        status: "confirmed",
      },
      appt3: {
        id: "appt3",
        bot_id: "bot3",
        email: "user3@example.com",
        country: "de",
        facility_id: "93",
        facility_name: "Berlin Consulate",
        appointment_date: "2025-05-12",
        appointment_time: "2:15 PM",
        asc_appointment_date: "2025-05-05",
        asc_appointment_time: "11:00 AM",
        booked_at: "2023-04-30T09:45:00Z",
        visa_type: "B1/B2",
        notes: "Applicant requested wheelchair access",
        status: "pending",
      },
    }

    if (appointmentId in mockAppointments) {
      return mockAppointments[appointmentId]
    }

    throw new Error("Appointment not found")
    // In a real app, you would use:
    // return this.request<SuccessfulAppointment>(`/appointments/${appointmentId}`);
  }

  public async confirmAppointment(appointmentId: string): Promise<GenericResponse> {
    // For demo purposes, return mock data
    return {
      success: true,
      message: `Appointment ${appointmentId} confirmed successfully`,
    }
    // In a real app, you would use:
    // return this.request<GenericResponse>(`/appointments/${appointmentId}/confirm`, "POST");
  }

  public async cancelAppointment(appointmentId: string): Promise<GenericResponse> {
    // For demo purposes, return mock data
    return {
      success: true,
      message: `Appointment ${appointmentId} cancelled successfully`,
    }
    // In a real app, you would use:
    // return this.request<GenericResponse>(`/appointments/${appointmentId}/cancel`, "POST");
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
  public async getAllLogs(): Promise<LogEntryExtended[]> {
    // For demo purposes, return mock data
    return [
      {
        id: "log1",
        timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
        level: "info",
        message: "System started successfully",
        source: "system/startup",
      },
      {
        id: "log2",
        timestamp: new Date(Date.now() - 10 * 60000).toISOString(),
        level: "info",
        message: "Bot started successfully",
        botId: "bot1",
        botName: "London Bot",
        source: "bot/lifecycle",
      },
      {
        id: "log3",
        timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
        level: "warning",
        message: "Slow response from appointment system",
        botId: "bot1",
        botName: "London Bot",
        source: "bot/network",
        context: {
          responseTime: 5000,
          endpoint: "/api/appointments",
          attempt: 2,
        },
      },
      {
        id: "log4",
        timestamp: new Date(Date.now() - 20 * 60000).toISOString(),
        level: "error",
        message: "Failed to connect to appointment system: Connection timeout",
        botId: "bot3",
        botName: "Berlin Bot",
        source: "bot/network",
        context: {
          endpoint: "/api/login",
          attempt: 3,
          timeout: 30000,
        },
        stackTrace:
          "Error: Connection timeout\n    at BotClient.connect (/app/src/bot/client.js:45:23)\n    at async Bot.start (/app/src/bot/index.js:78:12)",
      },
      {
        id: "log5",
        timestamp: new Date(Date.now() - 25 * 60000).toISOString(),
        level: "info",
        message: "User logged in",
        source: "auth/login",
        context: {
          userId: "user123",
          role: "admin",
          ip: "192.168.1.1",
        },
      },
      {
        id: "log6",
        timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
        level: "info",
        message: "Bot configuration updated",
        botId: "bot2",
        botName: "Paris Bot",
        source: "bot/config",
        context: {
          changes: {
            MIN_DATE: "2023-06-01",
            MAX_DATE: "2023-12-31",
          },
          userId: "user123",
        },
      },
      {
        id: "log7",
        timestamp: new Date(Date.now() - 35 * 60000).toISOString(),
        level: "warning",
        message: "Multiple failed login attempts detected",
        source: "auth/security",
        context: {
          attempts: 5,
          ip: "203.0.113.1",
          timeWindow: "10 minutes",
        },
      },
      {
        id: "log8",
        timestamp: new Date(Date.now() - 40 * 60000).toISOString(),
        level: "error",
        message: "Database connection error",
        source: "database/connection",
        context: {
          database: "appointments",
          error: "ECONNREFUSED",
        },
        stackTrace:
          "Error: ECONNREFUSED\n    at Database.connect (/app/src/database/index.js:67:11)\n    at async AppointmentService.getAll (/app/src/services/appointments.js:23:8)",
      },
      {
        id: "log9",
        timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
        level: "info",
        message: "Appointment found",
        botId: "bot1",
        botName: "London Bot",
        source: "bot/appointment",
        context: {
          appointmentId: "appt1",
          date: "2023-06-15",
          time: "10:30 AM",
          facility: "London Embassy",
        },
      },
      {
        id: "log10",
        timestamp: new Date(Date.now() - 50 * 60000).toISOString(),
        level: "info",
        message: "System backup completed",
        source: "system/backup",
        context: {
          backupId: "backup-2023-05-01",
          size: "1.2GB",
          duration: "45 seconds",
        },
      },
      {
        id: "log11",
        timestamp: new Date(Date.now() - 55 * 60000).toISOString(),
        level: "warning",
        message: "High CPU usage detected",
        source: "system/monitoring",
        context: {
          cpu: "85%",
          memory: "70%",
          duration: "5 minutes",
        },
      },
      {
        id: "log12",
        timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
        level: "error",
        message: "Failed to send email notification",
        source: "notifications/email",
        context: {
          recipient: "user@example.com",
          subject: "Appointment Confirmation",
          error: "SMTP connection failed",
        },
        stackTrace:
          "Error: SMTP connection failed\n    at EmailService.send (/app/src/services/email.js:112:9)\n    at async NotificationService.sendAppointmentConfirmation (/app/src/services/notifications.js:45:14)",
      },
    ]
    // In a real app, you would use:
    // return this.request<LogEntry[]>("/logs");
  }

  public async getLogById(logId: string): Promise<LogEntryExtended> {
    // For demo purposes, return mock data
    const allLogs = await this.getAllLogs()
    const log = allLogs.find((log) => log.id === logId)

    if (!log) {
      throw new Error("Log not found")
    }

    return log
    // In a real app, you would use:
    // return this.request<LogEntry>(`/logs/${logId}`);
  }

  public async clearAllLogs(): Promise<GenericResponse> {
    // For demo purposes, return mock data
    return {
      success: true,
      message: "All logs cleared successfully",
    }
    // In a real app, you would use:
    // return this.request<GenericResponse>("/logs/clear", "POST");
  }

  public async exportLogs(format: "json" | "csv" = "json"): Promise<Blob> {
    // For demo purposes, this would be implemented in a real app
    // to return a blob for download
    throw new Error("Not implemented")
    // In a real app, you would use:
    // return this.request<Blob>(`/logs/export?format=${format}`, "GET", null, "blob");
  }

  // Add this method to the ApiClient class, before the closing brace of the class
  public async getStatisticsSummary(): Promise<StatisticsSummary> {
    // For demo purposes, return mock data
    return {
      appointments: {
        total: 124,
        trend: 12,
        trendDirection: "up",
      },
      bots: {
        active: 8,
        total: 12,
        trend: 5,
        trendDirection: "up",
      },
      users: {
        total: 68,
        active: 42,
        trend: 8,
        trendDirection: "up",
      },
      waitTime: {
        average: 42,
        trend: 3,
        trendDirection: "down",
      },
    }
    // In a real app, you would use:
    // return this.request<StatisticsSummary>("/statistics/summary");
  }
}

// Export a singleton instance
export const apiClient = new ApiClient()
