'use client'

import { Header } from '@/components/layout/Header'
import { PageContainer } from '@/components/layout/PageContainer'
import { KanbanBoard } from '@/components/pipeline/KanbanBoard'

export default function PipelinePage() {
  return (
    <div className="flex flex-col flex-1">
      <Header
        title="Pipeline"
        subtitle="Track your deals from first contact to close"
        size="wide"
      />
      <PageContainer size="wide">
        <KanbanBoard />
      </PageContainer>
    </div>
  )
}
