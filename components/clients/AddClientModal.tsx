'use client'

import { useState } from 'react'
import { X, CircleAlert as AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import type { Client } from '@/lib/types'
import { cn } from '@/lib/utils'

interface AddClientModalProps {
  onClose: () => void
  onAdd: (client: Client) => void
}

const avatarColors = [
  'linear-gradient(135deg, #5B5BF0 0%, #3A36C2 100%)',
  'linear-gradient(135deg, #2DD4A4 0%, #0E9F6E 100%)',
  'linear-gradient(135deg, #F5A524 0%, #C57317 100%)',
  'linear-gradient(135deg, #EF5B5B 0%, #CC2A2A 100%)',
  'linear-gradient(135deg, #A78BFA 0%, #7C3AED 100%)',
  'linear-gradient(135deg, #3AB7F0 0%, #0A86C2 100%)',
]

const industries = [
  'Technology',
  'Finance',
  'Healthcare',
  'Design',
  'Real Estate',
  'Consulting',
  'E-commerce',
  'Media',
  'Energy',
  'Events',
  'Retail',
  'Other',
]

interface FormErrors {
  name?: string
  company?: string
  email?: string
  revenue?: string
}

const validateEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

const inputBase =
  'w-full h-10 px-3 text-[13.5px] rounded-md bg-surface-inset text-text-primary placeholder:text-text-tertiary border transition-[background-color,border-color,box-shadow] duration-base hover:border-border-strong focus:outline-none focus:bg-surface-1'

export function AddClientModal({ onClose, onAdd }: AddClientModalProps) {
  const [form, setForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    website: '',
    revenue: '',
    industry: 'Technology',
    location: '',
    notes: '',
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
    if (!data.name.trim()) errs.name = 'Contact name is required'
    else if (data.name.trim().length < 2)
      errs.name = 'Name must be at least 2 characters'
    if (!data.company.trim()) errs.company = 'Company name is required'
    if (!data.email.trim()) errs.email = 'Email address is required'
    else if (!validateEmail(data.email))
      errs.email = 'Enter a valid email address'
    if (data.revenue && (isNaN(Number(data.revenue)) || Number(data.revenue) < 0))
      errs.revenue = 'Enter a valid positive number'
    setErrors(errs)
    return errs
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({ name: true, company: true, email: true, revenue: true })
    const errs = validate(form)
    if (Object.keys(errs).length > 0) {
      toast.error('Please fix the errors before submitting')
      return
    }
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))
    const id = 'c' + Date.now()
    onAdd({
      id,
      name: form.name.trim(),
      company: form.company.trim(),
      email: form.email.trim(),
      phone: form.phone,
      website: form.website,
      revenue: parseInt(form.revenue) || 0,
      since: new Date().toISOString().split('T')[0],
      industry: form.industry,
      location: form.location,
      notes: form.notes,
      avatarColor:
        avatarColors[Math.floor(Math.random() * avatarColors.length)],
    })
    toast.success('Client added', {
      description: `${form.company} has been added to your client roster.`,
    })
  }

  const inputCls = (field: keyof FormErrors) =>
    cn(
      inputBase,
      touched[field] && errors[field]
        ? 'border-danger focus:border-danger focus:shadow-[0_0_0_3px_hsl(var(--danger)/0.18)]'
        : 'border-border-default focus:border-accent focus:shadow-focus'
    )

  const baseCls = cn(
    inputBase,
    'border-border-default focus:border-accent focus:shadow-focus'
  )

  const Field = ({
    label,
    field,
    required,
    children,
  }: {
    label: string
    field?: keyof FormErrors
    required?: boolean
    children: React.ReactNode
  }) => (
    <div className="space-y-1.5">
      <label className="text-[12px] font-medium text-text-secondary tracking-[-0.005em]">
        {label}
        {required && <span className="text-danger ml-0.5">*</span>}
      </label>
      {children}
      {field && touched[field] && errors[field] && (
        <div className="flex items-center gap-1.5 text-[11.5px] text-danger">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          {errors[field]}
        </div>
      )}
    </div>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={cn(
          'relative w-full sm:max-w-lg max-h-[92vh] overflow-y-auto',
          'bg-surface-1 border border-border-default',
          'rounded-t-2xl sm:rounded-2xl shadow-xl'
        )}
      >
        <div className="sticky top-0 bg-surface-1 flex items-center justify-between px-6 py-4 border-b border-border-subtle rounded-t-2xl z-10">
          <div>
            <h2 className="text-[16px] font-semibold text-text-primary tracking-[-0.015em]">
              Add New Client
            </h2>
            <p className="text-[12px] text-text-tertiary mt-0.5">
              Fields marked with * are required
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-md flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-surface-2 transition-colors duration-base"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Contact name" field="name" required>
              <input
                className={inputCls('name')}
                placeholder="Jane Smith"
                value={form.name}
                onChange={e => set('name', e.target.value)}
                onBlur={() => {
                  touch('name')
                  validate(form)
                }}
              />
            </Field>
            <Field label="Company name" field="company" required>
              <input
                className={inputCls('company')}
                placeholder="Acme Corp"
                value={form.company}
                onChange={e => set('company', e.target.value)}
                onBlur={() => {
                  touch('company')
                  validate(form)
                }}
              />
            </Field>
          </div>
          <Field label="Email address" field="email" required>
            <input
              type="email"
              className={inputCls('email')}
              placeholder="jane@acme.com"
              value={form.email}
              onChange={e => set('email', e.target.value)}
              onBlur={() => {
                touch('email')
                validate(form)
              }}
            />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Phone">
              <input
                className={baseCls}
                placeholder="+1 (555) 000-0000"
                value={form.phone}
                onChange={e => set('phone', e.target.value)}
              />
            </Field>
            <Field label="Website">
              <input
                className={baseCls}
                placeholder="acme.com"
                value={form.website}
                onChange={e => set('website', e.target.value)}
              />
            </Field>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Revenue ($)" field="revenue">
              <input
                type="number"
                min="0"
                className={inputCls('revenue')}
                placeholder="25,000"
                value={form.revenue}
                onChange={e => set('revenue', e.target.value)}
                onBlur={() => {
                  touch('revenue')
                  validate(form)
                }}
              />
            </Field>
            <Field label="Industry">
              <select
                className={baseCls}
                value={form.industry}
                onChange={e => set('industry', e.target.value)}
              >
                {industries.map(i => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Location">
            <input
              className={baseCls}
              placeholder="San Francisco, CA"
              value={form.location}
              onChange={e => set('location', e.target.value)}
            />
          </Field>
          <Field label="Notes">
            <textarea
              className={cn(
                'w-full px-3 py-2.5 text-[13.5px] rounded-md resize-none',
                'bg-surface-inset text-text-primary placeholder:text-text-tertiary',
                'border border-border-default',
                'transition-[background-color,border-color,box-shadow] duration-base',
                'hover:border-border-strong',
                'focus:outline-none focus:border-accent focus:shadow-focus focus:bg-surface-1'
              )}
              rows={3}
              placeholder="Any relevant details..."
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
            />
          </Field>
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className={cn(
                'flex-1 h-10 rounded-md text-[13px] font-medium',
                'bg-surface-1 text-text-primary',
                'border border-border-default',
                'hover:bg-surface-2 hover:border-border-strong',
                'transition-all duration-base'
              )}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={cn(
                'flex-1 h-10 rounded-md text-[13px] font-medium text-white',
                'flex items-center justify-center gap-2',
                'bg-[linear-gradient(180deg,hsl(var(--accent))_0%,hsl(var(--accent-hover))_100%)]',
                'shadow-[inset_0_1px_0_rgb(255_255_255_/_0.16),0_1px_2px_rgb(0_0_0_/_0.20),0_0_0_1px_hsl(var(--accent-hover))]',
                'hover:brightness-[1.06]',
                'transition-all duration-base',
                'disabled:opacity-70'
              )}
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Client'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
