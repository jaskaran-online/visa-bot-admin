"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ThemeSettingsProps {
  isLoading: boolean
}

export function ThemeSettings({ isLoading }: ThemeSettingsProps) {
  const { theme, setTheme } = useTheme()
  const [fontSize, setFontSize] = useState(16)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const [sidebarCompact, setSidebarCompact] = useState(false)
  const [accentColor, setAccentColor] = useState("blue")
  const [borderRadius, setBorderRadius] = useState(8)

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
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
      <Tabs defaultValue="theme" className="space-y-4">
        <TabsList>
          <TabsTrigger value="theme">Theme</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
        </TabsList>

        <TabsContent value="theme" className="space-y-4">
          <div className="space-y-3">
            <Label className="font-medium">Theme Mode</Label>
            <RadioGroup
              value={theme || "system"}
              onValueChange={(value) => setTheme(value)}
              className="grid grid-cols-3 gap-4"
            >
              <div>
                <RadioGroupItem value="light" id="theme-light" className="sr-only" />
                <Label
                  htmlFor="theme-light"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                >
                  <div className="mb-2 rounded-md bg-white p-2 shadow-sm">
                    <div className="space-y-2">
                      <div className="h-2 w-[80px] rounded-lg bg-[#eaeaea]" />
                      <div className="h-2 w-[100px] rounded-lg bg-[#eaeaea]" />
                    </div>
                  </div>
                  <span className="block w-full text-center">Light</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="dark" id="theme-dark" className="sr-only" />
                <Label
                  htmlFor="theme-dark"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                >
                  <div className="mb-2 rounded-md bg-slate-950 p-2 shadow-sm">
                    <div className="space-y-2">
                      <div className="h-2 w-[80px] rounded-lg bg-slate-800" />
                      <div className="h-2 w-[100px] rounded-lg bg-slate-800" />
                    </div>
                  </div>
                  <span className="block w-full text-center">Dark</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="system" id="theme-system" className="sr-only" />
                <Label
                  htmlFor="theme-system"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                >
                  <div className="mb-2 rounded-md bg-gradient-to-r from-white to-slate-950 p-2 shadow-sm">
                    <div className="space-y-2">
                      <div className="h-2 w-[80px] rounded-lg bg-gradient-to-r from-[#eaeaea] to-slate-800" />
                      <div className="h-2 w-[100px] rounded-lg bg-gradient-to-r from-[#eaeaea] to-slate-800" />
                    </div>
                  </div>
                  <span className="block w-full text-center">System</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          <div className="space-y-3">
            <Label htmlFor="accent-color" className="font-medium">
              Accent Color
            </Label>
            <Select value={accentColor} onValueChange={setAccentColor}>
              <SelectTrigger id="accent-color">
                <SelectValue placeholder="Select accent color" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="blue">Blue</SelectItem>
                <SelectItem value="green">Green</SelectItem>
                <SelectItem value="violet">Violet</SelectItem>
                <SelectItem value="pink">Pink</SelectItem>
                <SelectItem value="orange">Orange</SelectItem>
                <SelectItem value="red">Red</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              The primary color used for buttons, links, and interactive elements.
            </p>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="border-radius" className="font-medium">
                Border Radius: {borderRadius}px
              </Label>
              <div className="w-1/2">
                <Slider
                  id="border-radius"
                  min={0}
                  max={16}
                  step={1}
                  value={[borderRadius]}
                  onValueChange={(value) => setBorderRadius(value[0])}
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Adjust the roundness of corners for UI elements.</p>
          </div>
        </TabsContent>

        <TabsContent value="layout" className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="sidebar-compact" className="font-medium">
                Compact Sidebar
              </Label>
              <Switch id="sidebar-compact" checked={sidebarCompact} onCheckedChange={setSidebarCompact} />
            </div>
            <p className="text-sm text-muted-foreground">Use a more compact sidebar layout to save screen space.</p>
          </div>

          <Separator />

          <div className="space-y-3">
            <Label htmlFor="layout-density" className="font-medium">
              Layout Density
            </Label>
            <Select defaultValue="comfortable">
              <SelectTrigger id="layout-density">
                <SelectValue placeholder="Select layout density" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="compact">Compact</SelectItem>
                <SelectItem value="comfortable">Comfortable</SelectItem>
                <SelectItem value="spacious">Spacious</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">Control the spacing and density of UI elements.</p>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="font-size" className="font-medium">
                Font Size: {fontSize}px
              </Label>
              <div className="w-1/2">
                <Slider
                  id="font-size"
                  min={12}
                  max={20}
                  step={1}
                  value={[fontSize]}
                  onValueChange={(value) => setFontSize(value[0])}
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Adjust the base font size for the entire application.</p>
          </div>
        </TabsContent>

        <TabsContent value="accessibility" className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="reduced-motion" className="font-medium">
                Reduced Motion
              </Label>
              <Switch id="reduced-motion" checked={reducedMotion} onCheckedChange={setReducedMotion} />
            </div>
            <p className="text-sm text-muted-foreground">
              Minimize animations and transitions for users who prefer reduced motion.
            </p>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="high-contrast" className="font-medium">
                High Contrast
              </Label>
              <Switch id="high-contrast" checked={highContrast} onCheckedChange={setHighContrast} />
            </div>
            <p className="text-sm text-muted-foreground">Increase contrast between elements for better visibility.</p>
          </div>

          <Separator />

          <div className="space-y-3">
            <Label htmlFor="font-family" className="font-medium">
              Font Family
            </Label>
            <Select defaultValue="system">
              <SelectTrigger id="font-family">
                <SelectValue placeholder="Select font family" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="system">System Default</SelectItem>
                <SelectItem value="sans">Sans-serif</SelectItem>
                <SelectItem value="serif">Serif</SelectItem>
                <SelectItem value="mono">Monospace</SelectItem>
                <SelectItem value="dyslexic">Dyslexic-friendly</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">Choose a font family that works best for you.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
