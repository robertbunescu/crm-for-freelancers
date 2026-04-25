'use client'

import { Header } from '@/components/layout/Header'
import { PageContainer } from '@/components/layout/PageContainer'
import { TasksView } from '@/components/tasks/TasksView'

export default function TasksPage() {
  return (
    <div className="flex flex-col flex-1">
      <Header
        title="Tasks"
        subtitle="Track and manage your work across all clients"
      />
      <PageContainer>
        <TasksView />
      </PageContainer>
    </div>
  )
}
