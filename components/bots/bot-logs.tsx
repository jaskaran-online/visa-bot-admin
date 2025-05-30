"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Clock } from "lucide-react"
import { PollingLogViewer } from "@/components/logs/polling-log-viewer";
import { StreamingLogViewer } from "@/components/logs/StreamingLogViewer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"

interface BotLogsProps {
  botId: string;
  isAdmin: boolean;
  apiKey: string; // Added for StreamingLogViewer
}

export function BotLogs({ botId, isAdmin, apiKey }: BotLogsProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all");
  const [pollInterval, setPollInterval] = useState(30);  // seconds
  const [logViewMode, setLogViewMode] = useState<'polling' | 'streaming'>('polling');

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="bg-background flex flex-col gap-2">
            <CardTitle>Bot Logs</CardTitle>
            <CardDescription>View bot activity logs via polling or real-time streaming.</CardDescription>
          </div>
          <Tabs value={logViewMode} onValueChange={(value) => setLogViewMode(value as 'polling' | 'streaming')} className="w-full sm:w-auto">
            <TabsList>
              <TabsTrigger value="polling">Polling</TabsTrigger>
              <TabsTrigger value="streaming">Streaming</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mt-4">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search logs..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {logViewMode === 'polling' && (
            <div className="flex items-center gap-2 w-full sm:w-auto min-w-[220px]">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div className="space-y-0.5 flex-grow">
                <div className="flex items-center justify-between">
                  <Label htmlFor="refresh-interval" className="text-xs">Refresh: {pollInterval}s</Label>
                </div>
                <Slider
                  id="refresh-interval"
                  min={5}
                  max={60}
                  step={5}
                  value={[pollInterval]}
                  onValueChange={(values) => setPollInterval(values[0])}
                  className="w-full"
                />
              </div>
            </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          {logViewMode === 'polling' && (
          <PollingLogViewer
            title="Bot Activity Logs"
            description="Logs for this bot"
            botId={botId}
            maxEntries={100}
            pollInterval={pollInterval * 1000} // Convert seconds to milliseconds
            canClear={isAdmin}
            canExport={true}
            typeFilter={typeFilter}
            searchQuery={searchQuery}
          />
          )}
          {logViewMode === 'streaming' && (
            <StreamingLogViewer
              botId={botId}
              apiKey={apiKey}
              title="Real-time Bot Activity"
              maxEntries={200}
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}
