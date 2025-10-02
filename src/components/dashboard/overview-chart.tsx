"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

const chartData = [
  { month: "January", volume: 186 },
  { month: "February", volume: 305 },
  { month: "March", volume: 237 },
  { month: "April", volume: 273 },
  { month: "May", volume: 209 },
  { month: "June", volume: 214 },
  { month: "July", volume: 320 },
  { month: "August", volume: 280 },
  { month: "September", volume: 310 },
  { month: "October", volume: 250 },
  { month: "November", volume: 290 },
  { month: "December", volume: 340 },
]

const chartConfig = {
    volume: {
      label: "Volume ($M)",
      color: "hsl(var(--primary))",
    },
  }

export function OverviewChart() {
  return (
    <Card>
      <CardContent className="pt-6">
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
            <BarChart data={chartData} accessibilityLayer>
                <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip cursor={{fill: 'hsl(var(--accent))', radius: 4}} content={<ChartTooltipContent />} />
                <Bar dataKey="volume" fill="var(--color-volume)" radius={4} />
            </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
