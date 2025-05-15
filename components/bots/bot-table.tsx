"use client"

import { useState } from "react"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ChevronUp, 
  ChevronDown, 
  ExternalLink, 
  Play, 
  Square, 
  RefreshCw, 
  Trash2,
  CheckCircle,
  AlertCircle,
  Clock,
  Mail
} from "lucide-react"
import type { BotResponse, BotStatus } from "@/lib/api-client"

// Helper for row grouping logic
type GroupedBots = {
  [key: string]: BotResponse[]
}

interface BotTableProps {
  bots: BotResponse[]
  countryNameMap: (code: string) => string
  facilityNameMap: (id?: string | null) => string
  groupByEmail: boolean
  sortBy: string
  sortDirection: "asc" | "desc"
  isAdmin: boolean
  onViewDetails: (botId: string) => void
  onAction: (botId: string, action: string) => void
  onDelete: (botId: string) => void
  onSortChange: (field: string) => void
}

export function BotTable({ 
  bots, 
  countryNameMap, 
  facilityNameMap,
  groupByEmail,
  sortBy,
  sortDirection,
  isAdmin,
  onViewDetails,
  onAction,
  onDelete,
  onSortChange
}: BotTableProps) {
  const [expandedGroups, setExpandedGroups] = useState<{ [key: string]: boolean }>({})

  // Get status badge variant
  const getStatusBadge = (status: BotStatus) => {
    switch (status) {
      case "running":
        return <Badge variant="success" className="flex items-center"><CheckCircle className="mr-1 h-3 w-3" /> Running</Badge>
      case "error":
        return <Badge variant="destructive" className="flex items-center"><AlertCircle className="mr-1 h-3 w-3" /> Error</Badge>
      case "stopped":
        return <Badge variant="secondary" className="flex items-center"><Clock className="mr-1 h-3 w-3" /> Stopped</Badge>
      case "completed":
        return <Badge variant="outline" className="flex items-center"><CheckCircle className="mr-1 h-3 w-3" /> Completed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Toggle group expansion
  const toggleGroup = (key: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  // Render regular table (no grouping)
  const renderRegularTable = () => (
    <Table className="border bg-background">
      <TableHeader className="bg-muted/50">
        <TableRow>
          <TableHead onClick={() => onSortChange('config.EMAIL')} className="cursor-pointer hover:bg-muted">
            Email {sortBy === 'config.EMAIL' && (sortDirection === 'asc' ? <ChevronUp className="inline h-4 w-4" /> : <ChevronDown className="inline h-4 w-4" />)}
          </TableHead>
          <TableHead onClick={() => onSortChange('config.COUNTRY')} className="cursor-pointer hover:bg-muted">
            Country {sortBy === 'config.COUNTRY' && (sortDirection === 'asc' ? <ChevronUp className="inline h-4 w-4" /> : <ChevronDown className="inline h-4 w-4" />)}
          </TableHead>
          <TableHead onClick={() => onSortChange('config.FACILITY_ID')} className="cursor-pointer hover:bg-muted">
            Facility {sortBy === 'config.FACILITY_ID' && (sortDirection === 'asc' ? <ChevronUp className="inline h-4 w-4" /> : <ChevronDown className="inline h-4 w-4" />)}
          </TableHead>
          <TableHead onClick={() => onSortChange('status')} className="cursor-pointer hover:bg-muted">
            Status {sortBy === 'status' && (sortDirection === 'asc' ? <ChevronUp className="inline h-4 w-4" /> : <ChevronDown className="inline h-4 w-4" />)}
          </TableHead>
          <TableHead onClick={() => onSortChange('start_time')} className="cursor-pointer hover:bg-muted">
            Start Time {sortBy === 'start_time' && (sortDirection === 'asc' ? <ChevronUp className="inline h-4 w-4" /> : <ChevronDown className="inline h-4 w-4" />)}
          </TableHead>
          <TableHead>Date Range</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bots.map((bot) => (
          <TableRow key={bot.id} className="hover:bg-muted/50">
            <TableCell>
              <div className="font-medium truncate max-w-[200px]" title={bot.config.EMAIL}>
                {bot.config.EMAIL}
              </div>
            </TableCell>
            <TableCell>{countryNameMap(bot.config.COUNTRY)}</TableCell>
            <TableCell>{facilityNameMap(bot.config.FACILITY_ID)}</TableCell>
            <TableCell>{getStatusBadge(bot.status)}</TableCell>
            <TableCell>{new Date(bot.start_time).toLocaleString()}</TableCell>
            <TableCell>
              <div className="text-sm truncate max-w-[150px]">
                {bot.config.MIN_DATE ?? "Any"} - {bot.config.MAX_DATE ?? "Any"}
              </div>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-1">
                <Button variant="ghost" size="icon" onClick={() => onViewDetails(bot.id)} title="View Details">
                  <ExternalLink className="h-4 w-4" />
                </Button>
                
                {isAdmin && (
                  <>
                    {bot.status === "stopped" && (
                      <Button variant="ghost" size="icon" onClick={() => onAction(bot.id, "start")} title="Start Bot">
                        <Play className="h-4 w-4" />
                      </Button>
                    )}
                    
                    {bot.status === "running" && (
                      <Button variant="ghost" size="icon" onClick={() => onAction(bot.id, "stop")} title="Stop Bot">
                        <Square className="h-4 w-4" />
                      </Button>
                    )}
                    
                    <Button variant="ghost" size="icon" onClick={() => onAction(bot.id, "restart")} title="Restart Bot">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    
                    <Button variant="ghost" size="icon" onClick={() => onDelete(bot.id)} title="Delete Bot">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
        {bots.length === 0 && (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
              No bots found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )

  // Render grouped table (by email)
  const renderGroupedTable = () => {
    // Group bots by email
    const groupedBots = bots.reduce<GroupedBots>((acc, bot) => {
      const key = bot.config.EMAIL
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(bot)
      return acc
    }, {})

    // Sort each group by start time (newest first)
    Object.keys(groupedBots).forEach(key => {
      groupedBots[key].sort((a, b) => {
        return new Date(b.start_time).getTime() - new Date(a.start_time).getTime()
      })
    })

    // Initialize all groups as expanded by default
    if (Object.keys(expandedGroups).length === 0) {
      const initialExpandedState: { [key: string]: boolean } = {}
      Object.keys(groupedBots).forEach(key => {
        initialExpandedState[key] = true
      })
      setExpandedGroups(initialExpandedState)
    }

    return (
      <Table className="border">
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Facility</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Start Time</TableHead>
            <TableHead>Date Range</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(groupedBots).map(([email, botsForEmail]) => (
            <>
              <TableRow 
                key={email}
                className="bg-muted/30 cursor-pointer hover:bg-muted/50"
                onClick={() => toggleGroup(email)}
              >
                <TableCell colSpan={7} className="py-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{email}</span>
                      <Badge variant="outline" className="ml-3">{botsForEmail.length} bots</Badge>
                    </div>
                    {expandedGroups[email] ? 
                      <ChevronUp className="h-4 w-4" /> :
                      <ChevronDown className="h-4 w-4" />
                    }
                  </div>
                </TableCell>
              </TableRow>
              {expandedGroups[email] && botsForEmail.map((bot) => (
                <TableRow key={bot.id} className="hover:bg-muted/50">
                  <TableCell className="pl-8">
                    <span className="text-muted-foreground text-sm">↳</span>
                  </TableCell>
                  <TableCell>{countryNameMap(bot.config.COUNTRY)}</TableCell>
                  <TableCell>{facilityNameMap(bot.config.FACILITY_ID)}</TableCell>
                  <TableCell>{getStatusBadge(bot.status)}</TableCell>
                  <TableCell>{new Date(bot.start_time).toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="text-sm truncate max-w-[150px]">
                      {bot.config.MIN_DATE ?? "Any"} - {bot.config.MAX_DATE ?? "Any"}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => onViewDetails(bot.id)} title="View Details">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      
                      {isAdmin && (
                        <>
                          {bot.status === "stopped" && (
                            <Button variant="ghost" size="icon" onClick={() => onAction(bot.id, "start")} title="Start Bot">
                              <Play className="h-4 w-4" />
                            </Button>
                          )}
                          
                          {bot.status === "running" && (
                            <Button variant="ghost" size="icon" onClick={() => onAction(bot.id, "stop")} title="Stop Bot">
                              <Square className="h-4 w-4" />
                            </Button>
                          )}
                          
                          <Button variant="ghost" size="icon" onClick={() => onAction(bot.id, "restart")} title="Restart Bot">
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                          
                          <Button variant="ghost" size="icon" onClick={() => onDelete(bot.id)} title="Delete Bot">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </>
          ))}
          {Object.keys(groupedBots).length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No bots found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    )
  }

  return (
    <div className="rounded-md bg-background">
      <div className="overflow-x-auto">
        {groupByEmail ? renderGroupedTable() : renderRegularTable()}
      </div>
    </div>
  )
}
