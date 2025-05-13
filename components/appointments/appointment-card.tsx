"use client"

import { format } from "date-fns"
import { Calendar, MapPin, User, Clock, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { SuccessfulAppointment } from "@/lib/api-client"

interface AppointmentCardProps {
  appointment: SuccessfulAppointment
  countryName: string
  onViewDetails: () => void
}

export function AppointmentCard({ appointment, countryName, onViewDetails }: AppointmentCardProps) {
  const appointmentDate = new Date(appointment.appointment_date)
  const isUpcoming = appointmentDate > new Date()

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          <CardTitle className="text-md font-medium">{appointment.email}</CardTitle>
          <Badge className="w-fit" variant={isUpcoming ? "default" : "outline"}>{isUpcoming ? "Upcoming" : "Past"}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-3 text-sm">
          <div className="flex items-center">
            <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>
              {appointment.facility_name}, {countryName}
            </span>
          </div>
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{format(appointmentDate, "MMMM d, yyyy")}</span>
          </div>
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{appointment.appointment_time}</span>
          </div>
          {appointment.visa_type && (
            <div className="flex items-center">
              <User className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>{appointment.visa_type}</span>
            </div>
          )}
          <div className="flex items-center text-xs text-muted-foreground">
            <span>Booked on {format(new Date(appointment.booked_at), "MMM d, yyyy 'at' h:mm a")}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button variant="outline" size="sm" className="w-full" onClick={onViewDetails}>
          <ExternalLink className="mr-2 h-4 w-4" />
          View Details
        </Button>
      </CardFooter>
    </Card>
  )
}
