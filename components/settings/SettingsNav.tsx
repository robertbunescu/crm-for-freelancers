'use client'

import { cn } from '@/lib/utils'
import {
  User,
  Lock,
  Building2,
  Bell,
  CreditCard,
  AlertTriangle,
} from 'lucide-react'

export type SettingsSection =
  | 'profile'
  | 'password'
  | 'workspace'
  | 'notifications'
  | 'billing'
  | 'danger'

const items: {
  id: SettingsSection
  label: string
  description: string
  icon: typeof User
}[] = [
  {
    id: 'profile',
    label: 'Profile',
    description: 'Personal information',
    icon: User,
  },
  {
    id: 'password',
    label: 'Password',
    description: 'Update credentials',
    icon: Lock,
  },
  {
    id: 'workspace',
    label: 'Workspace',
    description: 'Team & branding',
    icon: Building2,
  },
  {
    id: 'notifications',
    label: 'Notifications',
    description: 'Email & in-app',
    icon: Bell,
  },
  {
    id: 'billing',
    label: 'Billing & plan',
    description: 'Subscription',
    icon: CreditCard,
  },
  {
    id: 'danger',
    label: 'Danger zone',
    description: 'Delete account',
    icon: AlertTriangle,
  },
]

interface SettingsNavProps {
  active: SettingsSection
  onChange: (id: SettingsSection) => void
}

export function SettingsNav({ active, onChange }: SettingsNavProps) {
  return (
    <>
      {/* Mobile: horizontal segmented nav */}
      <nav className="lg:hidden -mx-4 sm:-mx-6 px-4 sm:px-6 overflow-x-auto pb-1 mb-1">
        <div className="inline-flex gap-1 p-1 rounded-lg border border-border-subtle bg-surface-2/40">
          {items.map(({ id, label, icon: Icon }) => {
            const isActive = active === id
            const isDanger = id === 'danger'
            return (
              <button
                key={id}
                onClick={() => onChange(id)}
                className={cn(
                  'inline-flex items-center gap-1.5 h-8 px-3 rounded-md whitespace-nowrap',
                  'text-[12.5px] font-medium tracking-[-0.005em]',
                  'transition-all duration-base',
                  isActive
                    ? isDanger
                      ? 'bg-danger-soft text-danger shadow-xs'
                      : 'bg-surface-1 text-text-primary shadow-xs'
                    : 'text-text-secondary hover:text-text-primary'
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            )
          })}
        </div>
      </nav>

      {/* Desktop: vertical nav */}
      <nav className="hidden lg:flex flex-col gap-0.5">
      <div className="px-2.5 pb-1.5">
        <span className="text-micro text-text-tertiary uppercase">
          Settings
        </span>
      </div>
      {items.map(({ id, label, description, icon: Icon }) => {
        const isActive = active === id
        const isDanger = id === 'danger'
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={cn(
              'relative w-full flex items-center gap-3 px-2.5 py-2 rounded-md text-left',
              'transition-colors duration-base ease-out-expo',
              'group',
              isActive
                ? 'bg-surface-2 shadow-xs'
                : 'hover:bg-surface-2/70'
            )}
          >
            {isActive && (
              <span
                aria-hidden
                className={cn(
                  'absolute left-0 top-2 bottom-2 w-[2px] rounded-r-sm',
                  isDanger ? 'bg-danger' : 'bg-accent'
                )}
              />
            )}
            <div
              className={cn(
                'w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0',
                'transition-colors duration-base',
                isActive
                  ? isDanger
                    ? 'bg-danger-soft text-danger'
                    : 'bg-accent-soft text-accent'
                  : 'bg-surface-2 text-text-tertiary group-hover:text-text-secondary'
              )}
            >
              <Icon className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div
                className={cn(
                  'text-[13px] font-medium leading-tight tracking-[-0.005em]',
                  isActive
                    ? isDanger
                      ? 'text-danger'
                      : 'text-text-primary'
                    : 'text-text-secondary group-hover:text-text-primary'
                )}
              >
                {label}
              </div>
              <div className="text-[11px] text-text-tertiary mt-0.5 truncate">
                {description}
              </div>
            </div>
          </button>
        )
      })}
      </nav>
    </>
  )
}
