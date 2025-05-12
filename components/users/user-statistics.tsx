"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Users, ShieldCheck, Clock } from "lucide-react"
import { format } from "date-fns"

interface UserStatisticsProps {
  users: any[]
  isLoading: boolean
}

export function UserStatistics({ users, isLoading }: UserStatisticsProps) {
  if (isLoading) {
    return (
      <>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <Skeleton className="h-4 w-24" />
            </CardTitle>
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 mb-1" />
            <Skeleton className="h-4 w-32" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <Skeleton className="h-4 w-24" />
            </CardTitle>
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 mb-1" />
            <Skeleton className="h-4 w-32" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <Skeleton className="h-4 w-24" />
            </CardTitle>
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 mb-1" />
            <Skeleton className="h-4 w-32" />
          </CardContent>
        </Card>
      </>
    )
  }

  // Count users by role
  const adminCount = users.filter((user) => user.role === "admin").length
  const viewerCount = users.filter((user) => user.role === "viewer").length
  const totalCount = users.length

  // Get most recent login
  const sortedUsers = [...users].sort((a, b) => {
    if (!a.lastLogin) return 1
    if (!b.lastLogin) return -1
    return new Date(b.lastLogin).getTime() - new Date(a.lastLogin).getTime()
  })
  const mostRecentLogin = sortedUsers[0]?.lastLogin
    ? format(new Date(sortedUsers[0].lastLogin), "MMM d, yyyy 'at' h:mm a")
    : "No recent logins"

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCount}</div>
          <p className="text-xs text-muted-foreground">
            {adminCount} admins, {viewerCount} viewers
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Admin Users</CardTitle>
          <ShieldCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{adminCount}</div>
          <p className="text-xs text-muted-foreground">
            {((adminCount / totalCount) * 100).toFixed(0)}% of total users
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Last Login</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{sortedUsers[0]?.name || "N/A"}</div>
          <p className="text-xs text-muted-foreground">{mostRecentLogin}</p>
        </CardContent>
      </Card>
    </>
  )
}
