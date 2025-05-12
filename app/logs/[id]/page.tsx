"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api-client"
import { ArrowLeft, Bot, Clock, AlertCircle, Info, AlertTriangle, ExternalLink } from "lucide-react"
import { format } from "date-fns"

export default function LogDetailPage({ params }: { params: { id: string } }) {
  const [log, setLog] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchLog = async () => {
      try {
        const data = await apiClient.getLogById(params.id)
        setLog(data)
      } catch (error) {
        toast({
          title: "Error fetching log details",
          description: error instanceof Error ? error.message : "Failed to load log details. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchLog()
  }, [params.id, toast])

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "error":
        return <AlertCircle className="h-5 w-5 text-destructive" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "info":
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  const getLevelBadge = (level: string) => {
    switch (level) {
      case "error":
        return <Badge variant="destructive">Error</Badge>
      case "warning":
        return <Badge className="bg-yellow-500">Warning</Badge>
      case "info":
      default:
        return <Badge variant="secondary">Info</Badge>
    }
  }

  return (
    <MainLayout>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.push("/logs")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Log Details</h1>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-64" />
          </div>
        ) : log ? (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-semibold">Log Entry #{log.id}</h2>
                {getLevelBadge(log.level)}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Log Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center">
                    <Clock className="mr-3 h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Timestamp</p>
                      <p className="text-muted-foreground">
                        {format(new Date(log.timestamp), "MMMM d, yyyy 'at' h:mm:ss a")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Bot className="mr-3 h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Bot</p>
                      <p className="text-muted-foreground">{log.botName || "System"}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    {getLevelIcon(log.level)}
                    <div className="ml-3">
                      <p className="font-medium">Level</p>
                      <p className="text-muted-foreground capitalize">{log.level}</p>
                    </div>
                  </div>

                  {log.source && (
                    <div className="flex items-center">
                      <ExternalLink className="mr-3 h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Source</p>
                        <p className="text-muted-foreground">{log.source}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md bg-muted p-4 whitespace-pre-wrap font-mono text-sm">{log.message}</div>
                </CardContent>
              </Card>
            </div>

            {log.context && (
              <Card>
                <CardHeader>
                  <CardTitle>Context Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="rounded-md bg-muted p-4 overflow-auto max-h-96 text-sm">
                    {JSON.stringify(log.context, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            )}

            {log.stackTrace && (
              <Card>
                <CardHeader>
                  <CardTitle>Stack Trace</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="rounded-md bg-muted p-4 overflow-auto max-h-96 text-sm font-mono text-destructive">
                    {log.stackTrace}
                  </pre>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold">Log entry not found</h2>
            <p className="text-muted-foreground mt-2">
              The log entry you are looking for does not exist or has been deleted
            </p>
            <Button className="mt-4" onClick={() => router.push("/logs")}>
              Back to Logs
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
