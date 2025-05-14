"use client"

import { useState } from "react"
import { Filter, SortDesc, LayoutGrid, List, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { apiClient } from "@/lib/api-client"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuRadioGroup, 
  DropdownMenuRadioItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface BotFiltersProps {
  onStatusFilterChange: (status: string) => void
  onCountryFilterChange: (country: string) => void
  onViewChange: (view: "card" | "table") => void
  onSortChange: (field: string, direction: "asc" | "desc") => void
  onGroupByEmailChange: (groupByEmail: boolean) => void
  viewType: "card" | "table"
  groupByEmail: boolean
  statusFilter: string
  countryFilter: string
  sortField: string
  sortDirection: "asc" | "desc"
}

export function BotFilters({ 
  onStatusFilterChange,
  onCountryFilterChange,
  onViewChange, 
  onSortChange,
  onGroupByEmailChange,
  viewType,
  groupByEmail,
  statusFilter,
  countryFilter,
  sortField,
  sortDirection
}: BotFiltersProps) {
  const countries = apiClient.getCountries()
  
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
                  {sortField === "start_time" ? "Start Time" :
                   sortField === "config.EMAIL" ? "Email" :
                   sortField === "config.COUNTRY" ? "Country" :
                   sortField === "config.FACILITY_ID" ? "Facility" :
                   sortField === "status" ? "Status" : "Sort"}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuRadioGroup value={sortField} onValueChange={handleSortChange}>
                <DropdownMenuRadioItem value="start_time">
                  Start Time {sortField === "start_time" && (sortDirection === "asc" ? "↑" : "↓")}
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="config.EMAIL">
                  Email {sortField === "config.EMAIL" && (sortDirection === "asc" ? "↑" : "↓")}
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="config.COUNTRY">
                  Country {sortField === "config.COUNTRY" && (sortDirection === "asc" ? "↑" : "↓")}
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="config.FACILITY_ID">
                  Facility {sortField === "config.FACILITY_ID" && (sortDirection === "asc" ? "↑" : "↓")}
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="status">
                  Status {sortField === "status" && (sortDirection === "asc" ? "↑" : "↓")}
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Status filter */}
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="running">Running</SelectItem>
              <SelectItem value="stopped">Stopped</SelectItem>
              <SelectItem value="error">Error</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          {/* Country filter */}
          <Select value={countryFilter} onValueChange={onCountryFilterChange}>
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
        </div>
      </div>
    </div>
  )
}
