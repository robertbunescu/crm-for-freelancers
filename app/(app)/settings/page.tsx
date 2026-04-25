'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useTheme } from 'next-themes'
import {
  Camera,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Monitor,
  Check,
  Loader2,
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { PageContainer } from '@/components/layout/PageContainer'
import { Button } from '@/components/ui/button'
import {
  SettingsNav,
  type SettingsSection,
} from '@/components/settings/SettingsNav'
import {
  SettingsCard,
  SettingsField,
  settingsInputCls,
} from '@/components/settings/SettingsField'
import { cn } from '@/lib/utils'

interface ProfileState {
  firstName: string
  lastName: string
  email: string
  jobTitle: string
  bio: string
  timezone: string
  language: string
}

interface WorkspaceState {
  name: string
  slug: string
  currency: string
  industry: string
}

interface NotificationState {
  emailDigest: boolean
  emailMentions: boolean
  emailDealUpdates: boolean
  inAppActivity: boolean
  inAppReminders: boolean
}

const timezones = [
  'UTC',
  'America/New_York',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Asia/Singapore',
]

const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD']
const industries = [
  'Technology',
  'Finance',
  'Design',
  'Consulting',
  'Healthcare',
  'E-commerce',
  'Other',
]

function getInitials(first: string, last: string) {
  return `${first[0] ?? ''}${last[0] ?? ''}`.toUpperCase()
}

export default function SettingsPage() {
  const [section, setSection] = useState<SettingsSection>('profile')

  // Sync section with hash if present (e.g. /settings#workspace)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const hash = window.location.hash.replace('#', '') as SettingsSection
    const valid: SettingsSection[] = [
      'profile',
      'password',
      'workspace',
      'notifications',
      'billing',
      'danger',
    ]
    if (valid.includes(hash)) setSection(hash)
  }, [])

  const handleSectionChange = (id: SettingsSection) => {
    setSection(id)
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `#${id}`)
    }
  }

  return (
    <div className="flex flex-col flex-1">
      <Header
        title="Settings"
        subtitle="Manage your account, workspace, and preferences"
      />
      <PageContainer>
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6 lg:gap-10">
          <aside className="lg:sticky lg:top-[72px] self-start min-w-0">
            <SettingsNav active={section} onChange={handleSectionChange} />
          </aside>
          <div className="min-w-0 space-y-6">
            {section === 'profile' && <ProfileSection />}
            {section === 'password' && <PasswordSection />}
            {section === 'workspace' && <WorkspaceSection />}
            {section === 'notifications' && <NotificationsSection />}
            {section === 'billing' && <BillingSection />}
            {section === 'danger' && <DangerSection />}
          </div>
        </div>
      </PageContainer>
    </div>
  )
}

/* ------------------------------ PROFILE ----------------------------------- */

