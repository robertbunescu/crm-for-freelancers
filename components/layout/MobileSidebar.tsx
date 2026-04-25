'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  GitBranch,
  Building2,
  SquareCheck as CheckSquare,
  Settings,
  LogOut,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/leads', label: 'Leads', icon: Users },
  { href: '/pipeline', label: 'Pipeline', icon: GitBranch },
  { href: '/clients', label: 'Clients', icon: Building2 },
  { href: '/tasks', label: 'Tasks', icon: CheckSquare },
  { href: '/settings', label: 'Settings', icon: Settings },
]

interface MobileSidebarProps {
  open: boolean
  onClose: () => void
}

export function MobileSidebar({ open, onClose }: MobileSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <aside className="absolute left-0 top-0 h-full w-[280px] flex flex-col bg-bg-sidebar border-r border-border-subtle">
        <div className="h-16 flex items-center justify-between px-5 border-b border-border-subtle flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-[7px] flex items-center justify-center"
              style={{
                background:
                  'linear-gradient(135deg, hsl(var(--accent)) 0%, hsl(var(--accent-hover)) 100%)',
                boxShadow:
                  'inset 0 1px 0 rgb(255 255 255 / 0.16), 0 0 0 1px hsl(var(--accent-hover))',
              }}
            >
              <div className="w-3 h-3 rounded-[3px] bg-white/95" />
            </div>
            <span className="text-text-primary font-semibold text-[14px] tracking-[-0.015em]">
              Nexus CRM
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-md flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-surface-2 transition-colors duration-base"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active =
              pathname === href ||
              (href !== '/dashboard' && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'relative flex items-center gap-2.5 px-2.5 h-9 rounded-md',
                  'text-[13.5px] font-medium tracking-[-0.005em]',
                  'transition-colors duration-base',
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

        <div className="px-2 py-2 border-t border-border-subtle">
          <button
            onClick={() => router.push('/')}
            className="w-full flex items-center gap-2.5 px-2.5 h-9 rounded-md text-[13.5px] font-medium text-text-secondary hover:text-danger hover:bg-danger-soft transition-colors duration-base"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span>Sign out</span>
          </button>
        </div>

        <div className="px-4 py-4 border-t border-border-subtle">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-[11.5px] font-bold text-white flex-shrink-0"
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
              <div className="text-[13px] font-medium text-text-primary truncate">
                Alex Kim
              </div>
              <div className="text-[11.5px] text-text-tertiary truncate">
                alex@nexuscrm.io
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}
