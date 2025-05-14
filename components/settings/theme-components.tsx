"use client"

import { useTheme, type Theme, type ColorScheme } from "@/lib/theme-provider"
import { Button } from "@/components/ui/button"
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Moon, Sun, Laptop, Check } from "lucide-react"

export function ThemeSelector() {
  const { theme, setTheme } = useTheme()
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Theme Mode</CardTitle>
        <CardDescription>Choose between light, dark, or system theme</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4">
          <Button
            variant={theme === "light" ? "default" : "outline"}
            className="flex flex-col items-center justify-between gap-1 h-auto p-4 relative"
            onClick={() => setTheme("light")}
          >
            <Sun className="h-6 w-6 mb-2" />
            <span>Light</span>
            {theme === "light" && <Check className="h-4 w-4 text-primary-foreground absolute top-2 right-2" />}
          </Button>
          
          <Button
            variant={theme === "dark" ? "default" : "outline"}
            className="flex flex-col items-center justify-between gap-1 h-auto p-4 relative"
            onClick={() => setTheme("dark")}
          >
            <Moon className="h-6 w-6 mb-2" />
            <span>Dark</span>
            {theme === "dark" && <Check className="h-4 w-4 text-primary-foreground absolute top-2 right-2" />}
          </Button>
          
          <Button
            variant={theme === "system" ? "default" : "outline"}
            className="flex flex-col items-center justify-between gap-1 h-auto p-4 relative"
            onClick={() => setTheme("system")}
          >
            <Laptop className="h-6 w-6 mb-2" />
            <span>System</span>
            {theme === "system" && <Check className="h-4 w-4 text-primary-foreground absolute top-2 right-2" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function ColorSchemeSelector() {
  const { colorScheme, setColorScheme } = useTheme()
  
  const colorSchemes: { value: ColorScheme; label: string; color: string }[] = [
    { value: "blue", label: "Blue", color: "bg-blue-500" },
    { value: "green", label: "Green", color: "bg-green-500" },
    { value: "purple", label: "Purple", color: "bg-purple-500" },
    { value: "orange", label: "Orange", color: "bg-orange-500" },
    { value: "red", label: "Red", color: "bg-red-500" },
    { value: "slate", label: "Slate", color: "bg-slate-500" },
  ]
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Color Scheme</CardTitle>
        <CardDescription>Choose a color scheme for the interface</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup 
          value={colorScheme} 
          onValueChange={(value) => setColorScheme(value as ColorScheme)}
          className="grid grid-cols-2 md:grid-cols-3 gap-4"
        >
          {colorSchemes.map((scheme) => (
            <div key={scheme.value} className="relative">
              <RadioGroupItem
                value={scheme.value}
                id={`color-scheme-${scheme.value}`}
                className="peer sr-only"
              />
              <Label
                htmlFor={`color-scheme-${scheme.value}`}
                className="flex flex-col items-center justify-between gap-2 rounded-md border-2 border-muted bg-transparent p-4 hover:bg-muted/50 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <div className={`${scheme.color} h-10 w-full rounded-md`} />
                <div className="font-medium text-center">{scheme.label}</div>
              </Label>
              {colorScheme === scheme.value && (
                <Check className="h-4 w-4 text-primary absolute top-2 right-2" />
              )}
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  )
}
