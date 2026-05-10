'use client'

import { useState } from 'react'
import { X, CircleAlert as AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import type { Lead, LeadStatus } from '@/lib/types'
import { cn } from '@/lib/utils'

interface EditLeadModalProps {
  lead: Lead
  userId?: string
  onClose: () => void
  onSave: (lead: Lead) => void
}

const sources = ['Website', 'LinkedIn', 'Referral', 'Cold Outreach', 'Conference', 'Instagram', 'Dribbble', 'Other']
const industries = ['Technology', 'Finance', 'Healthcare', 'Design', 'Real Estate', 'Consulting', 'E-commerce', 'Media', 'Energy', 'Events', 'Retail', 'Other']

interface FormErrors {
  name?: string
  email?: string
  value?: string
}

const validateEmail = (email: string) => !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

const inputBase =
  'w-full h-10 px-3 text-[13.5px] rounded-md bg-surface-inset text-text-primary placeholder:text-text-tertiary border transition-[background-color,border-color,box-shadow] duration-base hover:border-border-strong focus:outline-none focus:bg-surface-1'

function Field({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[12px] font-medium text-text-secondary tracking-[-0.005em]">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      {children}
      {error && (
        <div className="flex items-center gap-1.5 text-[11.5px] text-danger">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          {error}
        </div>
      )}
    </div>
  )
}

export function EditLeadModal({ lead, userId, onClose, onSave }: EditLeadModalProps) {
  const [form, setForm] = useState({
    name: lead.name,
    company: lead.company ?? '',
    email: lead.email ?? '',
    phone: lead.phone ?? '',
    status: lead.status as LeadStatus,
    value: lead.value ? String(lead.value) : '',
    source: lead.source ?? 'Website',
    industry: lead.industry ?? 'Technology',
    notes: lead.notes ?? '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(false)

  const set = (k: string, v: string) => {
    setForm(f => ({ ...f, [k]: v }))
    if (touched[k]) validate({ ...form, [k]: v })
  }

  const touch = (k: string) => setTouched(t => ({ ...t, [k]: true }))

  const validate = (data: typeof form): FormErrors => {
    const errs: FormErrors = {}
    if (!data.name.trim()) errs.name = 'Full name is required'
    else if (data.name.trim().length < 2) errs.name = 'Name must be at least 2 characters'
    if (data.email && !validateEmail(data.email)) errs.email = 'Enter a valid email address'
    if (data.value && (isNaN(Number(data.value)) || Number(data.value) < 0)) errs.value = 'Enter a valid positive number'
    setErrors(errs)
    return errs
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({ name: true, email: true, value: true })
    const errs = validate(form)
    if (Object.keys(errs).length > 0) {
      toast.error('Please fix the errors before submitting')
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`/api/leads/${lead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          name: form.name.trim(),
          company: form.company.trim(),
          email: form.email.trim(),
          phone: form.phone,
          status: form.status.toUpperCase(),
          value: parseFloat(form.value) || 0,
          source: form.source,
          notes: form.notes,
        }),
      })
      if (!res.ok) throw new Error('API error')
      const data = await res.json()
      onSave({
        ...lead,
        name: data.name,
        company: data.company ?? form.company,
        email: data.email ?? form.email,
        phone: data.phone ?? form.phone,
        status: (data.status as string).toLowerCase() as LeadStatus,
        value: data.value ?? 0,
        source: data.source ?? form.source,
        industry: form.industry,
        notes: data.notes ?? form.notes,
      })
      toast.success('Lead updated', { description: `${form.name} has been updated.` })
      window.dispatchEvent(new Event('notification-updated'))
    } catch {
      toast.error('Failed to update lead', { description: 'Please try again.' })
      setLoading(false)
    }
  }

  const inputCls = (field: keyof FormErrors) =>
    cn(
      inputBase,
      touched[field] && errors[field]
        ? 'border-danger focus:border-danger focus:shadow-[0_0_0_3px_hsl(var(--danger)/0.18)]'
        : 'border-border-default focus:border-accent focus:shadow-focus'
    )

  const selectCls = cn(inputBase, 'border-border-default focus:border-accent focus:shadow-focus appearance-none')

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={cn('relative w-full sm:max-w-lg max-h-[92vh] overflow-y-auto', 'bg-surface-1 border border-border-default', 'rounded-t-2xl sm:rounded-2xl shadow-xl')}>
        <div className="sticky top-0 bg-surface-1 flex items-center justify-between px-6 py-4 border-b border-border-subtle rounded-t-2xl z-10">
          <div>
            <h2 className="text-[16px] font-semibold text-text-primary tracking-[-0.015em]">Edit Lead</h2>
            <p className="text-[12px] text-text-tertiary mt-0.5">{lead.name}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-md flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-surface-2 transition-colors duration-base">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Full name" required error={touched.name ? errors.name : undefined}>
              <input className={inputCls('name')} value={form.name} onChange={e => set('name', e.target.value)} onBlur={() => { touch('name'); validate(form) }} />
            </Field>
            <Field label="Company">
              <input className={cn(inputBase, 'border-border-default focus:border-accent focus:shadow-focus')} value={form.company} onChange={e => set('company', e.target.value)} />
            </Field>
          </div>

          <Field label="Email address" error={touched.email ? errors.email : undefined}>
            <input type="email" className={inputCls('email')} value={form.email} onChange={e => set('email', e.target.value)} onBlur={() => { touch('email'); validate(form) }} />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Phone">
              <input className={cn(inputBase, 'border-border-default focus:border-accent focus:shadow-focus')} value={form.phone} onChange={e => set('phone', e.target.value)} />
            </Field>
            <Field label="Deal value ($)" error={touched.value ? errors.value : undefined}>
              <input type="number" min="0" className={inputCls('value')} value={form.value} onChange={e => set('value', e.target.value)} onBlur={() => { touch('value'); validate(form) }} />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Status">
              <select className={selectCls} value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="proposal">Proposal Sent</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
              </select>
            </Field>
            <Field label="Lead source">
              <select className={selectCls} value={form.source} onChange={e => set('source', e.target.value)}>
                {sources.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Industry">
            <select className={selectCls} value={form.industry} onChange={e => set('industry', e.target.value)}>
              {industries.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </Field>

          <Field label="Notes">
            <textarea
              className={cn('w-full px-3 py-2.5 text-[13.5px] rounded-md resize-none', 'bg-surface-inset text-text-primary placeholder:text-text-tertiary', 'border border-border-default', 'transition-[background-color,border-color,box-shadow] duration-base', 'hover:border-border-strong', 'focus:outline-none focus:border-accent focus:shadow-focus focus:bg-surface-1')}
              rows={3}
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
            />
          </Field>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className={cn('flex-1 h-10 rounded-md text-[13px] font-medium', 'bg-surface-1 text-text-primary', 'border border-border-default', 'hover:bg-surface-2 hover:border-border-strong', 'transition-all duration-base')}>
              Cancel
            </button>
            <button type="submit" disabled={loading} className={cn('flex-1 h-10 rounded-md text-[13px] font-medium text-white', 'flex items-center justify-center gap-2', 'bg-[linear-gradient(180deg,hsl(var(--accent))_0%,hsl(var(--accent-hover))_100%)]', 'shadow-[inset_0_1px_0_rgb(255_255_255_/_0.16),0_1px_2px_rgb(0_0_0_/_0.20),0_0_0_1px_hsl(var(--accent-hover))]', 'hover:brightness-[1.06]', 'transition-all duration-base', 'disabled:opacity-70')}>
              {loading ? (<><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</>) : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
