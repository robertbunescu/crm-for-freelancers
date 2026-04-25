'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  GitBranch,
  Building2,
  SquareCheck as CheckSquare,
  LogOut,
  Settings,
  CircleHelp as HelpCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/leads', label: 'Leads', icon: Users },
  { href: '/pipeline', label: 'Pipeline', icon: GitBranch },
  { href: '/clients', label: 'Clients', icon: Building2 },
  { href: '/tasks', label: 'Tasks', icon: CheckSquare },
]

const bottomItems = [
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '#', label: 'Help & docs', icon: HelpCircle },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <aside
      className={cn(
        'hidden lg:flex fixed left-0 top-0 h-full w-[232px] z-30 flex-col',
        'bg-bg-sidebar border-r border-border-subtle',
        'backdrop-blur-xl'
      )}
    >
      {/* Brand */}
      <div className="h-14 px-4 flex items-center border-b border-border-subtle flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-[7px] flex items-center justify-center flex-shrink-0"
            style={{
              background:
                'linear-gradient(135deg, hsl(var(--accent)) 0%, hsl(var(--accent-hover)) 100%)',
              boxShadow:
                'inset 0 1px 0 rgb(255 255 255 / 0.16), 0 0 0 1px hsl(var(--accent-hover))',
            }}
          >
            <div className="w-3 h-3 rounded-[3px] bg-white/95" />
          </div>
          <span className="text-text-primary font-semibold text-[14px] tracking-[-0.015em] select-none">
            Nexus CRM
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        <div className="px-2.5 pb-1.5">
          <span className="text-micro text-text-tertiary uppercase">
            Main menu
          </span>
        </div>

        {navItems.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href ||
            (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'relative flex items-center gap-2.5 px-2.5 h-8 rounded-md',
                'text-[13px] font-medium tracking-[-0.005em]',
                'transition-colors duration-base ease-out-expo',
                active
                  ? 'text-text-primary bg-surface-2 shadow-xs'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-2/70'
              )}
            >
              {active && (
                <span
                  aria-hidden
                  className="absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-r-sm bg-accent"
                />
              )}
              <Icon
                className={cn(
                  'w-4 h-4 flex-shrink-0',
                  active ? 'text-accent' : 'opacity-90'
                )}
              />
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Secondary */}
      <div className="px-2 py-2 space-y-0.5 border-t border-border-subtle">
        {bottomItems.map(({ href, label, icon: Icon }) => {
          const active = href !== '#' && pathname.startsWith(href)
          return (
            <Link
              key={label}
              href={href}
              className={cn(
                'relative flex items-center gap-2.5 px-2.5 h-8 rounded-md',
                'text-[13px] font-medium tracking-[-0.005em]',
                'transition-colors duration-base ease-out-expo',
                active
                  ? 'text-text-primary bg-surface-2 shadow-xs'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-2/70'
              )}
            >
              {active && (
                <span
                  aria-hidden
                  className="absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-r-sm bg-accent"
                />
              )}
              <Icon
                className={cn(
                  'w-4 h-4 flex-shrink-0',
                  active ? 'text-accent' : 'opacity-80'
                )}
              />
              <span>{label}</span>
            </Link>
          )
        })}
        <button
          onClick={() => router.push('/')}
          className={cn(
            'w-full flex items-center gap-2.5 px-2.5 h-8 rounded-md',
            'text-[13px] font-medium text-text-secondary',
            'hover:text-danger hover:bg-danger-soft',
            'transition-colors duration-base'
          )}
        >
          <LogOut className="w-4 h-4 flex-shrink-0 opacity-80" />
          <span>Sign out</span>
        </button>
      </div>

      {/* User */}
      <div className="px-3 py-3 border-t border-border-subtle">
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
            style={{
              background:
                'linear-gradient(135deg, hsl(var(--accent)) 0%, hsl(var(--accent-hover)) 100%)',
              boxShadow:
                'inset 0 1px 0 rgb(255 255 255 / 0.16), 0 0 0 1px hsl(var(--accent-hover))',
            }}
          >
            AK
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12.5px] font-medium text-text-primary truncate">
              Alex Kim
            </div>
            <div className="text-[11px] text-text-tertiary truncate">
              alex@nexuscrm.io
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
