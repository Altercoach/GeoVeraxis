import { StatsCard } from "@/components/dashboard/stats-card";
import { OverviewChart } from "@/components/dashboard/overview-chart";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { FileCheck2, Database, Users, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <StatsCard
          title="Properties Managed"
          value="1,250"
          icon={Database}
          change="+5.2% this month"
        />
        <StatsCard
          title="Documents Verified"
          value="8,921"
          icon={FileCheck2}
          change="+12.8% this month"
        />
        <StatsCard
          title="Active Users"
          value="573"
          icon={Users}
          change="+2.1% this month"
        />
        <StatsCard
          title="Transaction Volume"
          value="$2.4M"
          icon={TrendingUp}
          change="-1.5% this month"
        />
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <div className="xl:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Transaction Overview</h2>
            <OverviewChart />
        </div>
        <div>
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <RecentTransactions />
        </div>
      </div>
    </div>
  );
}
