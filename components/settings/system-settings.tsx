"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface SystemSettingsProps {
  isLoading: boolean
}

export function SystemSettings({ isLoading }: SystemSettingsProps) {
  const [maxConcurrentBots, setMaxConcurrentBots] = useState(10)
  const [defaultTimeout, setDefaultTimeout] = useState(30)
  const [maxRetries, setMaxRetries] = useState(3)
  const [logRetentionDays, setLogRetentionDays] = useState(30)
  const [enableRateLimiting, setEnableRateLimiting] = useState(true)
  const [defaultBotMode, setDefaultBotMode] = useState("balanced")
  const [enableAutoRestart, setEnableAutoRestart] = useState(true)
  const [enableProxyRotation, setEnableProxyRotation] = useState(false)

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Admin Only</AlertTitle>
        <AlertDescription>
          These settings affect the entire system and all users. Changes will take effect immediately.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="behavior">Bot Behavior</TabsTrigger>
          <TabsTrigger value="data">Data Management</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="max-concurrent-bots" className="font-medium">
                Max Concurrent Bots: {maxConcurrentBots}
              </Label>
              <div className="w-1/2">
                <Slider
                  id="max-concurrent-bots"
                  min={1}
                  max={50}
                  step={1}
                  value={[maxConcurrentBots]}
                  onValueChange={(value) => setMaxConcurrentBots(value[0])}
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Maximum number of bots that can run simultaneously across the system.
            </p>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="default-timeout" className="font-medium">
                Default Timeout (seconds): {defaultTimeout}
              </Label>
              <div className="w-1/2">
                <Slider
                  id="default-timeout"
                  min={5}
                  max={120}
                  step={5}
                  value={[defaultTimeout]}
                  onValueChange={(value) => setDefaultTimeout(value[0])}
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Default timeout for bot operations in seconds.</p>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="enable-rate-limiting" className="font-medium">
                Enable Rate Limiting
              </Label>
              <Switch id="enable-rate-limiting" checked={enableRateLimiting} onCheckedChange={setEnableRateLimiting} />
            </div>
            <p className="text-sm text-muted-foreground">
              Automatically limit request rates to avoid being blocked by appointment systems.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="behavior" className="space-y-4">
          <div className="space-y-3">
            <Label htmlFor="default-bot-mode" className="font-medium">
              Default Bot Mode
            </Label>
            <Select value={defaultBotMode} onValueChange={setDefaultBotMode}>
              <SelectTrigger id="default-bot-mode">
                <SelectValue placeholder="Select default bot mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aggressive">Aggressive (Faster, higher chance of being blocked)</SelectItem>
                <SelectItem value="balanced">Balanced (Recommended)</SelectItem>
                <SelectItem value="stealth">Stealth (Slower, lower chance of being blocked)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">Default operating mode for new bots.</p>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="max-retries" className="font-medium">
                Max Retries: {maxRetries}
              </Label>
              <div className="w-1/2">
                <Slider
                  id="max-retries"
                  min={0}
                  max={10}
                  step={1}
                  value={[maxRetries]}
                  onValueChange={(value) => setMaxRetries(value[0])}
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Maximum number of retry attempts for failed operations.</p>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="enable-auto-restart" className="font-medium">
                Enable Auto-Restart
              </Label>
              <Switch id="enable-auto-restart" checked={enableAutoRestart} onCheckedChange={setEnableAutoRestart} />
            </div>
            <p className="text-sm text-muted-foreground">Automatically restart bots after errors or crashes.</p>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="enable-proxy-rotation" className="font-medium">
                Enable Proxy Rotation
              </Label>
              <Switch
                id="enable-proxy-rotation"
                checked={enableProxyRotation}
                onCheckedChange={setEnableProxyRotation}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Rotate through proxy servers to avoid IP-based rate limiting.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="log-retention-days" className="font-medium">
                Log Retention (days): {logRetentionDays}
              </Label>
              <div className="w-1/2">
                <Slider
                  id="log-retention-days"
                  min={1}
                  max={90}
                  step={1}
                  value={[logRetentionDays]}
                  onValueChange={(value) => setLogRetentionDays(value[0])}
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Number of days to retain system logs before automatic deletion.
            </p>
          </div>

          <Separator />

          <div className="space-y-3">
            <Label htmlFor="backup-schedule" className="font-medium">
              Backup Schedule
            </Label>
            <Select defaultValue="daily">
              <SelectTrigger id="backup-schedule">
                <SelectValue placeholder="Select backup schedule" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hourly">Hourly</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="never">Never</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">How often to automatically backup system data.</p>
          </div>

          <Separator />

          <div className="space-y-3">
            <Label htmlFor="backup-retention" className="font-medium">
              Backup Retention
            </Label>
            <Select defaultValue="30">
              <SelectTrigger id="backup-retention">
                <SelectValue placeholder="Select backup retention" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 days</SelectItem>
                <SelectItem value="30">30 days</SelectItem>
                <SelectItem value="90">90 days</SelectItem>
                <SelectItem value="365">1 year</SelectItem>
                <SelectItem value="unlimited">Unlimited</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">How long to keep backups before automatic deletion.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
