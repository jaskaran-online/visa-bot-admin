"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, KeyRound, Shield, Smartphone } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface SecuritySettingsProps {
  isLoading: boolean
}

export function SecuritySettings({ isLoading }: SecuritySettingsProps) {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [sessionTimeout, setSessionTimeout] = useState("30")
  const [loginNotifications, setLoginNotifications] = useState(true)

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
        <h3 className="font-medium flex items-center gap-2">
          <KeyRound className="h-4 w-4" />
          Change Password
        </h3>
        <p className="text-sm text-muted-foreground">Update your password to keep your account secure.</p>

        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <Button type="button" disabled={!currentPassword || !newPassword || !confirmPassword}>
            Update Password
          </Button>
        </div>
      </div>

      <Separator />

      <div className="space-y-3">
        <h3 className="font-medium flex items-center gap-2">
          <Smartphone className="h-4 w-4" />
          Two-Factor Authentication
        </h3>
        <p className="text-sm text-muted-foreground">
          Add an extra layer of security to your account by enabling two-factor authentication.
        </p>

        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="two-factor-auth">Enable Two-Factor Authentication</Label>
            <Switch id="two-factor-auth" checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
          </div>

          {twoFactorEnabled && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Setup Required</AlertTitle>
              <AlertDescription>
                You need to set up an authenticator app to enable two-factor authentication. Click the button below to
                start the setup process.
              </AlertDescription>
              <Button className="mt-2" variant="outline" size="sm">
                Set Up Two-Factor Authentication
              </Button>
            </Alert>
          )}
        </div>
      </div>

      <Separator />

      <div className="space-y-3">
        <h3 className="font-medium flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Security Preferences
        </h3>
        <p className="text-sm text-muted-foreground">Configure additional security settings for your account.</p>

        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="session-timeout">Session Timeout</Label>
            <Select value={sessionTimeout} onValueChange={setSessionTimeout}>
              <SelectTrigger id="session-timeout">
                <SelectValue placeholder="Select session timeout" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="120">2 hours</SelectItem>
                <SelectItem value="240">4 hours</SelectItem>
                <SelectItem value="480">8 hours</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">Automatically log out after a period of inactivity.</p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="login-notifications" className="font-medium">
                Login Notifications
              </Label>
              <p className="text-sm text-muted-foreground">Receive email notifications for new login attempts.</p>
            </div>
            <Switch id="login-notifications" checked={loginNotifications} onCheckedChange={setLoginNotifications} />
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-3">
        <h3 className="font-medium text-destructive">Danger Zone</h3>
        <p className="text-sm text-muted-foreground">Permanently delete your account and all associated data.</p>

        <Button variant="destructive">Delete Account</Button>
      </div>
    </div>
  )
}
