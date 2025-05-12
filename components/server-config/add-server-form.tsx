"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface AddServerFormProps {
  onAddServer: (server: { name: string; baseUrl: string }) => void
}

export function AddServerForm({ onAddServer }: AddServerFormProps) {
  const [name, setName] = useState("")
  const [baseUrl, setBaseUrl] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Basic validation
    if (!name.trim()) {
      setError("Server name is required")
      return
    }

    if (!baseUrl.trim()) {
      setError("Base URL is required")
      return
    }

    // Simple URL validation
    try {
      new URL(baseUrl)
    } catch (err) {
      setError("Please enter a valid URL (e.g., https://api.example.com)")
      return
    }

    setIsSubmitting(true)

    try {
      onAddServer({ name, baseUrl })
      // Reset form
      setName("")
      setBaseUrl("")
    } catch (err) {
      setError("Failed to add server. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="server-name">Server Name</Label>
        <Input
          id="server-name"
          placeholder="Production API"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isSubmitting}
        />
        <p className="text-sm text-muted-foreground">A descriptive name for this server</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="base-url">Base URL</Label>
        <Input
          id="base-url"
          placeholder="https://api.example.com"
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
          disabled={isSubmitting}
        />
        <p className="text-sm text-muted-foreground">The base URL for API requests (e.g., https://api.example.com)</p>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Adding Server..." : "Add Server"}
      </Button>
    </form>
  )
}
