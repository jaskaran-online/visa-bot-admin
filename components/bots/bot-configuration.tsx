import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"
import { apiClient, type BotResponse } from "@/lib/api-client"

interface BotConfigurationProps {
  bot: BotResponse
  isAdmin: boolean
}

export function BotConfiguration({ bot, isAdmin }: BotConfigurationProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Bot Configuration</CardTitle>
            <CardDescription>Current configuration settings for this bot</CardDescription>
          </div>
          {isAdmin && (
            <Button variant="outline" size="sm">
              <Pencil className="mr-2 h-4 w-4" />
              Edit Configuration
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Basic Information</h3>
              <div className="mt-3 border rounded-md divide-y">
                <div className="flex justify-between p-3">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium">{bot.config.EMAIL}</span>
                </div>
                <div className="flex justify-between p-3">
                  <span className="text-muted-foreground">Password</span>
                  <span className="font-medium">••••••••</span>
                </div>
                <div className="flex justify-between p-3">
                  <span className="text-muted-foreground">Country</span>
                  <span className="font-medium">{apiClient.getCountryName(bot.config.COUNTRY)}</span>
                </div>
                {bot.config.FACILITY_ID && (
                  <div className="flex justify-between p-3">
                    <span className="text-muted-foreground">Facility</span>
                    <span className="font-medium">{apiClient.getFacilityName(bot.config.FACILITY_ID)}</span>
                  </div>
                )}
                <div className="flex justify-between p-3">
                  <span className="text-muted-foreground">Start Time</span>
                  <span className="font-medium">{new Date(bot.start_time).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Advanced Settings</h3>
              <div className="mt-3 border rounded-md divide-y">
                {bot.config.ASC_FACILITY_ID && (
                  <div className="flex justify-between p-3">
                    <span className="text-muted-foreground">ASC Facility</span>
                    <span className="font-medium">{apiClient.getASCFacilityName(bot.config.ASC_FACILITY_ID)}</span>
                  </div>
                )}
                {bot.config.SCHEDULE_ID && (
                  <div className="flex justify-between p-3">
                    <span className="text-muted-foreground">Schedule ID</span>
                    <span className="font-medium">{bot.config.SCHEDULE_ID}</span>
                  </div>
                )}
                <div className="flex justify-between p-3">
                  <span className="text-muted-foreground">Earliest Date</span>
                  <span className="font-medium">{bot.config.MIN_DATE || "Not specified"}</span>
                </div>
                <div className="flex justify-between p-3">
                  <span className="text-muted-foreground">Latest Date</span>
                  <span className="font-medium">{bot.config.MAX_DATE || "Not specified"}</span>
                </div>
                <div className="flex justify-between p-3">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-medium capitalize">{bot.status}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium">Logs Summary</h3>
              <div className="mt-3 border rounded-md divide-y">
                <div className="flex justify-between p-3">
                  <span className="text-muted-foreground">Total Logs</span>
                  <span className="font-medium">{bot.logs.length}</span>
                </div>
                <div className="flex justify-between p-3">
                  <span className="text-muted-foreground">Last Log</span>
                  <span className="font-medium">
                    {bot.logs.length > 0 ? new Date(bot.logs[0].timestamp).toLocaleString() : "No logs available"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
