export type LeadStatus = 'new' | 'contacted' | 'proposal' | 'won' | 'lost'
export type Priority = 'low' | 'medium' | 'high'
export type TaskStatus = 'todo' | 'in_progress' | 'done'
export type ActivityType = 'email' | 'call' | 'meeting' | 'note' | 'proposal' | 'contract'

export interface Lead {
  id: string
  name: string
  company: string
  email: string
  phone: string
  status: LeadStatus
  value: number
  lastContact: string
  source: string
  industry: string
  notes?: string
}

export interface Client {
  id: string
  name: string
  company: string
  email: string
  phone: string
  website: string
  revenue: number
  since: string
  industry: string
  location: string
  notes: string
  avatarColor: string
}

export interface Task {
  id: string
  title: string
  description: string
  priority: Priority
  status: TaskStatus
  dueDate: string
  clientId?: string
  clientName?: string
  tags: string[]
}

export interface Activity {
  id: string
  type: ActivityType
  description: string
  date: string
  user: string
}

export interface KPIData {
  label: string
  value: string
  change: number
  changeLabel: string
}

export interface RevenueDataPoint {
  month: string
  revenue: number
  target: number
}

export interface LeadSourceDataPoint {
  name: string
  value: number
  color: string
}
