'use client'

import { useState } from 'react'
import { Plus, LayoutGrid, List } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { PageContainer } from '@/components/layout/PageContainer'
import { ClientsGrid } from '@/components/clients/ClientsGrid'
import { AddClientModal } from '@/components/clients/AddClientModal'
import { Button } from '@/components/ui/button'
import { mockClients } from '@/lib/mock-data'
import type { Client } from '@/lib/types'

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>(mockClients)
  const [showAddModal, setShowAddModal] = useState(false)
  const [view, setView] = useState<'grid' | 'list'>('grid')

  const handleAddClient = (client: Client) => {
    setClients(prev => [client, ...prev])
    setShowAddModal(false)
  }

  return (
    <div className="flex flex-col flex-1">
      <Header
        title="Clients"
        subtitle={`${clients.length} active clients`}
        action={
          <div className="flex items-center gap-2">
            <div className="segmented hidden sm:inline-flex">
              <button
                onClick={() => setView('grid')}
                data-active={view === 'grid'}
                aria-label="Grid view"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setView('list')}
                data-active={view === 'list'}
                aria-label="List view"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowAddModal(true)}
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add Client</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
        }
      />
      <PageContainer>
        <ClientsGrid clients={clients} view={view} />
      </PageContainer>
      {showAddModal && (
        <AddClientModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddClient}
        />
      )}
    </div>
  )
}
