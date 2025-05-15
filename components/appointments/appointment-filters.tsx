"use client"

import { useState, useEffect } from "react"
import { Filter, Calendar, SortDesc, LayoutGrid, List, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { apiClient } from "@/lib/api-client"
import { format } from "date-fns"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuRadioGroup, 
  DropdownMenuRadioItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface AppointmentFiltersProps {
  onFilterChange: (country: string, dateRange: [Date | undefined, Date | undefined]) => void
  onViewChange: (view: "card" | "table") => void
  onSortChange: (field: string, direction: "asc" | "desc") => void
  onGroupByEmailChange: (groupByEmail: boolean) => void
  viewType: "card" | "table"
  groupByEmail: boolean
  sortField: string
  sortDirection: "asc" | "desc"
}

export function AppointmentFilters({ 
  onFilterChange, 
  onViewChange, 
  onSortChange,
  onGroupByEmailChange,
  viewType, 
  groupByEmail,
  sortField,
  sortDirection
}: AppointmentFiltersProps) {
  const [country, setCountry] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateRange, setDateRange] = useState<[Date | undefined, Date | undefined]>([undefined, undefined])
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const countries = apiClient.getCountries()

  useEffect(() => {
    onFilterChange(country, dateRange)
  }, [country, dateRange, onFilterChange])

  const handleCountryChange = (value: string) => {
    setCountry(value)
  }

  const handleStatusChange = (value: string) => {
    setStatusFilter(value)
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return

    const [start, end] = dateRange

    if (!start || (start && end)) {
      // If no start date or both dates are set, set start date
      setDateRange([date, undefined])
    } else {
      // If only start date is set
      if (date < start) {
        // If selected date is before start date, swap them
        setDateRange([date, start])
      } else {
        // Otherwise, set end date
        setDateRange([start, date])
      }
      setIsCalendarOpen(false)
    }
  }

  const clearDateRange = () => {
    setDateRange([undefined, undefined])
  }

  const getDateRangeText = () => {
    if (!dateRange[0] && !dateRange[1]) return "Select date range"

    if (dateRange[0] && !dateRange[1]) {
      return `From ${format(dateRange[0], "MMM d, yyyy")}`
    }

    if (dateRange[0] && dateRange[1]) {
      return `${format(dateRange[0], "MMM d")} - ${format(dateRange[1], "MMM d, yyyy")}`
    }

    return "Select date range"
  }

  const handleSortChange = (value: string) => {
    // Toggle direction if same field, otherwise default to desc
    const newDirection = value === sortField && sortDirection === "desc" ? "asc" : "desc"
    onSortChange(value, newDirection)
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Left side: View switcher */}
        <div className="flex items-center gap-2">
          <Tabs 
            value={viewType} 
            onValueChange={(value) => onViewChange(value as "card" | "table")}
            className="mr-2"
          >
            <TabsList>
              <TabsTrigger value="card" className="flex items-center gap-1">
                <LayoutGrid className="h-4 w-4" />
                <span className="hidden sm:inline">Cards</span>
              </TabsTrigger>
              <TabsTrigger value="table" className="flex items-center gap-1">
                <List className="h-4 w-4" />
                <span className="hidden sm:inline">Table</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Only show group by email in table view */}
          {viewType === "table" && (
            <div className="flex items-center space-x-2">
              <Switch 
                id="group-by-email" 
                checked={groupByEmail}
                onCheckedChange={onGroupByEmailChange}
              />
              <Label htmlFor="group-by-email" className="flex items-center cursor-pointer">
                <Mail className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Group by email</span>
              </Label>
            </div>
          )}
        </div>

        {/* Right side: Filters */}
        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center w-full sm:w-auto">
          {/* Sort dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <SortDesc className="h-4 w-4" />
                <span className="hidden sm:inline">Sort</span>
                <span className="inline sm:hidden">
                  {sortField === "appointment_date" ? "Date" :
                   sortField === "booked_at" ? "Booked" :
                   sortField === "email" ? "Email" :
                   sortField === "country" ? "Country" :
                   sortField === "facility_name" ? "Facility" :
                   sortField === "status" ? "Status" : "Sort"}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuRadioGroup value={sortField} onValueChange={handleSortChange}>
                <DropdownMenuRadioItem value="appointment_date">
                  Date {sortField === "appointment_date" && (sortDirection === "asc" ? "↑" : "↓")}
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="booked_at">
                  Booked At {sortField === "booked_at" && (sortDirection === "asc" ? "↑" : "↓")}
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="email">
                  Email {sortField === "email" && (sortDirection === "asc" ? "↑" : "↓")}
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="country">
                  Country {sortField === "country" && (sortDirection === "asc" ? "↑" : "↓")}
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="facility_name">
                  Facility {sortField === "facility_name" && (sortDirection === "asc" ? "↑" : "↓")}
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="status">
                  Status {sortField === "status" && (sortDirection === "asc" ? "↑" : "↓")}
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Country filter */}
          <Select value={country} onValueChange={handleCountryChange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
              {countries.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status filter */}
          <Select value={statusFilter} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          {/* Date range picker */}
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[150px] sm:w-[180px] justify-start text-left font-normal text-sm">
                <Calendar className="mr-2 h-4 w-4" />
                {getDateRangeText()}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <div className="p-3 border-b">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Date Range</h4>
                  <Button variant="ghost" size="sm" onClick={clearDateRange}>
                    Clear
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {dateRange[0] && !dateRange[1] ? "Select end date" : "Select start date"}
                </p>
              </div>
              <CalendarComponent
                mode="single"
                selected={dateRange[0] || dateRange[1]}
                onSelect={handleDateSelect}
                initialFocus
                className="rounded-md bg-background"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  )
}
