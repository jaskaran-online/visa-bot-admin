"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, Wifi, WifiOff, Loader2 } from "lucide-react";

interface LogEntry {
  id: string;
  message: string;
  timestamp: Date;
}

interface StreamingLogViewerProps {
  botId: string;
  apiKey: string;
  title?: string;
  maxEntries?: number;
}

const StreamingLogViewer = ({
  botId,
  apiKey,
  title = "Streaming Logs",
  maxEntries = 200,
}: StreamingLogViewerProps) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "disconnected" | "error">("disconnected");
  const logsEndRef = useRef<HTMLDivElement>(null); // Ref for the element at the end of the logs

  useEffect(() => {
    if (!botId || !apiKey) {
      setConnectionStatus("disconnected");
      setLogs([]);
      return;
    }

    setLogs([]);
    setConnectionStatus("connecting");

    const apiUrlBase = process.env.NEXT_PUBLIC_BOT_API_URL || "http://localhost:8000";
    const eventSourceUrl = `${apiUrlBase}/bots/${botId}/logs/stream?apiKey=${apiKey}`;

    let eventSource: EventSource;

    try {
      eventSource = new EventSource(eventSourceUrl);
    } catch (error) {
      console.error("Failed to create EventSource:", error);
      setConnectionStatus("error");
      return;
    }

    eventSource.onopen = () => {
      setConnectionStatus("connected");
    };

    eventSource.onmessage = (event) => {
      setLogs((prevLogs) => {
        const newLog: LogEntry = {
          id: `${Date.now()}-${Math.random()}`,
          message: event.data,
          timestamp: new Date(),
        };
        const updatedLogs = [...prevLogs, newLog];
        return updatedLogs.slice(-maxEntries);
      });
    };

    eventSource.onerror = (err) => {
      console.error("EventSource failed:", err);
      setConnectionStatus("error");
      eventSource.close();
    };

    return () => {
      if (eventSource) {
        eventSource.close();
      }
      setConnectionStatus("disconnected");
    };
  }, [botId, apiKey, maxEntries]);

  useEffect(() => {
    // Auto-scroll to the bottom
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const getStatusIndicator = () => {
    switch (connectionStatus) {
      case "connected":
        return <><Wifi className="h-4 w-4 mr-1 text-green-500" /> Connected</>;
      case "connecting":
        return <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Connecting...</>;
      case "disconnected":
        return <><WifiOff className="h-4 w-4 mr-1 text-gray-500" /> Disconnected</>;
      case "error":
        return <><AlertCircle className="h-4 w-4 mr-1 text-red-500" /> Error</>;
      default:
        return null;
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{title}</CardTitle>
          <Badge variant={
            connectionStatus === "connected" ? "success" :
            connectionStatus === "error" ? "destructive" :
            "secondary"
          } className="flex items-center whitespace-nowrap">
            {getStatusIndicator()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0">
        <ScrollArea className="h-full"> {/* Removed viewportRef */}
          <div className="p-4 space-y-2">
            {logs.length === 0 && (
              <p className="text-sm text-muted-foreground p-4">
                {connectionStatus === "connecting" && "Attempting to connect to log stream..."}
                {connectionStatus === "connected" && "Waiting for logs..."}
                {connectionStatus === "disconnected" && "Log stream disconnected. Ensure bot ID and API key are valid."}
                {connectionStatus === "error" && "Error connecting to log stream. Check console for details."}
              </p>
            )}
            {logs.map((log) => (
              <div key={log.id} className="text-xs font-mono flex">
                <span className="text-muted-foreground mr-2 whitespace-nowrap">
                  [{log.timestamp.toLocaleTimeString()}]
                </span>
                <span className="flex-1 whitespace-pre-wrap break-all">{log.message}</span>
              </div>
            ))}
            <div ref={logsEndRef} /> {/* Element to scroll to */}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export { StreamingLogViewer }; // Named export
