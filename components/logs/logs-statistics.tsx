"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, AlertTriangle, Info } from "lucide-react"

interface LogsStatisticsProps {
  logs: any[]
  isLoading: boolean
}

export function LogsStatistics({ logs, isLoading }: LogsStatisticsProps) {
  if (isLoading) {
    return (
      <>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <Skeleton className="h-4 w-24" />
            </CardTitle>
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 mb-1" />
            <Skeleton className="h-4 w-32" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <Skeleton className="h-4 w-24" />
            </CardTitle>
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 mb-1" />
            <Skeleton className="h-4 w-32" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <Skeleton className="h-4 w-24" />
            </CardTitle>
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 mb-1" />
            <Skeleton className="h-4 w-32" />
          </CardContent>
        </Card>
      </>
    )
  }

  // Count logs by level
  const errorCount = logs.filter((log) => log.level === "error").length
  const warningCount = logs.filter((log) => log.level === "warning").length
  const infoCount = logs.filter((log) => log.level === "info").length
  const totalCount = logs.length

  // Get unique bot count
  const uniqueBots = new Set(logs.map((log) => log.botId)).size

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
          <Info className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCount}</div>
          <p className="text-xs text-muted-foreground">From {uniqueBots} different bots</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Errors</CardTitle>
          <AlertCircle className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{errorCount}</div>
          <p className="text-xs text-muted-foreground">
            {totalCount > 0 ? Math.round((errorCount / totalCount) * 100) : 0}% of total logs
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Warnings</CardTitle>
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{warningCount}</div>
          <p className="text-xs text-muted-foreground">
            {totalCount > 0 ? Math.round((warningCount / totalCount) * 100) : 0}% of total logs
          </p>
        </CardContent>
      </Card>
    </>
  )
}
