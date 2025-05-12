"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { apiClient, type SuccessfulAppointment } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Calendar, MapPin, User, Clock, Mail, Bot, CalendarCheck, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import { Skeleton } from "@/components/ui/skeleton"

export default function AppointmentDetailPage({ params }: { params: { id: string } }) {
  const [appointment, setAppointment] = useState<SuccessfulAppointment | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const data = await apiClient.getAppointment(params.id)
        setAppointment(data)
      } catch (error) {
        toast({
          title: "Error fetching appointment details",
          description: error instanceof Error ? error.message : "Failed to load appointment details. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchAppointment()
  }, [params.id, toast])

  const handleConfirmAppointment = async () => {
    if (!appointment) return

    try {
      await apiClient.confirmAppointment(appointment.id)

      toast({
        title: "Appointment confirmed",
        description: "The appointment has been marked as confirmed.",
      })

      // Update local state
      setAppointment({
        ...appointment,
        status: "confirmed",
      } as SuccessfulAppointment)
    } catch (error) {
      toast({
        title: "Failed to confirm appointment",
        description: error instanceof Error ? error.message : "An error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCancelAppointment = async () => {
    if (!appointment) return

    try {
      await apiClient.cancelAppointment(appointment.id)

      toast({
        title: "Appointment cancelled",
        description: "The appointment has been cancelled.",
      })

      // Update local state
      setAppointment({
        ...appointment,
        status: "cancelled",
      } as SuccessfulAppointment)
    } catch (error) {
      toast({
        title: "Failed to cancel appointment",
        description: error instanceof Error ? error.message : "An error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <MainLayout>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.push("/appointments")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Appointment Details</h1>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-10 w-24" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {[...Array(2)].map((_, i) => (
                <Skeleton key={i} className="h-64" />
              ))}
            </div>
          </div>
        ) : appointment ? (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-semibold">{appointment.email}</h2>
                <Badge variant={appointment.status === "confirmed" ? "success" : "outline"} className="ml-2">
                  {appointment.status === "confirmed" ? "Confirmed" : "Pending"}
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                {appointment.status !== "confirmed" && (
                  <Button onClick={handleConfirmAppointment}>
                    <CalendarCheck className="mr-2 h-4 w-4" />
                    Confirm
                  </Button>
                )}
                {appointment.status !== "cancelled" && (
                  <Button variant="outline" onClick={handleCancelAppointment}>
                    Cancel
                  </Button>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Appointment Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center">
                    <Calendar className="mr-3 h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Date</p>
                      <p className="text-muted-foreground">
                        {format(new Date(appointment.appointment_date), "MMMM d, yyyy")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Clock className="mr-3 h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Time</p>
                      <p className="text-muted-foreground">{appointment.appointment_time}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <MapPin className="mr-3 h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-muted-foreground">
                        {appointment.facility_name}, {apiClient.getCountryName(appointment.country)}
                      </p>
                    </div>
                  </div>

                  {appointment.visa_type && (
                    <div className="flex items-center">
                      <User className="mr-3 h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Visa Type</p>
                        <p className="text-muted-foreground">{appointment.visa_type}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center">
                    <Mail className="mr-3 h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-muted-foreground">{appointment.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Bot className="mr-3 h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Found By Bot</p>
                      <p className="text-muted-foreground">{appointment.bot_id}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Additional Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {appointment.asc_appointment_date && (
                    <div className="flex items-center">
                      <Calendar className="mr-3 h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">ASC Appointment Date</p>
                        <p className="text-muted-foreground">
                          {format(new Date(appointment.asc_appointment_date), "MMMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                  )}

                  {appointment.asc_appointment_time && (
                    <div className="flex items-center">
                      <Clock className="mr-3 h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">ASC Appointment Time</p>
                        <p className="text-muted-foreground">{appointment.asc_appointment_time}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center">
                    <Clock className="mr-3 h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Booked At</p>
                      <p className="text-muted-foreground">
                        {format(new Date(appointment.booked_at), "MMMM d, yyyy 'at' h:mm a")}
                      </p>
                    </div>
                  </div>

                  {appointment.schedule_id && (
                    <div className="flex items-center">
                      <Calendar className="mr-3 h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Schedule ID</p>
                        <p className="text-muted-foreground">{appointment.schedule_id}</p>
                      </div>
                    </div>
                  )}

                  {appointment.notes && (
                    <div className="flex items-start pt-2">
                      <div className="w-full">
                        <p className="font-medium mb-1">Notes</p>
                        <div className="p-3 bg-muted rounded-md text-sm">{appointment.notes}</div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold">Appointment not found</h2>
            <p className="text-muted-foreground mt-2">
              The appointment you are looking for does not exist or has been deleted
            </p>
            <Button className="mt-4" onClick={() => router.push("/appointments")}>
              Back to Appointments
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
