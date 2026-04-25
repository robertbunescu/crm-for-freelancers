'use client'

import { Header } from '@/components/layout/Header'
import { PageContainer } from '@/components/layout/PageContainer'
import { KPICards } from '@/components/dashboard/KPICards'
import { RevenueChart } from '@/components/dashboard/RevenueChart'
import { LeadSourceChart } from '@/components/dashboard/LeadSourceChart'
import { RecentLeadsTable } from '@/components/dashboard/RecentLeadsTable'
import { ActivityFeed } from '@/components/dashboard/ActivityFeed'

export default function DashboardPage() {
  return (
    <div className="flex flex-col flex-1">
      <Header
        title="Dashboard"
        subtitle="Welcome back, Alex. Here is your business overview."
      />
      <PageContainer>
        <div className="space-y-6 lg:space-y-7">
          <KPICards />
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 lg:gap-6">
            <div className="xl:col-span-2">
              <RevenueChart />
            </div>
            <div>
              <LeadSourceChart />
            </div>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 lg:gap-6">
            <div className="xl:col-span-2">
              <RecentLeadsTable />
            </div>
            <div>
              <ActivityFeed />
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  )
}
