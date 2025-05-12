"use client"

import { useState } from "react"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"

interface AppointmentTrendChartProps {
  data?: Array<{
    date: string
    value: number
    [key: string]: any
  }>
  isLoading: boolean
  yAxisLabel?: string
  lineColor?: string
}

export function AppointmentTrendChart({
  data,
  isLoading,
  yAxisLabel = "Appointments",
  lineColor = "#2563eb",
}: AppointmentTrendChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Skeleton className="h-[300px] w-full" />
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
        <p>No trend data available</p>
        <p className="text-sm">Try adjusting your filters or date range</p>
      </div>
    )
  }

  const handleMouseEnter = (_, index: number) => {
    setActiveIndex(index)
  }

  const handleMouseLeave = () => {
    setActiveIndex(null)
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis
          dataKey="date"
          stroke="var(--muted-foreground)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => {
            // Format date to be more readable
            try {
              const date = new Date(value)
              return date.toLocaleDateString(undefined, { month: "short", day: "numeric" })
            } catch (e) {
              return value
            }
          }}
        />
        <YAxis
          stroke="var(--muted-foreground)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          label={{
            value: yAxisLabel,
            angle: -90,
            position: "insideLeft",
            style: { textAnchor: "middle", fill: "var(--muted-foreground)", fontSize: 12 },
          }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--background)",
            borderColor: "var(--border)",
            borderRadius: "var(--radius)",
            fontSize: 12,
          }}
          labelStyle={{ fontWeight: "bold", marginBottom: 4 }}
          labelFormatter={(label) => {
            try {
              const date = new Date(label)
              return date.toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            } catch (e) {
              return label
            }
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="value"
          name={yAxisLabel}
          stroke={lineColor}
          strokeWidth={2}
          dot={{ r: 4, strokeWidth: 2 }}
          activeDot={{ r: 6, strokeWidth: 2 }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          isAnimationActive={true}
          animationDuration={1000}
          animationEasing="ease-in-out"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
