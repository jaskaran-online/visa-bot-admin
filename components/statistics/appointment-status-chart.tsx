"use client"

import { useState } from "react"
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"

interface AppointmentStatusChartProps {
  data?: Array<{
    status: string
    value: number
    color: string
  }>
  isLoading: boolean
}

export function AppointmentStatusChart({ data, isLoading }: AppointmentStatusChartProps) {
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
        <p>No status data available</p>
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

  const statusColors = {
    pending: "#FFBB28",
    confirmed: "#00C49F",
    cancelled: "#FF8042",
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          nameKey="status"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          isAnimationActive={true}
          animationDuration={1000}
          animationEasing="ease-in-out"
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.color || statusColors[entry.status as keyof typeof statusColors] || "#8884d8"}
              stroke="var(--background)"
              strokeWidth={2}
              opacity={activeIndex === null || activeIndex === index ? 1 : 0.6}
            />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--background)",
            borderColor: "var(--border)",
            borderRadius: "var(--radius)",
            fontSize: 12,
          }}
          formatter={(value: number, name: string) => [`${value} appointments`, name]}
        />
        <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  )
}
