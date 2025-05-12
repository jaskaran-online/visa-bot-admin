"use client"

import { useEffect, useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bot, Calendar, CheckCircle, Clock, Server, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

export default function DashboardPage() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null // Prevent hydration errors
  }

  return (
    <MainLayout>
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the USA VISA Appointment Bot System dashboard.</p>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bots</CardTitle>
              <Bot className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">8 active, 4 inactive</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Appointments Found</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">+8 from last week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">78%</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Server Status</CardTitle>
              <Server className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Healthy</div>
              <p className="text-xs text-muted-foreground">All systems operational</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Bot Activity</CardTitle>
                  <CardDescription>Bot activity over the last 30 days</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="h-[200px] flex items-center justify-center">
                    <p className="text-muted-foreground">Activity chart will be displayed here</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Recent Appointments</CardTitle>
                  <CardDescription>Latest appointments found by bots</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="mr-2 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">London Embassy</p>
                        <p className="text-xs text-muted-foreground">May 15, 2025 • 10:30 AM</p>
                      </div>
                      <div className="ml-auto font-medium">New</div>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-2 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">Berlin Consulate</p>
                        <p className="text-xs text-muted-foreground">May 12, 2025 • 2:15 PM</p>
                      </div>
                      <div className="ml-auto font-medium">New</div>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-2 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">Paris Embassy</p>
                        <p className="text-xs text-muted-foreground">May 10, 2025 • 9:00 AM</p>
                      </div>
                      <div className="ml-auto font-medium">Confirmed</div>
                    </div>
                    <Button variant="outline" className="w-full">
                      View all
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>System Resources</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div>CPU Usage</div>
                      <div>45%</div>
                    </div>
                    <Progress value={45} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div>Memory Usage</div>
                      <div>32%</div>
                    </div>
                    <Progress value={32} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div>Disk Usage</div>
                      <div>78%</div>
                    </div>
                    <Progress value={78} />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Bot Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-sm font-medium">Active Bots</p>
                        <p className="text-xs text-muted-foreground">8 bots running</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900">
                        <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-sm font-medium">Idle Bots</p>
                        <p className="text-xs text-muted-foreground">2 bots idle</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
                        <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-sm font-medium">Failed Bots</p>
                        <p className="text-xs text-muted-foreground">2 bots with errors</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full justify-start" variant="outline">
                    <Bot className="mr-2 h-4 w-4" />
                    Create New Bot
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Server className="mr-2 h-4 w-4" />
                    Configure Server
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Calendar className="mr-2 h-4 w-4" />
                    View Appointments
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
                <CardDescription>Detailed analytics will be displayed here</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] flex items-center justify-center">
                <p className="text-muted-foreground">Analytics content will be implemented in this module</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Reports</CardTitle>
                <CardDescription>Generated reports will be displayed here</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] flex items-center justify-center">
                <p className="text-muted-foreground">Reports content will be implemented in this module</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
