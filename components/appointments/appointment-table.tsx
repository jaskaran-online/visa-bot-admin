"use client"

import { useState } from "react"
import { format, subDays } from "date-fns"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ChevronUp, 
  ChevronDown, 
  ExternalLink, 
  MailIcon, 
  Calendar, 
  MapPin, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Clock as ClockIcon 
} from "lucide-react"
import type { SuccessfulAppointment } from "@/lib/api-client"

// Helper for row grouping logic
type GroupedAppointments = {
  [key: string]: SuccessfulAppointment[]
}

interface AppointmentTableProps {
  appointments: SuccessfulAppointment[]
  countryNameMap: (code: string) => string
  groupByEmail: boolean
  sortBy: string
  sortDirection: "asc" | "desc"
  onViewDetails: (appointmentId: string) => void
  onSortChange: (field: string) => void
}

export function AppointmentTable({ 
  appointments, 
  countryNameMap, 
  groupByEmail,
  sortBy,
  sortDirection,
  onViewDetails,
  onSortChange
}: AppointmentTableProps) {
  const [expandedGroups, setExpandedGroups] = useState<{ [key: string]: boolean }>({})

  // Get status badge variant
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge variant="success" className="flex items-center"><CheckCircle className="mr-1 h-3 w-3" /> Confirmed</Badge>
      case "cancelled":
        return <Badge variant="destructive" className="flex items-center"><XCircle className="mr-1 h-3 w-3" /> Cancelled</Badge>
      case "pending":
      default:
        return <Badge variant="outline" className="flex items-center"><ClockIcon className="mr-1 h-3 w-3" /> Pending</Badge>
    }
  }

  // Get upcoming badge
  const getUpcomingBadge = (date: string) => {
    const appointmentDate = new Date(date)
    const isUpcoming = appointmentDate > new Date()
    return isUpcoming 
      ? <Badge className="ml-2" variant="default">Upcoming</Badge>
      : <Badge className="ml-2" variant="outline">Past</Badge>
  }

  // Toggle group expansion
  const toggleGroup = (key: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  // Render regular table (no grouping)
  const renderRegularTable = () => (
    <Table className="border">
      <TableHeader className="bg-muted/50">
        <TableRow>
          <TableHead onClick={() => onSortChange('email')} className="cursor-pointer hover:bg-muted">
            Email {sortBy === 'email' && (sortDirection === 'asc' ? <ChevronUp className="inline h-4 w-4" /> : <ChevronDown className="inline h-4 w-4" />)}
          </TableHead>
          <TableHead onClick={() => onSortChange('country')} className="cursor-pointer hover:bg-muted">
            Country {sortBy === 'country' && (sortDirection === 'asc' ? <ChevronUp className="inline h-4 w-4" /> : <ChevronDown className="inline h-4 w-4" />)}
          </TableHead>
          <TableHead onClick={() => onSortChange('facility_name')} className="cursor-pointer hover:bg-muted">
            Facility {sortBy === 'facility_name' && (sortDirection === 'asc' ? <ChevronUp className="inline h-4 w-4" /> : <ChevronDown className="inline h-4 w-4" />)}
          </TableHead>
          <TableHead onClick={() => onSortChange('appointment_date')} className="cursor-pointer hover:bg-muted">
            Date {sortBy === 'appointment_date' && (sortDirection === 'asc' ? <ChevronUp className="inline h-4 w-4" /> : <ChevronDown className="inline h-4 w-4" />)}
          </TableHead>
          <TableHead>Time</TableHead>
          <TableHead onClick={() => onSortChange('status')} className="cursor-pointer hover:bg-muted">
            Status {sortBy === 'status' && (sortDirection === 'asc' ? <ChevronUp className="inline h-4 w-4" /> : <ChevronDown className="inline h-4 w-4" />)}
          </TableHead>
          <TableHead onClick={() => onSortChange('booked_at')} className="cursor-pointer hover:bg-muted">
            Booked At {sortBy === 'booked_at' && (sortDirection === 'asc' ? <ChevronUp className="inline h-4 w-4" /> : <ChevronDown className="inline h-4 w-4" />)}
          </TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {appointments.map((appointment) => (
          <TableRow key={appointment.id} className="hover:bg-muted/50">
            <TableCell>
              <div className="flex items-center">
                <MailIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{appointment.email}</span>
              </div>
            </TableCell>
            <TableCell>{countryNameMap(appointment.country)}</TableCell>
            <TableCell>{appointment.facility_name}</TableCell>
            <TableCell>
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{format(subDays(new Date(appointment.appointment_date), 1), "MMM d, yyyy")}</span>
                {getUpcomingBadge(appointment.appointment_date)}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{appointment.appointment_time}</span>
              </div>
            </TableCell>
            <TableCell>{getStatusBadge(appointment.status)}</TableCell>
            <TableCell>{format(new Date(appointment.booked_at), "MMM d, yyyy")}</TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="sm" onClick={() => onViewDetails(appointment.id)}>
                <ExternalLink className="h-4 w-4" />
                <span className="sr-only">View Details</span>
              </Button>
            </TableCell>
          </TableRow>
        ))}
        {appointments.length === 0 && (
          <TableRow>
            <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
              No appointments found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )

  // Render grouped table (by email)
  const renderGroupedTable = () => {
    // Group appointments by email
    const groupedAppointments = appointments.reduce<GroupedAppointments>((acc, appointment) => {
      const key = appointment.email
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(appointment)
      return acc
    }, {})

    // Sort each group by appointment date (newest first)
    Object.keys(groupedAppointments).forEach(key => {
      groupedAppointments[key].sort((a, b) => {
        return new Date(b.appointment_date).getTime() - new Date(a.appointment_date).getTime()
      })
    })

    // Initialize all groups as expanded by default
    if (Object.keys(expandedGroups).length === 0) {
      const initialExpandedState: { [key: string]: boolean } = {}
      Object.keys(groupedAppointments).forEach(key => {
        initialExpandedState[key] = true
      })
      setExpandedGroups(initialExpandedState)
    }

    return (
      <Table className="border">
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Facility</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Booked At</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(groupedAppointments).map(([email, appointmentsForEmail]) => (
            <>
              <TableRow 
                key={email}
                className="bg-muted/30 cursor-pointer hover:bg-muted/50"
                onClick={() => toggleGroup(email)}
              >
                <TableCell colSpan={8} className="py-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <MailIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{email}</span>
                      <Badge variant="outline" className="ml-3">{appointmentsForEmail.length} appointments</Badge>
                    </div>
                    {expandedGroups[email] ? 
                      <ChevronUp className="h-4 w-4" /> :
                      <ChevronDown className="h-4 w-4" />
                    }
                  </div>
                </TableCell>
              </TableRow>
              {expandedGroups[email] && appointmentsForEmail.map((appointment) => (
                <TableRow key={appointment.id} className="hover:bg-muted/50">
                  <TableCell className="pl-8">
                    <span className="text-muted-foreground text-sm">↳</span>
                  </TableCell>
                  <TableCell>{countryNameMap(appointment.country)}</TableCell>
                  <TableCell>{appointment.facility_name}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{format(subDays(new Date(appointment.appointment_date), 1), "MMM d, yyyy")}</span>
                      {getUpcomingBadge(appointment.appointment_date)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{appointment.appointment_time}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                  <TableCell>{format(new Date(appointment.booked_at), "MMM d, yyyy")}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => onViewDetails(appointment.id)}>
                      <ExternalLink className="h-4 w-4" />
                      <span className="sr-only">View Details</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </>
          ))}
          {Object.keys(groupedAppointments).length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                No appointments found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    )
  }

  return (
    <div className="rounded-md bg-background">
      <div className="overflow-x-auto">
        {groupByEmail ? renderGroupedTable() : renderRegularTable()}
      </div>
    </div>
  )
}
