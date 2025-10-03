import { StatsCard } from "@/components/dashboard/stats-card";
import { DollarSign, Users, FileText, Activity } from "lucide-react";
import { AdminClientTable } from "@/components/admin/client-table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, ResponsiveContainer } from "recharts";

const contractStatusData = [
    { name: 'Authorized', value: 450, fill: 'var(--color-authorized)' },
    { name: 'In Process', value: 120, fill: 'var(--color-in-process)' },
    { name: 'At Risk', value: 35, fill: 'var(--color-at-risk)' },
    { name: 'Suspended', value: 15, fill: 'var(--color-suspended)' },
    { name: 'Canceled', value: 25, fill: 'var(--color-canceled)' },
];

const monthlyRevenueData = [
  { month: "Jan", revenue: 65000 },
  { month: "Feb", revenue: 59000 },
  { month: "Mar", revenue: 80000 },
  { month: "Apr", revenue: 81000 },
  { month: "May", revenue: 56000 },
  { month: "Jun", revenue: 55000 },
  { month: "Jul", revenue: 70000 },
];

const chartConfig = {
    revenue: { color: "hsl(var(--primary))" },
    authorized: { color: "hsl(var(--chart-2))" },
    'in-process': { color: "hsl(var(--chart-3))" },
    'at-risk': { color: "hsl(var(--chart-5))" },
    suspended: { color: "hsl(var(--muted-foreground))" },
    canceled: { color: "hsl(var(--destructive))" },
};

export default function AdminPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Complete business overview of the GeoVeraxis platform.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value="$1.2M"
          icon={DollarSign}
          change="+15.2% this month"
        />
        <StatsCard
          title="New Clients"
          value="128"
          icon={Users}
          change="+30 this month"
        />
        <StatsCard
          title="Active Contracts"
          value="1,482"
          icon={FileText}
          change="+201 this month"
        />
        <StatsCard
          title="Platform Activity"
          value="92%"
          icon={Activity}
          change="vs last month"
        />
      </div>

      <div className="grid gap-4 md:gap-8 lg:grid-cols-5">
        <Card className="lg:col-span-3">
            <CardHeader>
                <CardTitle>Monthly Revenue</CardTitle>
            </CardHeader>
            <CardContent>
                 <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyRevenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis tickFormatter={(value) => `$${Number(value) / 1000}k`} />
                        <Tooltip formatter={(value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value))}/>
                        <Legend />
                        <Bar dataKey="revenue" fill="hsl(var(--primary))" name="Revenue"/>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Contract Status</CardTitle>
            </CardHeader>
            <CardContent>
                 <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={contractStatusData} layout="vertical">
                         <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" width={80} />
                        <Tooltip />
                        <Bar dataKey="value" name="Contracts"/>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
      </div>

      <AdminClientTable />
    </div>
  );
}
