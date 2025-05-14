"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

// Define the available themes
export type Theme = "light" | "dark" | "system"
export type ColorScheme = "blue" | "green" | "purple" | "orange" | "red" | "slate"

type ThemeProviderProps = {
  children: React.ReactNode
}

type ThemeContextType = {
  theme: Theme
  colorScheme: ColorScheme
  setTheme: (theme: Theme) => void
  setColorScheme: (colorScheme: ColorScheme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>("system")
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>("blue")

  // Initialize theme from localStorage
  useEffect(() => {
    const storedTheme = localStorage.getItem("ui-theme") as Theme | null
    const storedColorScheme = localStorage.getItem("ui-color-scheme") as ColorScheme | null
    
    if (storedTheme) {
      setThemeState(storedTheme)
    }
    
    if (storedColorScheme) {
      setColorSchemeState(storedColorScheme)
      document.documentElement.setAttribute("data-color-scheme", storedColorScheme)
    }
  }, [])

  // Handle system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    
    const handleChange = () => {
      if (theme === "system") {
        if (mediaQuery.matches) {
          document.documentElement.classList.add("dark")
        } else {
          document.documentElement.classList.remove("dark")
        }
      }
    }
    
    handleChange() // Initial check
    mediaQuery.addEventListener("change", handleChange)
    
    return () => {
      mediaQuery.removeEventListener("change", handleChange)
    }
  }, [theme])

  // Apply theme class to <html> element
  useEffect(() => {
    const root = document.documentElement
    
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      
      if (systemTheme === "dark") {
        root.classList.add("dark")
      } else {
        root.classList.remove("dark")
      }
    } else if (theme === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
  }, [theme])

  // Set theme with localStorage persistence
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem("ui-theme", newTheme)
  }

  // Set color scheme with localStorage persistence
  const setColorScheme = (newColorScheme: ColorScheme) => {
    setColorSchemeState(newColorScheme)
    document.documentElement.setAttribute("data-color-scheme", newColorScheme)
    localStorage.setItem("ui-color-scheme", newColorScheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, colorScheme, setTheme, setColorScheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// Custom hook for using the theme context
export function useTheme() {
  const context = useContext(ThemeContext)
  
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  
  return context
}
