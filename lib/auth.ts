// This is a simplified auth utility for demo purposes
// In a real application, you would use a proper auth library like NextAuth.js

export type User = {
  id: string
  name: string
  email: string
  role: "admin" | "viewer"
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") {
    return null
  }

  const userJson = localStorage.getItem("user")
  if (!userJson) {
    console.log("No user found in localStorage")
    return null
  }

  try {
    const user = JSON.parse(userJson) as User
    console.log("Current user role:", user.role)
    return user
  } catch (error) {
    console.error("Failed to parse user from localStorage", error)
    return null
  }
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") {
    return false
  }

  return !!localStorage.getItem("token")
}

export function hasPermission(requiredRole: "admin" | "viewer" | "any"): boolean {
  if (typeof window === "undefined") {
    return false
  }

  const user = getCurrentUser()

  if (!user) {
    return false
  }

  if (requiredRole === "any") {
    return true
  }

  if (requiredRole === "admin") {
    // Make sure we're correctly checking the role
    return user.role === "admin"
  }

  return true // Viewers can access viewer-level content
}

export function logout(): void {
  if (typeof window === "undefined") {
    return
  }

  localStorage.removeItem("user")
  localStorage.removeItem("token")
}
