"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, AlertTriangle, Info, Clock, Bot, ExternalLink } from "lucide-react"
import { format } from "date-fns"

interface LogDetailProps {
  log: any
}

export function LogDetail({ log }: LogDetailProps) {
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
              <p className="text-muted-foreground">{format(new Date(log.timestamp), "MMMM d, yyyy 'at' h:mm:ss a")}</p>
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

      {log.context && (
        <Card className="md:col-span-2">
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
        <Card className="md:col-span-2">
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
    </div>
  )
}
