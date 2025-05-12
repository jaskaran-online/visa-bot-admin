"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, AlertCircle, Clock } from "lucide-react"
import { getBasicHealth } from "@/lib/api/health"

export function SystemStatus() {
  const [status, setStatus] = useState<"healthy" | "degraded" | "down" | "loading">("loading")
  const [lastChecked, setLastChecked] = useState<Date | null>(null)

  useEffect(() => {
    const checkSystemStatus = async () => {
      try {
        const health = await getBasicHealth()
        setStatus(health.status === "ok" ? "healthy" : "degraded")
      } catch (error) {
        console.error("Failed to check system status:", error)
        setStatus("down")
      } finally {
        setLastChecked(new Date())
      }
    }

    // Check status immediately
    checkSystemStatus()

    // Then check every 5 minutes
    const interval = setInterval(checkSystemStatus, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = () => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "degraded":
        return <Clock className="h-4 w-4 text-amber-500" />
      case "down":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "loading":
        return <Clock className="h-4 w-4 text-gray-500 animate-spin" />
    }
  }

  const getStatusText = () => {
    switch (status) {
      case "healthy":
        return "All systems operational"
      case "degraded":
        return "Some services degraded"
      case "down":
        return "System unavailable"
      case "loading":
        return "Checking status..."
    }
  }

  return (
    <Card className="mt-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className="text-sm font-medium">{getStatusText()}</span>
          </div>
          {lastChecked && (
            <span className="text-xs text-muted-foreground">
              {lastChecked.toLocaleTimeString()}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
