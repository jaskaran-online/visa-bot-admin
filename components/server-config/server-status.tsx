"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Server, CheckCircle, XCircle, RefreshCw } from "lucide-react"

interface ServerStatusProps {
  activeServer: any
  isLoading: boolean
}

export function ServerStatus({ activeServer, isLoading }: ServerStatusProps) {
  const [status, setStatus] = useState<"online" | "offline" | "checking">("checking")
  const [lastChecked, setLastChecked] = useState<Date | null>(null)
  const [isChecking, setIsChecking] = useState(false)

  useEffect(() => {
    if (activeServer) {
      checkServerStatus()
    }
  }, [activeServer])

  const checkServerStatus = async () => {
    if (!activeServer) {
      setStatus("offline")
      return
    }

    setIsChecking(true)
    setStatus("checking")

    try {
      // Simulate API check with a timeout
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, you would make an actual API call to check the server status
      // For demo purposes, we'll randomly determine if the server is online
      const isOnline = Math.random() > 0.2 // 80% chance of being online

      setStatus(isOnline ? "online" : "offline")
      setLastChecked(new Date())
    } catch (error) {
      setStatus("offline")
    } finally {
      setIsChecking(false)
    }
  }

  if (isLoading) {
    return (
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
    )
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Server</CardTitle>
          <Server className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeServer ? activeServer.name : "None"}</div>
          <p className="text-xs text-muted-foreground">
            {activeServer ? <span className="font-mono">{activeServer.baseUrl}</span> : "No server configured"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Server Status</CardTitle>
          {status === "online" ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : status === "offline" ? (
            <XCircle className="h-4 w-4 text-destructive" />
          ) : (
            <RefreshCw className="h-4 w-4 text-muted-foreground animate-spin" />
          )}
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold capitalize">{status === "checking" ? "Checking..." : status}</div>
            {status !== "checking" && (
              <Badge
                variant={status === "online" ? "success" : "destructive"}
                className={status === "online" ? "bg-green-500" : undefined}
              >
                {status === "online" ? "Online" : "Offline"}
              </Badge>
            )}
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-muted-foreground">
              {lastChecked ? `Last checked: ${lastChecked.toLocaleTimeString()}` : "Not checked yet"}
            </p>
            <Button variant="ghost" size="sm" onClick={checkServerStatus} disabled={isChecking || !activeServer}>
              <RefreshCw className={`h-3 w-3 ${isChecking ? "animate-spin" : ""}`} />
              <span className="sr-only">Check Status</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Configuration</CardTitle>
          <Server className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeServer ? "1" : "0"} Active</div>
          <p className="text-xs text-muted-foreground">
            {activeServer ? "Server configured and active" : "No active server"}
          </p>
        </CardContent>
      </Card>
    </>
  )
}
