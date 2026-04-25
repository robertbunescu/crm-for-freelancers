'use client'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  ChevronLeft,
  Globe,
  Mail,
  MapPin,
  Briefcase,
  Calendar,
  DollarSign,
  Phone as PhoneIcon,
} from 'lucide-react'
import { mockClients, mockActivities, mockTasks } from '@/lib/mock-data'
import { Header } from '@/components/layout/Header'
import { PageContainer } from '@/components/layout/PageContainer'
import { ActivityTimeline } from '@/components/clients/ActivityTimeline'
import { ClientTasks } from '@/components/clients/ClientTasks'
import { cn } from '@/lib/utils'

interface ClientDetailPageProps {
  params: { id: string }
}

const formatCurrency = (v: number) => `$${v.toLocaleString()}`
const formatDate = (s: string) =>
  new Date(s).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

export default function ClientDetailPage({ params }: ClientDetailPageProps) {
  const client = mockClients.find(c => c.id === params.id)
  if (!client) notFound()

  const clientTasks = mockTasks.filter(t => t.clientId === client.id)

  const infoItems = [
    { icon: Mail, label: 'Email', value: client.email, mono: false },
    { icon: PhoneIcon, label: 'Phone', value: client.phone, mono: true },
    { icon: Globe, label: 'Website', value: client.website, mono: false },
    { icon: MapPin, label: 'Location', value: client.location, mono: false },
    { icon: Briefcase, label: 'Industry', value: client.industry, mono: false },
    {
      icon: Calendar,
      label: 'Client since',
      value: formatDate(client.since),
      mono: true,
    },
    {
      icon: DollarSign,
      label: 'Total revenue',
      value: formatCurrency(client.revenue),
      mono: true,
    },
  ]

  return (
    <div className="flex flex-col flex-1">
      <Header
        title={client.company}
        subtitle={`Client profile — ${client.name}`}
      />
      <PageContainer>
        <div className="space-y-6">
        <Link
          href="/clients"
          className={cn(
            'inline-flex items-center gap-1.5 text-[12.5px] font-medium',
            'text-text-tertiary hover:text-text-primary transition-colors duration-base'
          )}
        >
          <ChevronLeft className="w-3.5 h-3.5" /> Back to Clients
        </Link>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          {/* Left rail — client info */}
          <div className="xl:col-span-1 space-y-5">
            <div className="card-premium p-6">
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-[18px] font-bold text-white flex-shrink-0"
                  style={{
                    background: client.avatarColor,
                    boxShadow:
                      'inset 0 1px 0 rgb(255 255 255 / 0.16), 0 0 0 1px rgb(0 0 0 / 0.08)',
                  }}
                >
                  {getInitials(client.name)}
                </div>
                <div className="min-w-0">
                  <h2 className="text-[15px] font-semibold text-text-primary tracking-[-0.01em] truncate">
                    {client.name}
                  </h2>
                  <p className="text-[12.5px] text-text-tertiary truncate">
                    {client.company}
                  </p>
                </div>
              </div>

              <div className="space-y-3.5">
                {infoItems.map(({ icon: Icon, label, value, mono }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-md bg-surface-2 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-3.5 h-3.5 text-text-tertiary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-micro text-text-tertiary uppercase">
                        {label}
                      </p>
                      <p
                        className={cn(
                          'text-[13px] text-text-primary mt-1',
                          mono && 'font-mono tabular'
                        )}
                      >
                        {value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {client.notes && (
              <div className="card-premium p-5">
                <h3 className="text-micro text-text-tertiary uppercase mb-3">
                  Notes
                </h3>
                <p className="text-[13px] text-text-secondary leading-relaxed">
                  {client.notes}
                </p>
              </div>
            )}
          </div>

          {/* Right — tasks + activity */}
          <div className="xl:col-span-2 space-y-5">
            <ClientTasks tasks={clientTasks} />
            <ActivityTimeline activities={mockActivities} />
          </div>
        </div>
        </div>
      </PageContainer>
    </div>
  )
}
