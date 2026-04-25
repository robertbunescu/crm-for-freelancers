'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { mockLeads } from '@/lib/mock-data'
import type { Lead, LeadStatus } from '@/lib/types'
import { KanbanColumn } from './KanbanColumn'

type Tone = 'accent' | 'warning' | 'info' | 'success' | 'neutral'

const columns: { id: LeadStatus; label: string; tone: Tone }[] = [
  { id: 'new', label: 'New Lead', tone: 'accent' },
  { id: 'contacted', label: 'Contacted', tone: 'warning' },
  { id: 'proposal', label: 'Proposal Sent', tone: 'info' },
  { id: 'won', label: 'Won', tone: 'success' },
  { id: 'lost', label: 'Lost', tone: 'neutral' },
]

const columnLabels: Record<LeadStatus, string> = {
  new: 'New Lead',
  contacted: 'Contacted',
  proposal: 'Proposal Sent',
  won: 'Won',
  lost: 'Lost',
}

export function KanbanBoard() {
  const [leads, setLeads] = useState<Lead[]>(mockLeads)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dragOverCol, setDragOverCol] = useState<LeadStatus | null>(null)

  const moveCard = (leadId: string, toStatus: LeadStatus) => {
    setLeads(prev => {
      const lead = prev.find(l => l.id === leadId)
      if (!lead || lead.status === toStatus) return prev
      toast.success(`${lead.name} moved to ${columnLabels[toStatus]}`, {
        description: lead.company,
      })
      return prev.map(l => (l.id === leadId ? { ...l, status: toStatus } : l))
    })
  }

  const totalValue = leads
    .filter(l => l.status === 'won')
    .reduce((s, l) => s + l.value, 0)

  const pipelineValue = leads.reduce((s, l) => s + l.value, 0)

  return (
    <div className="space-y-5">
      {/* Summary bar */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px]">
        <div className="flex items-center gap-1.5">
          <span className="font-mono tabular text-[15px] font-semibold text-text-primary">
            {leads.length}
          </span>
          <span className="text-text-tertiary">total leads</span>
        </div>
        <div className="w-px h-4 bg-border-subtle" />
        <div className="flex items-center gap-1.5">
          <span className="font-mono tabular text-[15px] font-semibold text-text-primary">
            ${(pipelineValue / 1000).toFixed(0)}k
          </span>
          <span className="text-text-tertiary">in pipeline</span>
        </div>
        <div className="w-px h-4 bg-border-subtle" />
        <div className="flex items-center gap-1.5">
          <span className="font-mono tabular text-[15px] font-semibold text-success">
            ${totalValue.toLocaleString()}
          </span>
          <span className="text-text-tertiary">won revenue</span>
        </div>
        <div className="hidden md:flex items-center gap-1.5 ml-auto text-[11.5px] text-text-tertiary">
          <kbd className="inline-flex items-center h-5 px-1.5 rounded-sm border border-border-subtle bg-surface-2 font-mono text-[10px]">
            drag
          </kbd>
          <span>cards between columns to update stage</span>
        </div>
      </div>

      {/* Columns — horizontal scroll on overflow */}
      <div className="-mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          {columns.map(col => {
            const colLeads = leads.filter(l => l.status === col.id)
            return (
              <KanbanColumn
                key={col.id}
                id={col.id}
                label={col.label}
                tone={col.tone}
                leads={colLeads}
                isDragOver={dragOverCol === col.id}
                draggingId={draggingId}
                onDragStart={id => setDraggingId(id)}
                onDragEnd={() => {
                  setDraggingId(null)
                  setDragOverCol(null)
                }}
                onDragOver={() => setDragOverCol(col.id)}
                onDragLeave={() => setDragOverCol(null)}
                onDrop={id => {
                  moveCard(id, col.id)
                  setDraggingId(null)
                  setDragOverCol(null)
                }}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