function ProfileSection() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const [profile, setProfile] = useState<ProfileState>({
    firstName: 'Alex',
    lastName: 'Kim',
    email: 'alex@nexuscrm.io',
    jobTitle: 'Operations Lead',
    bio: 'Building a calmer, sharper way to run a freelance practice.',
    timezone: 'America/New_York',
    language: 'English',
  })
  const [saving, setSaving] = useState(false)

  const set = <K extends keyof ProfileState>(key: K, value: ProfileState[K]) =>
    setProfile(p => ({ ...p, [key]: value }))

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 700))
    setSaving(false)
    toast.success('Profile updated', {
      description: 'Your changes have been saved.',
    })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <SettingsCard
        title="Profile"
        description="This information will be displayed publicly across your workspace."
        footer={
          <>
            <Button variant="secondary" size="sm">
              Reset
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Saving
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Save changes
                </>
              )}
            </Button>
          </>
        }
      >
        {/* Avatar block */}
        <div className="flex items-center gap-5 pb-6 mb-6 border-b border-border-subtle">
          <div className="relative group">
            <div
              className="w-[72px] h-[72px] rounded-full flex items-center justify-center text-[22px] font-bold text-white"
              style={{
                background:
                  'linear-gradient(135deg, hsl(var(--accent)) 0%, hsl(var(--accent-hover)) 100%)',
                boxShadow:
                  'inset 0 1px 0 rgb(255 255 255 / 0.16), 0 0 0 1px hsl(var(--accent-hover))',
              }}
            >
              {getInitials(profile.firstName, profile.lastName)}
            </div>
            <button
              type="button"
              onClick={() =>
                toast.message('Avatar upload', {
                  description: 'Drag-and-drop upload coming soon.',
                })
              }
              className={cn(
                'absolute inset-0 rounded-full flex items-center justify-center',
                'bg-black/0 group-hover:bg-black/40 backdrop-blur-0 group-hover:backdrop-blur-[2px]',
                'opacity-0 group-hover:opacity-100',
                'transition-all duration-base'
              )}
              aria-label="Change avatar"
            >
              <Camera className="w-5 h-5 text-white" />
            </button>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-semibold text-text-primary tracking-[-0.005em]">
              Profile photo
            </p>
            <p className="text-[12px] text-text-tertiary mt-1 leading-relaxed max-w-md">
              JPG, PNG, or GIF. 1MB max. Square images work best.
            </p>
            <div className="flex items-center gap-2 mt-3">
              <Button variant="secondary" size="xs">
                Upload
              </Button>
              <Button variant="ghost" size="xs">
                Remove
              </Button>
            </div>
          </div>
        </div>

        {/* Name + email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SettingsField label="First name" htmlFor="firstName" required>
            <input
              id="firstName"
              className={settingsInputCls()}
              value={profile.firstName}
              onChange={e => set('firstName', e.target.value)}
            />
          </SettingsField>
          <SettingsField label="Last name" htmlFor="lastName" required>
            <input
              id="lastName"
              className={settingsInputCls()}
              value={profile.lastName}
              onChange={e => set('lastName', e.target.value)}
            />
          </SettingsField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <SettingsField
            label="Email address"
            htmlFor="email"
            required
            hint="We'll send a verification link if this changes."
          >
            <input
              id="email"
              type="email"
              className={settingsInputCls()}
              value={profile.email}
              onChange={e => set('email', e.target.value)}
            />
          </SettingsField>
          <SettingsField label="Job title" htmlFor="jobTitle">
            <input
              id="jobTitle"
              className={settingsInputCls()}
              value={profile.jobTitle}
              placeholder="e.g. Operations Lead"
              onChange={e => set('jobTitle', e.target.value)}
            />
          </SettingsField>
        </div>

        <div className="mt-4">
          <SettingsField label="Bio" htmlFor="bio" hint="Maximum 240 characters.">
            <textarea
              id="bio"
              rows={3}
              maxLength={240}
              className={cn(
                settingsInputCls(),
                'h-auto py-2.5 resize-none leading-relaxed'
              )}
              value={profile.bio}
              onChange={e => set('bio', e.target.value)}
            />
          </SettingsField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <SettingsField label="Timezone" htmlFor="timezone">
            <select
              id="timezone"
              className={settingsInputCls('appearance-none pr-8')}
              value={profile.timezone}
              onChange={e => set('timezone', e.target.value)}
            >
              {timezones.map(tz => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          </SettingsField>
          <SettingsField label="Language" htmlFor="language">
            <select
              id="language"
              className={settingsInputCls('appearance-none pr-8')}
              value={profile.language}
              onChange={e => set('language', e.target.value)}
            >
              {['English', 'Spanish', 'German', 'French', 'Japanese'].map(l => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </SettingsField>
        </div>
      </SettingsCard>

      {/* Appearance */}
      <SettingsCard
        title="Appearance"
        description="Switch between light, dark, or follow your system preference."
      >
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'light', label: 'Light', icon: Sun },
            { id: 'dark', label: 'Dark', icon: Moon },
            { id: 'system', label: 'System', icon: Monitor },
          ].map(({ id, label, icon: Icon }) => {
            const selected = mounted && theme === id
            return (
              <button
                key={id}
                type="button"
                onClick={() => setTheme(id)}
                className={cn(
                  'relative flex flex-col items-start gap-3 p-4 rounded-lg text-left',
                  'border transition-all duration-base ease-out-expo',
                  selected
                    ? 'border-accent shadow-focus bg-accent-soft/40'
                    : 'border-border-default hover:border-border-strong hover:bg-surface-2/40'
                )}
              >
                <div
                  className={cn(
                    'w-8 h-8 rounded-md flex items-center justify-center',
                    selected
                      ? 'bg-accent text-white'
                      : 'bg-surface-2 text-text-secondary'
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div
                    className={cn(
                      'text-[13px] font-medium tracking-[-0.005em]',
                      selected ? 'text-accent' : 'text-text-primary'
                    )}
                  >
                    {label}
                  </div>
                  <div className="text-[11.5px] text-text-tertiary mt-0.5">
                    {id === 'system'
                      ? 'Follow OS preference'
                      : `Use ${label.toLowerCase()} theme`}
                  </div>
                </div>
                {selected && (
                  <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-accent flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </SettingsCard>
    </div>
  )
}

/* ----------------------------- PASSWORD ----------------------------------- */

function PasswordSection() {
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNext, setShowNext] = useState(false)
  const [saving, setSaving] = useState(false)

  const strength = passwordStrength(next)
  const mismatch = confirm.length > 0 && next !== confirm

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!current || !next || next !== confirm) {
      toast.error('Please complete all fields and ensure passwords match.')
      return
    }
    setSaving(true)
    await new Promise(r => setTimeout(r, 800))
    setSaving(false)
    setCurrent('')
    setNext('')
    setConfirm('')
    toast.success('Password updated', {
      description: 'Use your new password the next time you sign in.',
    })
  }

  return (
    <div className="animate-fade-in">
      <SettingsCard
        title="Change password"
        description="Use a strong password — at least 12 characters with mixed case, numbers, and symbols."
        footer={
          <>
            <Button variant="secondary" size="sm" type="button">
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSubmit}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Updating
                </>
              ) : (
                'Update password'
              )}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <SettingsField label="Current password" htmlFor="currentPw" required>
            <div className="relative">
              <input
                id="currentPw"
                type={showCurrent ? 'text' : 'password'}
                className={settingsInputCls('pr-10')}
                value={current}
                onChange={e => setCurrent(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary transition-colors"
                aria-label="Toggle password visibility"
              >
                {showCurrent ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </SettingsField>

          <SettingsField label="New password" htmlFor="newPw" required>
            <div className="relative">
              <input
                id="newPw"
                type={showNext ? 'text' : 'password'}
                className={settingsInputCls('pr-10')}
                value={next}
                onChange={e => setNext(e.target.value)}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowNext(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary transition-colors"
                aria-label="Toggle password visibility"
              >
                {showNext ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {next.length > 0 && (
              <div className="space-y-1.5 mt-2">
                <div className="flex items-center gap-1.5">
                  {[0, 1, 2, 3].map(i => (
                    <div
                      key={i}
                      className={cn(
                        'h-1 flex-1 rounded-full transition-all duration-base',
                        i < strength.score
                          ? strength.color
                          : 'bg-surface-2'
                      )}
                    />
                  ))}
                </div>
                <p
                  className={cn(
                    'text-[11.5px] font-medium',
                    strength.textColor
                  )}
                >
                  {strength.label}
                </p>
              </div>
            )}
          </SettingsField>

          <SettingsField label="Confirm new password" htmlFor="confirmPw" required>
            <input
              id="confirmPw"
              type="password"
              className={cn(
                settingsInputCls(),
                mismatch &&
                  'border-danger focus:border-danger focus:shadow-[0_0_0_3px_hsl(var(--danger)/0.18)]'
              )}
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              autoComplete="new-password"
            />
            {mismatch && (
              <p className="text-[11.5px] text-danger mt-1.5">
                Passwords don&apos;t match.
              </p>
            )}
          </SettingsField>
        </form>
      </SettingsCard>
    </div>
  )
}

function passwordStrength(pw: string) {
  let score = 0
  if (pw.length >= 8) score++
  if (pw.length >= 12) score++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++
  if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) score++
  const labels = ['Very weak', 'Weak', 'Fair', 'Strong', 'Excellent']
  const colors = [
    'bg-danger',
    'bg-warning',
    'bg-warning',
    'bg-success',
    'bg-success',
  ]
  const textColors = [
    'text-danger',
    'text-warning',
    'text-warning',
    'text-success',
    'text-success',
  ]
  return {
    score,
    label: labels[score],
    color: colors[Math.max(0, score - 1)],
    textColor: textColors[score],
  }
}

/* ----------------------------- WORKSPACE ---------------------------------- */

function WorkspaceSection() {
  const [workspace, setWorkspace] = useState<WorkspaceState>({
    name: 'Nexus Studio',
    slug: 'nexus-studio',
    currency: 'USD',
    industry: 'Design',
  })
  const [saving, setSaving] = useState(false)

  const set = <K extends keyof WorkspaceState>(
    key: K,
    value: WorkspaceState[K]
  ) => setWorkspace(w => ({ ...w, [key]: value }))

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 600))
    setSaving(false)
    toast.success('Workspace updated')
  }

  return (
    <div className="animate-fade-in space-y-6">
      <SettingsCard
        title="Workspace"
        description="Branding and defaults that apply to every member of your workspace."
        footer={
          <>
            <Button variant="secondary" size="sm">
              Reset
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Saving
                </>
              ) : (
                'Save workspace'
              )}
            </Button>
          </>
        }
      >
        {/* Logo */}
        <div className="flex items-center gap-5 pb-6 mb-6 border-b border-border-subtle">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center"
            style={{
              background:
                'linear-gradient(135deg, hsl(var(--accent)) 0%, hsl(var(--accent-hover)) 100%)',
              boxShadow:
                'inset 0 1px 0 rgb(255 255 255 / 0.16), 0 0 0 1px hsl(var(--accent-hover))',
            }}
          >
            <div className="w-6 h-6 rounded-md bg-white/95" />
          </div>
          <div className="flex-1">
            <p className="text-[14px] font-semibold text-text-primary tracking-[-0.005em]">
              Workspace logo
            </p>
            <p className="text-[12px] text-text-tertiary mt-1">
              SVG or PNG. Recommended 256×256.
            </p>
            <div className="flex items-center gap-2 mt-3">
              <Button variant="secondary" size="xs">
                Upload logo
              </Button>
              <Button variant="ghost" size="xs">
                Remove
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SettingsField label="Workspace name" required htmlFor="wsName">
            <input
              id="wsName"
              className={settingsInputCls()}
              value={workspace.name}
              onChange={e => set('name', e.target.value)}
            />
          </SettingsField>
          <SettingsField
            label="Workspace URL"
            htmlFor="wsSlug"
            hint="Your workspace will be available at this address."
          >
            <div className="flex h-10 rounded-md border border-border-default bg-surface-inset focus-within:border-accent focus-within:shadow-focus focus-within:bg-surface-1 transition-[background-color,border-color,box-shadow] duration-base overflow-hidden">
              <span className="px-3 inline-flex items-center text-[12.5px] text-text-tertiary border-r border-border-subtle bg-surface-2/40">
                nexuscrm.io/
              </span>
              <input
                id="wsSlug"
                className="flex-1 px-3 text-[13.5px] bg-transparent text-text-primary placeholder:text-text-tertiary focus:outline-none"
                value={workspace.slug}
                onChange={e =>
                  set(
                    'slug',
                    e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9-]/g, '-')
                  )
                }
              />
            </div>
          </SettingsField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <SettingsField label="Default currency" htmlFor="wsCurrency">
            <select
              id="wsCurrency"
              className={settingsInputCls('appearance-none pr-8')}
              value={workspace.currency}
              onChange={e => set('currency', e.target.value)}
            >
              {currencies.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </SettingsField>
          <SettingsField label="Industry" htmlFor="wsIndustry">
            <select
              id="wsIndustry"
              className={settingsInputCls('appearance-none pr-8')}
              value={workspace.industry}
              onChange={e => set('industry', e.target.value)}
            >
              {industries.map(i => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
          </SettingsField>
        </div>
      </SettingsCard>

      <SettingsCard
        title="Team members"
        description="Invite collaborators to share leads, clients, and deal updates."
      >
        <div className="space-y-2">
          {[
            { name: 'Alex Kim', email: 'alex@nexuscrm.io', role: 'Owner' },
            {
              name: 'Jordan Reyes',
              email: 'jordan@nexuscrm.io',
              role: 'Admin',
            },
            { name: 'Sam Patel', email: 'sam@nexuscrm.io', role: 'Member' },
          ].map(member => (
            <div
              key={member.email}
              className={cn(
                'flex items-center gap-3 p-3 rounded-lg',
                'border border-border-subtle',
                'transition-colors duration-base hover:bg-surface-2/40'
              )}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
                style={{
                  background:
                    'linear-gradient(135deg, hsl(var(--accent)) 0%, hsl(var(--accent-hover)) 100%)',
                  boxShadow: 'inset 0 1px 0 rgb(255 255 255 / 0.16)',
                }}
              >
                {getInitials(
                  member.name.split(' ')[0],
                  member.name.split(' ')[1] ?? ''
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-medium text-text-primary truncate">
                  {member.name}
                </div>
                <div className="text-[11.5px] text-text-tertiary truncate">
                  {member.email}
                </div>
              </div>
              <span className="inline-flex items-center h-5 px-1.5 rounded-sm text-[10.5px] font-semibold bg-surface-2 text-text-secondary">
                {member.role}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Button variant="secondary" size="sm">
            Invite team member
          </Button>
        </div>
      </SettingsCard>
    </div>
  )
}

/* --------------------------- NOTIFICATIONS -------------------------------- */

function NotificationsSection() {
  const [prefs, setPrefs] = useState<NotificationState>({
    emailDigest: true,
    emailMentions: true,
    emailDealUpdates: false,
    inAppActivity: true,
    inAppReminders: true,
  })

  const toggle = (key: keyof NotificationState) =>
    setPrefs(p => ({ ...p, [key]: !p[key] }))

  return (
    <div className="animate-fade-in space-y-6">
      <SettingsCard
        title="Email notifications"
        description="Decide which updates land in your inbox."
      >
        <div className="divide-y divide-border-subtle">
          <ToggleRow
            label="Weekly digest"
            description="A Monday morning summary of your pipeline and revenue."
            checked={prefs.emailDigest}
            onChange={() => toggle('emailDigest')}
          />
          <ToggleRow
            label="Mentions & comments"
            description="When a teammate @mentions you in a deal or task."
            checked={prefs.emailMentions}
            onChange={() => toggle('emailMentions')}
          />
          <ToggleRow
            label="Deal stage changes"
            description="Whenever a lead moves stage in your pipeline."
            checked={prefs.emailDealUpdates}
            onChange={() => toggle('emailDealUpdates')}
          />
        </div>
      </SettingsCard>

      <SettingsCard
        title="In-app notifications"
        description="What you see in your bell menu and live indicators."
      >
        <div className="divide-y divide-border-subtle">
          <ToggleRow
            label="Activity feed"
            description="New activity from leads and clients."
            checked={prefs.inAppActivity}
            onChange={() => toggle('inAppActivity')}
          />
          <ToggleRow
            label="Task reminders"
            description="Nudges before your tasks are due."
            checked={prefs.inAppReminders}
            onChange={() => toggle('inAppReminders')}
          />
        </div>
      </SettingsCard>
    </div>
  )
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description: string
  checked: boolean
  onChange: () => void
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0">
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-text-primary tracking-[-0.005em]">
          {label}
        </p>
        <p className="text-[12px] text-text-tertiary mt-0.5 leading-relaxed">
          {description}
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={cn(
          'relative w-9 h-5 rounded-full flex-shrink-0',
          'transition-all duration-base ease-out-expo',
          'focus:outline-none focus-visible:shadow-focus',
          checked
            ? 'bg-[linear-gradient(180deg,hsl(var(--accent))_0%,hsl(var(--accent-hover))_100%)] shadow-[inset_0_1px_0_rgb(255_255_255_/_0.16),0_0_0_1px_hsl(var(--accent-hover))]'
            : 'bg-surface-3 shadow-[inset_0_0_0_1px_rgb(var(--border-default))]'
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm',
            'transition-transform duration-base ease-out-expo',
            checked ? 'translate-x-[18px]' : 'translate-x-0.5'
          )}
        />
      </button>
    </div>
  )
}

/* ------------------------------ BILLING ----------------------------------- */

function BillingSection() {
  return (
    <div className="animate-fade-in space-y-6">
      <SettingsCard
        title="Current plan"
        description="Manage your subscription and payment methods."
      >
        <div
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-lg border border-border-default"
          style={{
            background:
              'linear-gradient(135deg, hsl(var(--accent) / 0.06) 0%, transparent 60%)',
          }}
        >
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-[15px] font-semibold text-text-primary tracking-[-0.01em]">
                Pro
              </h4>
              <span className="inline-flex items-center h-5 px-1.5 rounded-sm text-[10.5px] font-semibold bg-accent-soft text-accent">
                Current
              </span>
            </div>
            <p className="text-[12.5px] text-text-tertiary mt-1.5 leading-relaxed">
              Unlimited leads, advanced reports, and 5 seats.
            </p>
            <p className="font-mono tabular text-[20px] font-semibold text-text-primary mt-3 tracking-[-0.02em]">
              $29
              <span className="text-[12px] text-text-tertiary font-normal ml-1">
                /month
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm">
              Manage plan
            </Button>
            <Button variant="ghost" size="sm">
              View invoices
            </Button>
          </div>
        </div>

        <div className="mt-5 pt-5 border-t border-border-subtle">
          <p className="text-[12px] font-medium text-text-secondary mb-3">
            Payment method
          </p>
          <div className="flex items-center gap-3 p-3 rounded-lg border border-border-subtle">
            <div className="w-10 h-7 rounded-sm bg-surface-2 border border-border-subtle flex items-center justify-center">
              <span className="text-[10px] font-bold text-text-secondary tracking-widest">
                VISA
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-text-primary font-mono tabular">
                •••• •••• •••• 4242
              </p>
              <p className="text-[11.5px] text-text-tertiary mt-0.5">
                Expires 12 / 2027
              </p>
            </div>
            <Button variant="ghost" size="xs">
              Update
            </Button>
          </div>
        </div>
      </SettingsCard>
    </div>
  )
}

/* ------------------------------ DANGER ------------------------------------ */

function DangerSection() {
  const [confirming, setConfirming] = useState(false)
  const [confirmText, setConfirmText] = useState('')

  const canDelete = confirmText === 'DELETE'

  const handleDelete = () => {
    toast.error('Account deletion blocked', {
      description: 'This is a demo workspace — nothing was deleted.',
    })
    setConfirming(false)
    setConfirmText('')
  }

  return (
    <div className="animate-fade-in">
      <SettingsCard
        tone="danger"
        title="Danger zone"
        description="Irreversible actions. Proceed with care."
      >
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border border-[hsl(var(--danger)/0.2)] bg-[hsl(var(--danger)/0.04)]">
            <div>
              <p className="text-[13px] font-semibold text-text-primary">
                Export workspace data
              </p>
              <p className="text-[12px] text-text-tertiary mt-0.5">
                Download a CSV archive of all leads, clients, and tasks.
              </p>
            </div>
            <Button variant="secondary" size="sm">
              Export
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border border-[hsl(var(--danger)/0.2)] bg-[hsl(var(--danger)/0.04)]">
            <div>
              <p className="text-[13px] font-semibold text-danger">
                Delete account
              </p>
              <p className="text-[12px] text-text-tertiary mt-0.5">
                Permanently remove your account and all workspace data.
              </p>
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setConfirming(c => !c)}
            >
              {confirming ? 'Cancel' : 'Delete account'}
            </Button>
          </div>

          {confirming && (
            <div className="p-4 rounded-lg border border-danger/40 bg-danger-soft animate-slide-up">
              <p className="text-[12.5px] text-text-primary leading-relaxed">
                Type <span className="font-mono font-semibold">DELETE</span> to
                confirm. This action cannot be undone.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 mt-3">
                <input
                  className={settingsInputCls('flex-1')}
                  placeholder="DELETE"
                  value={confirmText}
                  onChange={e => setConfirmText(e.target.value)}
                  autoFocus
                />
                <Button
                  variant="danger"
                  size="sm"
                  disabled={!canDelete}
                  onClick={handleDelete}
                >
                  Permanently delete
                </Button>
              </div>
            </div>
          )}
        </div>
      </SettingsCard>
    </div>
  )
}
