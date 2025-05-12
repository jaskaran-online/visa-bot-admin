"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface AddUserFormProps {
  onAddUser: (user: { name: string; email: string; role: string; password: string }) => void
}

export function AddUserForm({ onAddUser }: AddUserFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("viewer")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Basic validation
    if (!name.trim()) {
      setError("Name is required")
      return
    }

    if (!email.trim()) {
      setError("Email is required")
      return
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address")
      return
    }

    if (!password) {
      setError("Password is required")
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setIsSubmitting(true)

    try {
      onAddUser({ name, email, role, password })
      // Reset form
      setName("")
      setEmail("")
      setRole("viewer")
      setPassword("")
      setConfirmPassword("")
    } catch (err) {
      setError("Failed to add user. Please try again.")
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
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="john@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Select value={role} onValueChange={setRole} disabled={isSubmitting}>
          <SelectTrigger id="role">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="viewer">Viewer</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">
          Admins can manage all aspects of the system. Viewers have read-only access.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isSubmitting}
        />
        <p className="text-sm text-muted-foreground">Password must be at least 8 characters long.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirm Password</Label>
        <Input
          id="confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isSubmitting}
        />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Adding User..." : "Add User"}
      </Button>
    </form>
  )
}
