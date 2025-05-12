"use client"

import { useState } from "react"
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import { Skeleton } from "@/components/ui/skeleton"

interface AppointmentDistributionChartProps {
  data?: Array<{
    [key: string]: any
    value: number
  }>
  isLoading: boolean
  dataKey: string
  nameKey: string
  type?: "pie" | "bar"
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#8dd1e1",
  "#a4de6c",
  "#d0ed57",
]

export function AppointmentDistributionChart({
  data,
  isLoading,
  dataKey,
  nameKey,
  type = "pie",
}: AppointmentDistributionChartProps) {
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
        <p>No distribution data available</p>
        <p className="text-sm">Try adjusting your filters or date range</p>
      </div>
    )
  }

  // Sort data by value in descending order for better visualization
  const sortedData = [...data].sort((a, b) => b.value - a.value)

  const handleMouseEnter = (_, index: number) => {
    setActiveIndex(index)
  }

  const handleMouseLeave = () => {
    setActiveIndex(null)
  }

  if (type === "bar") {
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
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey={nameKey}
            stroke="var(--muted-foreground)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            interval={0}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--background)",
              borderColor: "var(--border)",
              borderRadius: "var(--radius)",
              fontSize: 12,
            }}
            labelStyle={{ fontWeight: "bold", marginBottom: 4 }}
          />
          <Legend />
          <Bar
            dataKey="value"
            name="Appointments"
            fill="#2563eb"
            radius={[4, 4, 0, 0]}
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

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={sortedData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          innerRadius={40}
          fill="#8884d8"
          dataKey="value"
          nameKey={nameKey}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          isAnimationActive={true}
          animationDuration={1000}
          animationEasing="ease-in-out"
        >
          {sortedData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
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
        <Legend
          layout="vertical"
          verticalAlign="middle"
          align="right"
          wrapperStyle={{ fontSize: 12 }}
          formatter={(value, entry, index) => {
            // Limit the number of characters in the legend
            return value.length > 20 ? value.substring(0, 20) + "..." : value
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
