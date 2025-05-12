"use client"

import type React from "react"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { Search, Filter, Calendar } from "lucide-react"

interface LogsFilterProps {
  bots: any[]
  onFilterChange: (filters: any) => void
  filters: {
    botId: string
    logLevel: string
    dateRange: [Date | undefined, Date | undefined]
    searchQuery: string
  }
}

export function LogsFilter({ bots, onFilterChange, filters }: LogsFilterProps) {
  const handleBotChange = (value: string) => {
    onFilterChange({ botId: value })
  }

  const handleLevelChange = (value: string) => {
    onFilterChange({ logLevel: value })
  }

  const handleDateRangeChange = (value: [Date | undefined, Date | undefined]) => {
    onFilterChange({ dateRange: value })
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ searchQuery: e.target.value })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search logs..."
            className="w-full pl-8"
            value={filters.searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={filters.botId} onValueChange={handleBotChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by bot" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Bots</SelectItem>
                <SelectItem value="system">System</SelectItem>
                {Array.isArray(bots) &&
                  bots.map((bot) => (
                    <SelectItem key={bot.id} value={bot.id}>
                      {bot.config.EMAIL}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Select value={filters.logLevel} onValueChange={handleLevelChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <DateRangePicker value={filters.dateRange} onChange={handleDateRangeChange} />
      </div>
    </div>
  )
}
