'use client'

import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { PageContainer } from '@/components/layout/PageContainer'
import { LeadsTable } from '@/components/leads/LeadsTable'
import { AddLeadModal } from '@/components/leads/AddLeadModal'
import { Button } from '@/components/ui/button'
import { mockLeads } from '@/lib/mock-data'
import { useAuth } from '@/lib/auth-context'
import type { Lead } from '@/lib/types'

export default function LeadsPage() {
  const { userData } = useAuth()
  const [leads, setLeads] = useState<Lead[]>([])
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    if (!userData?.id) return
    fetch(`/api/leads?userId=${userData.id}`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const normalized: Lead[] = data.map((d: any) => ({
            id: d.id,
            name: d.name,
            company: d.company ?? '',
            email: d.email ?? '',
            phone: d.phone ?? '',
            status: (d.status as string).toLowerCase() as Lead['status'],
            value: d.value ?? 0,
            lastContact: new Date(d.updatedAt ?? d.createdAt).toISOString().split('T')[0],
            source: d.source ?? '',
            industry: d.industry ?? '',
            notes: d.notes ?? '',
          }))
          setLeads(normalized)
        } else {
          setLeads(mockLeads)
        }
      })
      .catch(() => setLeads(mockLeads))
  }, [userData?.id])

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
          userId={userData?.id}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddLead}
        />
      )}
    </div>
  )
}
