'use client'

import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { PageContainer } from '@/components/layout/PageContainer'
import { LeadsTable } from '@/components/leads/LeadsTable'
import { AddLeadModal } from '@/components/leads/AddLeadModal'
import { EditLeadModal } from '@/components/leads/EditLeadModal'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { mockLeads } from '@/lib/mock-data'
import { useAuth } from '@/lib/auth-context'
import type { Lead } from '@/lib/types'

export default function LeadsPage() {
  const { userData } = useAuth()
  const [leads, setLeads] = useState<Lead[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingLead, setEditingLead] = useState<Lead | null>(null)
  const [deletingLeadId, setDeletingLeadId] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

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

  const handleEditLead = (lead: Lead) => {
    setLeads(prev => prev.map(l => l.id === lead.id ? lead : l))
    setEditingLead(null)
  }

  const handleDeleteLead = (id: string) => {
    setDeletingLeadId(id)
  }

  const confirmDelete = async () => {
    if (!deletingLeadId) return
    setDeleteLoading(true)
    try {
      const params = userData?.id ? `?userId=${userData.id}` : ''
      await fetch(`/api/leads/${deletingLeadId}${params}`, { method: 'DELETE' })
      setLeads(prev => prev.filter(l => l.id !== deletingLeadId))
      window.dispatchEvent(new Event('notification-updated'))
    } catch {
      // silent fail — user can retry
    } finally {
      setDeleteLoading(false)
      setDeletingLeadId(null)
    }
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
        <LeadsTable leads={leads} onEdit={setEditingLead} onDelete={handleDeleteLead} />
      </PageContainer>
      {showAddModal && (
        <AddLeadModal
          userId={userData?.id}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddLead}
        />
      )}
      {editingLead && (
        <EditLeadModal
          lead={editingLead}
          userId={userData?.id}
          onClose={() => setEditingLead(null)}
          onSave={handleEditLead}
        />
      )}
      <AlertDialog open={!!deletingLeadId} onOpenChange={open => !open && setDeletingLeadId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete lead?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The lead will be permanently removed from your pipeline.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleteLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteLoading ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
