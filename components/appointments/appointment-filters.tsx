"use client"

import { useState, useEffect } from "react"
import { Filter, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { apiClient } from "@/lib/api-client"
import { format } from "date-fns"

interface AppointmentFiltersProps {
  onFilterChange: (country: string, dateRange: [Date | undefined, Date | undefined]) => void
}

export function AppointmentFilters({ onFilterChange }: AppointmentFiltersProps) {
  const [country, setCountry] = useState("all")
  const [dateRange, setDateRange] = useState<[Date | undefined, Date | undefined]>([undefined, undefined])
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const countries = apiClient.getCountries()

  useEffect(() => {
    onFilterChange(country, dateRange)
  }, [country, dateRange, onFilterChange])

  const handleCountryChange = (value: string) => {
    setCountry(value)
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

  return (
    <div className="flex flex-col sm:flex-row gap-2 items-center">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select value={country} onValueChange={handleCountryChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by country" />
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
      </div>

      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[220px] justify-start text-left font-normal">
            <Calendar className="mr-2 h-4 w-4" />
            {getDateRangeText()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
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
            className="rounded-md border"
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
