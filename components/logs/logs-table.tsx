"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, AlertTriangle, Info, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"

interface LogsTableProps {
  logs: any[]
  isLoading: boolean
  pageSize?: number
}

export function LogsTable({ logs, isLoading, pageSize = 10 }: LogsTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const router = useRouter()

  const totalPages = Math.ceil(logs.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const currentLogs = logs.slice(startIndex, endIndex)

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  const getLevelBadge = (level: string) => {
    switch (level) {
      case "error":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Error
          </Badge>
        )
      case "warning":
        return (
          <Badge className="bg-yellow-500 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Warning
          </Badge>
        )
      case "info":
      default:
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Info className="h-3 w-3" />
            Info
          </Badge>
        )
    }
  }

  const truncateMessage = (message: string, maxLength = 100) => {
    if (message.length <= maxLength) return message
    return message.substring(0, maxLength) + "..."
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Bot</TableHead>
                <TableHead className="w-[40%]">Message</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-8 w-8 ml-auto" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <p className="text-muted-foreground">No logs found</p>
        <p className="text-sm text-muted-foreground mt-1">
          Try adjusting your filters to find what you're looking for.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Bot</TableHead>
              <TableHead className="w-[40%]">Message</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentLogs.map((log) => (
              <TableRow key={log.id} className="group">
                <TableCell className="font-mono text-xs">
                  {format(new Date(log.timestamp), "yyyy-MM-dd HH:mm:ss")}
                </TableCell>
                <TableCell>{getLevelBadge(log.level)}</TableCell>
                <TableCell>{log.botName || "System"}</TableCell>
                <TableCell className="font-medium">{truncateMessage(log.message)}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push(`/logs/${log.id}`)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span className="sr-only">View details</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(endIndex, logs.length)} of {logs.length} logs
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous page</span>
            </Button>
            <div className="text-sm">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
