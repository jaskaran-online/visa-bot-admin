"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, AlertCircle, ServerCrash, Clock } from "lucide-react"

export function SystemStatus() {
  const [status, setStatus] = useState<"operational" | "degraded" | "outage" | "loading">("loading")
  const [lastChecked, setLastChecked] = useState<Date | null>(null)

  // Simulate fetching system status
  useEffect(() => {
    const fetchStatus = async () => {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      // Randomly select a status for demonstration
      const statuses = ["operational", "degraded", "outage"] as const
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]
      
      setStatus(randomStatus)
      setLastChecked(new Date())
    }
    
    fetchStatus()
    
    // Periodically check status
    const interval = setInterval(fetchStatus, 60000) // Every 60 seconds
    
    return () => clearInterval(interval)
  }, [])
  
  const getStatusIcon = () => {
    switch (status) {
      case "operational":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "degraded":
        return <AlertCircle className="h-4 w-4 text-amber-500" />
      case "outage":
        return <ServerCrash className="h-4 w-4 text-red-500" />
      case "loading":
      default:
        return <Clock className="h-4 w-4 text-muted-foreground animate-spin" />
    }
  }
  
  const getStatusText = () => {
    switch (status) {
      case "operational":
        return "All systems operational"
      case "degraded":
        return "Some services degraded"
      case "outage":
        return "Service outage detected"
      case "loading":
      default:
        return "Checking system status..."
    }
  }
  
  return (
    <Card className="bg-muted/50">
      <CardContent className="py-3">
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
