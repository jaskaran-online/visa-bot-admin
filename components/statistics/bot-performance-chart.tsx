"use client"

import { useState } from "react"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"

interface BotPerformanceChartProps {
  data?: Array<{
    botId: string
    botName: string
    [key: string]: any
  }>
  isLoading: boolean
  dataKey?: string
  valueFormat?: string
  barColor?: string
}

export function BotPerformanceChart({
  data,
  isLoading,
  dataKey = "appointments",
  valueFormat = "",
  barColor = "#2563eb",
}: BotPerformanceChartProps) {
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
        <p>No bot performance data available</p>
        <p className="text-sm">Try adjusting your filters or date range</p>
      </div>
    )
  }

  // Sort data by the dataKey in descending order for better visualization
  const sortedData = [...data].sort((a, b) => b[dataKey] - a[dataKey])

  const handleMouseEnter = (_, index: number) => {
    setActiveIndex(index)
  }

  const handleMouseLeave = () => {
    setActiveIndex(null)
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={sortedData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
        layout="vertical"
      >
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis type="number" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          type="category"
          dataKey="botName"
          stroke="var(--muted-foreground)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          width={120}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--background)",
            borderColor: "var(--border)",
            borderRadius: "var(--radius)",
            fontSize: 12,
          }}
          formatter={(value: number) => [
            `${value}${valueFormat}`,
            dataKey === "appointments" ? "Appointments" : "Performance",
          ]}
          labelStyle={{ fontWeight: "bold", marginBottom: 4 }}
        />
        <Legend />
        <Bar
          dataKey={dataKey}
          name={dataKey === "appointments" ? "Appointments Found" : "Performance Metric"}
          fill={barColor}
          radius={[0, 4, 4, 0]}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          isAnimationActive={true}
          animationDuration={1000}
          animationEasing="ease-in-out"
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
