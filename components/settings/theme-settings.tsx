"use client"

import { ThemeSelector, ColorSchemeSelector } from "@/components/settings/theme-components"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"

interface ThemeSettingsProps {
  isLoading: boolean
}

export function ThemeSettings({ isLoading }: ThemeSettingsProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">UI Preferences</h2>
        <p className="text-muted-foreground">
          Customize the appearance of the application to your preferences.
        </p>
        
        <div className="grid gap-6">
          <ThemeSelector />
          <ColorSchemeSelector />
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">Interface Options</h2>
        <p className="text-muted-foreground">
          Adjust additional interface settings to customize your experience.
        </p>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="compact-view">Compact View</Label>
              <p className="text-sm text-muted-foreground">
                Display more information in a smaller space
              </p>
            </div>
            <Switch id="compact-view" />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="animations">Interface Animations</Label>
              <p className="text-sm text-muted-foreground">
                Enable smooth transitions and animations
              </p>
            </div>
            <Switch id="animations" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="large-text">Large Text</Label>
              <p className="text-sm text-muted-foreground">
                Increase text size for better readability
              </p>
            </div>
            <Switch id="large-text" />
          </div>
        </div>
      </div>
    </div>
  )
}
