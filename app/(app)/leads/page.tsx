'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { PageContainer } from '@/components/layout/PageContainer'
import { LeadsTable } from '@/components/leads/LeadsTable'
import { AddLeadModal } from '@/components/leads/AddLeadModal'
import { Button } from '@/components/ui/button'
import { mockLeads } from '@/lib/mock-data'
import type { Lead } from '@/lib/types'

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>(mockLeads)
  const [showAddModal, setShowAddModal] = useState(false)

  const handleAddLead = (lead: Lead) => {
    setLeads(prev => [lead, ...prev])
    setShowAddModal(false)
  }

  return (
    <div className="flex flex-col flex-1">
      <Header
        title="Leads"
        subtitle={`${leads.length} total leads in your pipeline`}
        action={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add Lead</span>
            <span className="sm:hidden">Add</span>
          </Button>
        }
      />
      <PageContainer>
        <LeadsTable leads={leads} />
      </PageContainer>
      {showAddModal && (
        <AddLeadModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddLead}
        />
      )}
    </div>
  )
}
