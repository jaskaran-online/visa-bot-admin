"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar, Search, RefreshCw, Download } from "lucide-react"
import { AppointmentCard } from "@/components/appointments/appointment-card"
import { AppointmentTable } from "@/components/appointments/appointment-table"
import { AppointmentFilters } from "@/components/appointments/appointment-filters"
import { apiClient, type SuccessfulAppointment } from "@/lib/api-client"
import { getAllAppointments } from "@/lib/api/appointments"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"
import { useIsMobile } from "@/hooks/use-mobile"

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<SuccessfulAppointment[]>([])
  const [filteredAppointments, setFilteredAppointments] = useState<SuccessfulAppointment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [countryFilter, setCountryFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState<[Date | undefined, Date | undefined]>([undefined, undefined])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [viewType, setViewType] = useState<"card" | "table">("card")
  const [groupByEmail, setGroupByEmail] = useState(false)
  const [sortField, setSortField] = useState("appointment_date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  
  const router = useRouter()
  const { toast } = useToast()

  const isMobile = useIsMobile()

  useEffect(() => {
    if (!isMobile) {
      setViewType("table")
      setGroupByEmail(true)
    }
  }, [isMobile])

  const fetchAppointments = async () => {
    try {
      setIsRefreshing(true)
      
      // Create filters object
      const filters: any = {};
      
      if (countryFilter !== "all") {
        filters.country = countryFilter;
      }
      
      if (dateFilter[0] && dateFilter[1]) {
        filters.from_date = format(dateFilter[0], "yyyy-MM-dd");
        filters.to_date = format(dateFilter[1], "yyyy-MM-dd");
      }
      
      // Add sort options to filters
      filters.sort_by = sortField;
      filters.sort_order = sortDirection;
      
      // Use the API handler to fetch appointments with filters
      const data = await getAllAppointments(page, 50, filters); // Increased page size
      setAppointments(data.appointments)
      setFilteredAppointments(data.appointments)
      setTotalPages(Math.ceil(data.total_count / data.page_size))
    } catch (error) {
      toast({
        title: "Error fetching appointments",
        description: "Failed to load appointments. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchAppointments()
  }, [page, sortField, sortDirection, toast])

  useEffect(() => {
    // When filter changes, reset to page 1 and fetch with new filters
    if (page !== 1) {
      setPage(1);
    } else {
      fetchAppointments();
    }
  }, [countryFilter, dateFilter])

  // For client-side filtering of already fetched appointments
  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const filtered = appointments.filter(
        (appointment) =>
          appointment.email.toLowerCase().includes(query) ||
          appointment.facility_name.toLowerCase().includes(query) ||
          apiClient.getCountryName(appointment.country).toLowerCase().includes(query),
      );
      setFilteredAppointments(filtered);
    } else {
      setFilteredAppointments(appointments);
    }
  }, [appointments, searchQuery])

  const handleRefresh = () => {
    fetchAppointments()
  }

  const handleExport = () => {
    try {
      // Create a CSV string
      let csv = "Email,Country,Facility,Appointment Date,Appointment Time,Status,Booked At\n"

      filteredAppointments.forEach((appointment) => {
        csv += `"${appointment.email}",`
        csv += `"${apiClient.getCountryName(appointment.country)}",`
        csv += `"${appointment.facility_name}",`
        csv += `"${format(new Date(appointment.appointment_date), "yyyy-MM-dd")}",`
        csv += `"${appointment.appointment_time}",`
        csv += `"${appointment.status}",`
        csv += `"${format(new Date(appointment.booked_at), "yyyy-MM-dd HH:mm:ss")}"\n`
      })

      // Create a blob and download link
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", `appointments-${format(new Date(), "yyyy-MM-dd")}.csv`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Export successful",
        description: "Appointments have been exported to CSV",
      })
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to export appointments. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage)
    }
  }

  const handleFilterChange = (country: string, dateRange: [Date | undefined, Date | undefined]) => {
    setCountryFilter(country)
    setDateFilter(dateRange)
  }

  const handleSortChange = (field: string, direction: "asc" | "desc") => {
    setSortField(field)
    setSortDirection(direction)
  }

  const handleViewChange = (view: "card" | "table") => {
    setViewType(view)
  }

  const handleGroupByEmailChange = (groupByEmail: boolean) => {
    setGroupByEmail(groupByEmail)
  }

  // Sort appointments client-side according to current sort settings
  const sortedAppointments = useMemo(() => {
    return [...filteredAppointments].sort((a, b) => {
      let aValue, bValue;
      
      // Extract the values to compare based on sortField
      switch (sortField) {
        case 'appointment_date':
          aValue = new Date(a.appointment_date).getTime();
          bValue = new Date(b.appointment_date).getTime();
          break;
        case 'booked_at':
          aValue = new Date(a.booked_at).getTime();
          bValue = new Date(b.booked_at).getTime();
          break;
        case 'email':
          aValue = a.email.toLowerCase();
          bValue = b.email.toLowerCase();
          break;
        case 'country':
          aValue = apiClient.getCountryName(a.country).toLowerCase();
          bValue = apiClient.getCountryName(b.country).toLowerCase();
          break;
        case 'facility_name':
          aValue = a.facility_name.toLowerCase();
          bValue = b.facility_name.toLowerCase();
          break;
        case 'status':
          aValue = a.status.toLowerCase();
          bValue = b.status.toLowerCase();
          break;
        default:
          aValue = new Date(a.appointment_date).getTime();
          bValue = new Date(b.appointment_date).getTime();
      }
      
      // Apply sort direction
      return sortDirection === 'asc' 
        ? (aValue > bValue ? 1 : -1)
        : (aValue < bValue ? 1 : -1);
    });
  }, [filteredAppointments, sortField, sortDirection]);

  return (
    <MainLayout>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
            <p className="text-muted-foreground">Manage visa appointments found by your bots</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search appointments..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <AppointmentFilters 
              onFilterChange={handleFilterChange}
              onViewChange={handleViewChange}
              onSortChange={handleSortChange}
              onGroupByEmailChange={handleGroupByEmailChange}
              viewType={viewType}
              groupByEmail={groupByEmail}
              sortField={sortField}
              sortDirection={sortDirection}
            />
          </div>

          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-lg border bg-card text-card-foreground shadow-sm">
                  <div className="p-6 space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                    <div className="flex justify-between">
                      <Skeleton className="h-10 w-20" />
                      <Skeleton className="h-10 w-20" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : sortedAppointments.length > 0 ? (
            <>
              {viewType === "card" ? (
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {sortedAppointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      countryName={apiClient.getCountryName(appointment.country)}
                      onViewDetails={() => router.push(`/appointments/${appointment.id}`)}
                    />
                  ))}
                </div>
              ) : (
                <AppointmentTable
                  appointments={sortedAppointments}
                  countryNameMap={(code) => apiClient.getCountryName(code)}
                  groupByEmail={groupByEmail}
                  sortBy={sortField}
                  sortDirection={sortDirection}
                  onViewDetails={(id) => router.push(`/appointments/${id}`)}
                  onSortChange={(field) => {
                    // Toggle sort direction if same field is clicked
                    if (field === sortField) {
                      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                    } else {
                      setSortField(field);
                      setSortDirection("desc"); // Default to desc for new fields
                    }
                  }}
                />
              )}

              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Showing {sortedAppointments.length} of {appointments.length} appointments
                </p>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
                    Previous
                  </Button>
                  <div className="text-sm">
                    Page {page} of {totalPages}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                <Calendar className="h-10 w-10 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">No appointments found</h3>
                <p className="mb-4 mt-2 text-sm text-muted-foreground">
                  {searchQuery || countryFilter !== "all" || (dateFilter[0] && dateFilter[1])
                    ? "Try adjusting your search or filters to find what you're looking for."
                    : "No appointments have been found by your bots yet."}
                </p>
                <Button variant="outline" onClick={handleRefresh}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
