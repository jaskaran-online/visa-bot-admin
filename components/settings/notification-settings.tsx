"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"

interface NotificationSettingsProps {
  isLoading: boolean
}

export function NotificationSettings({ isLoading }: NotificationSettingsProps) {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [appointmentAlerts, setAppointmentAlerts] = useState(true)
  const [botStatusAlerts, setBotStatusAlerts] = useState(true)
  const [systemAlerts, setSystemAlerts] = useState(true)
  const [digestFrequency, setDigestFrequency] = useState("daily")

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(5)].map((_, i) => (
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
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="email-notifications" className="font-medium">
            Email Notifications
          </Label>
          <Switch id="email-notifications" checked={emailNotifications} onCheckedChange={setEmailNotifications} />
        </div>
        <p className="text-sm text-muted-foreground">Receive email notifications for important events and updates.</p>
      </div>

      <Separator />

      <div className="space-y-3">
        <h3 className="font-medium">Notification Types</h3>
        <p className="text-sm text-muted-foreground">Select which types of notifications you want to receive.</p>

        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="appointment-alerts" className="font-medium">
                Appointment Alerts
              </Label>
              <p className="text-sm text-muted-foreground">Notifications when bots find new appointment slots.</p>
            </div>
            <Switch
              id="appointment-alerts"
              checked={appointmentAlerts}
              onCheckedChange={setAppointmentAlerts}
              disabled={!emailNotifications}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="bot-status-alerts" className="font-medium">
                Bot Status Alerts
              </Label>
              <p className="text-sm text-muted-foreground">
                Notifications about bot status changes (started, stopped, errors).
              </p>
            </div>
            <Switch
              id="bot-status-alerts"
              checked={botStatusAlerts}
              onCheckedChange={setBotStatusAlerts}
              disabled={!emailNotifications}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="system-alerts" className="font-medium">
                System Alerts
              </Label>
              <p className="text-sm text-muted-foreground">Important system notifications and maintenance updates.</p>
            </div>
            <Switch
              id="system-alerts"
              checked={systemAlerts}
              onCheckedChange={setSystemAlerts}
              disabled={!emailNotifications}
            />
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-3">
        <h3 className="font-medium">Digest Frequency</h3>
        <p className="text-sm text-muted-foreground">How often would you like to receive summary digest emails?</p>

        <RadioGroup value={digestFrequency} onValueChange={setDigestFrequency} disabled={!emailNotifications}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="realtime" id="realtime" />
            <Label htmlFor="realtime">Real-time (as events occur)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="daily" id="daily" />
            <Label htmlFor="daily">Daily digest</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="weekly" id="weekly" />
            <Label htmlFor="weekly">Weekly digest</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="never" id="never" />
            <Label htmlFor="never">Never (only critical alerts)</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  )
}
