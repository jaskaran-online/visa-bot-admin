"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { Play, Square, RefreshCw, MoreVertical, ExternalLink, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { BotResponse, BotStatus } from "@/lib/api-client"

interface BotCardProps {
  bot: BotResponse
  countryName: string
  facilityName: string
  isAdmin: boolean
  onAction: (action: string) => void
  onDelete: () => void
  onViewDetails: () => void
}

export function BotCard({ bot, countryName, facilityName, isAdmin, onAction, onDelete, onViewDetails }: BotCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const getBadgeVariant = (status: BotStatus) => {
    switch (status) {
      case "running":
        return "success"
      case "stopped":
        return "secondary"
      case "error":
        return "destructive"
      case "completed":
        return "outline"
      default:
        return "outline"
    }
  }

  const getStatusIcon = (status: BotStatus) => {
    switch (status) {
      case "running":
        return <div className="h-2 w-2 rounded-full bg-green-500 mr-1.5" />
      case "stopped":
        return <div className="h-2 w-2 rounded-full bg-gray-400 mr-1.5" />
      case "error":
        return <AlertCircle className="h-3 w-3 text-destructive mr-1.5" />
      case "completed":
        return <div className="h-2 w-2 rounded-full bg-blue-500 mr-1.5" />
      default:
        return null
    }
  }

  const createdTimeAgo = formatDistanceToNow(new Date(bot.start_time), { addSuffix: true })

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">{bot.config.EMAIL}</CardTitle>
          <Badge variant={getBadgeVariant(bot.status) as any} className="flex items-center">
            {getStatusIcon(bot.status)}
            {bot.status.charAt(0).toUpperCase() + bot.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Country:</span>
            <span className="font-medium">{countryName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Facility:</span>
            <span className="font-medium">{facilityName}</span>
          </div>
          {bot.config.MIN_DATE && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Earliest Date:</span>
              <span className="font-medium">{bot.config.MIN_DATE}</span>
            </div>
          )}
          {bot.config.MAX_DATE && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Latest Date:</span>
              <span className="font-medium">{bot.config.MAX_DATE}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Created:</span>
            <span className="font-medium">{createdTimeAgo}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <div className="flex w-full items-center justify-between">
          <Button variant="outline" size="sm" onClick={onViewDetails}>
            <ExternalLink className="mr-2 h-4 w-4" />
            Details
          </Button>

          {isAdmin && (
            <div className="flex items-center gap-2">
              {bot.status === "stopped" && (
                <Button variant="outline" size="icon" onClick={() => onAction("start")}>
                  <Play className="h-4 w-4" />
                  <span className="sr-only">Start</span>
                </Button>
              )}

              {bot.status === "running" && (
                <Button variant="outline" size="icon" onClick={() => onAction("stop")}>
                  <Square className="h-4 w-4" />
                  <span className="sr-only">Stop</span>
                </Button>
              )}

              <Button variant="outline" size="icon" onClick={() => onAction("restart")}>
                <RefreshCw className="h-4 w-4" />
                <span className="sr-only">Restart</span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">More options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onViewDetails}>View Details</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onAction("start")}>Start</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onAction("stop")}>Stop</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onAction("restart")}>Restart</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => setIsDeleteDialogOpen(true)}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete the bot for {bot.config.EMAIL} and all of its data. This action
                      cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        onDelete()
                        setIsDeleteDialogOpen(false)
                      }}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
