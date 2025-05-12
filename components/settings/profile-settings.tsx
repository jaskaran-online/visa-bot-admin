"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Upload } from "lucide-react"

interface ProfileSettingsProps {
  user: any
  isLoading: boolean
}

export function ProfileSettings({ user, isLoading }: ProfileSettingsProps) {
  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [bio, setBio] = useState(user?.bio || "")
  const [timezone, setTimezone] = useState(user?.timezone || "UTC")
  const [language, setLanguage] = useState(user?.language || "en")

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage
            src={`/generic-avatar.png?height=64&width=64&query=avatar for ${user?.name}`}
            alt={user?.name || "User"}
          />
          <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <h3 className="font-medium">{user?.name || "User"}</h3>
          <p className="text-sm text-muted-foreground">{user?.email || "user@example.com"}</p>
          <Button size="sm" variant="outline" className="mt-2">
            <Upload className="mr-2 h-4 w-4" />
            Change Avatar
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          placeholder="Tell us a little about yourself"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
        />
        <p className="text-sm text-muted-foreground">This will be displayed on your profile.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="timezone">Timezone</Label>
          <Select value={timezone} onValueChange={setTimezone}>
            <SelectTrigger id="timezone">
              <SelectValue placeholder="Select timezone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="UTC">UTC (Coordinated Universal Time)</SelectItem>
              <SelectItem value="EST">EST (Eastern Standard Time)</SelectItem>
              <SelectItem value="CST">CST (Central Standard Time)</SelectItem>
              <SelectItem value="MST">MST (Mountain Standard Time)</SelectItem>
              <SelectItem value="PST">PST (Pacific Standard Time)</SelectItem>
              <SelectItem value="GMT">GMT (Greenwich Mean Time)</SelectItem>
              <SelectItem value="CET">CET (Central European Time)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger id="language">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
              <SelectItem value="fr">French</SelectItem>
              <SelectItem value="de">German</SelectItem>
              <SelectItem value="it">Italian</SelectItem>
              <SelectItem value="pt">Portuguese</SelectItem>
              <SelectItem value="ru">Russian</SelectItem>
              <SelectItem value="zh">Chinese</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
