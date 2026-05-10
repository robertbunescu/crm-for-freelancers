'use client'

import { useEffect, useRef, useState } from 'react'
import { Search, Bell, Sun, Moon, ChevronDown, Menu, UserPlus, CheckCheck } from 'lucide-react'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { useMobileMenu } from '@/contexts/MobileMenuContext'
import { useAuth } from '@/lib/auth-context'
import { cn } from '@/lib/utils'

interface Notification {
  id: string
  type: string
  title: string
  message: string
  read: boolean
  createdAt: string
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'Just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

interface HeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
  size?: 'default' | 'wide' | 'narrow'
}

const headerSizeMap = {
  default: 'max-w-[1280px]',
  wide: 'max-w-[1480px]',
  narrow: 'max-w-[860px]',
}

export function Header({ title, subtitle, action, size = 'default' }: HeaderProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const { userData } = useAuth()
  const [profileOpen, setProfileOpen] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { openMenu } = useMobileMenu()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [notifOpen, setNotifOpen] = useState(false)
  const notifRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter(n => !n.read).length

  const fetchNotifications = async () => {
    if (!userData?.id) return
    try {
      const res = await fetch(`/api/notifications?userId=${userData.id}`)
      if (res.ok) setNotifications(await res.json())
    } catch {}
  }

  const markAllRead = async () => {
    if (!userData?.id || unreadCount === 0) return
    try {
      await fetch('/api/notifications/read', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userData.id })
      })
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    } catch {}
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!userData?.id) return
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000)
    window.addEventListener('notification-updated', fetchNotifications)
    return () => {
      clearInterval(interval)
      window.removeEventListener('notification-updated', fetchNotifications)
    }
  }, [userData?.id])

  useEffect(() => {
    if (!notifOpen) return
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [notifOpen])

  useEffect(() => {
    if (!profileOpen) return
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [profileOpen])

  const isDark = resolvedTheme === 'dark'
  const userName = userData?.name || 'User'
  const userEmail = userData?.email || ''
  const initials = userName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <header
      className={cn(
        'h-14 flex items-center',
        'bg-bg-app/70 backdrop-blur-xl',
        'border-b border-border-subtle flex-shrink-0',
        'sticky top-0 z-20'
      )}
    >
    <div
      className={cn(
        'w-full mx-auto flex items-center justify-between',
        'px-4 sm:px-6 lg:px-8',
        headerSizeMap[size]
      )}
    >
      {/* Left — title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={openMenu}
          className="lg:hidden w-8 h-8 rounded-md flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-2 transition-colors duration-base"
          aria-label="Open menu"
        >
          <Menu className="w-4 h-4" />
        </button>
        <div className="min-w-0">
          <h1 className="text-[15px] font-semibold text-text-primary leading-[1.2] tracking-[-0.015em] truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[11.5px] text-text-tertiary mt-0.5 hidden sm:block truncate leading-snug">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right — controls */}
      <div className="flex items-center gap-1">
        {/* Search */}
        <div
          className={cn(
            'relative hidden sm:flex items-center transition-all duration-base ease-out-expo',
            searchFocused ? 'w-72' : 'w-56'
          )}
        >
          <Search className="absolute left-3 w-3.5 h-3.5 text-text-tertiary pointer-events-none" />
          <input
            type="text"
            placeholder="Search leads, clients, tasks..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className={cn(
              'w-full h-8 pl-9 pr-14 text-[13px] rounded-md',
              'bg-surface-inset text-text-primary placeholder:text-text-tertiary',
              'border border-border-default',
              'transition-[background-color,border-color,box-shadow] duration-base',
              'hover:border-border-strong',
              'focus:outline-none focus:border-accent focus:shadow-focus focus:bg-surface-1'
            )}
          />
          <kbd
            className={cn(
              'absolute right-2 h-5 px-1.5 rounded-sm',
              'flex items-center text-[10px] font-mono font-medium',
              'text-text-tertiary bg-surface-2',
              'border border-border-subtle',
              'pointer-events-none'
            )}
          >
            ⌘K
          </kbd>
        </div>

        {/* Theme toggle — mounted gate to avoid hydration mismatch */}
        <button
          onClick={() => mounted && setTheme(isDark ? 'light' : 'dark')}
          aria-label="Toggle theme"
          className={cn(
            'w-8 h-8 rounded-md flex items-center justify-center',
            'text-text-secondary hover:text-text-primary hover:bg-surface-2',
            'transition-colors duration-base'
          )}
        >
          {!mounted ? (
            <span className="w-4 h-4 block" aria-hidden />
          ) : isDark ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={async () => {
              if (!notifOpen) {
                await fetchNotifications()
                markAllRead()
              }
              setNotifOpen(!notifOpen)
            }}
            className={cn(
              'relative w-8 h-8 rounded-md flex items-center justify-center',
              'text-text-secondary hover:text-text-primary hover:bg-surface-2',
              'transition-colors duration-base'
            )}
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className={cn(
                'absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full',
                'bg-accent shadow-[0_0_0_2px_hsl(var(--bg-app))]'
              )} />
            )}
          </button>

          {notifOpen && (
            <div className={cn(
                'absolute right-0 top-full mt-1.5 w-80 z-20 overflow-hidden',
                'rounded-lg bg-surface-3/95 backdrop-blur-xl',
                'border border-border-strong shadow-lg'
              )}>
                <div className="flex items-center justify-between px-3 py-2.5 border-b border-border-subtle">
                  <span className="text-[13px] font-semibold text-text-primary">Notifications</span>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="flex items-center gap-1 text-[11px] text-accent hover:text-accent-hover transition-colors"
                    >
                      <CheckCheck className="w-3 h-3" />
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Bell className="w-6 h-6 text-text-tertiary mb-2" />
                      <p className="text-[12.5px] text-text-tertiary">No notifications yet</p>
                    </div>
                  ) : (
                    notifications.map(n => (
                      <div
                        key={n.id}
                        className={cn(
                          'px-3 py-2.5 border-b border-border-subtle last:border-0',
                          'flex items-start gap-2.5',
                          !n.read && 'bg-accent/5'
                        )}
                      >
                        <div className={cn(
                          'w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
                          'bg-accent/10 text-accent'
                        )}>
                          <UserPlus className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[12.5px] font-medium text-text-primary leading-snug">{n.title}</p>
                          <p className="text-[11.5px] text-text-tertiary mt-0.5 leading-snug">{n.message}</p>
                          <p className="text-[10.5px] text-text-tertiary mt-1">{timeAgo(n.createdAt)}</p>
                        </div>
                        {!n.read && (
                          <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0 mt-1.5" />
                        )}
                      </div>
                    ))
                  )}
                </div>
            </div>
          )}
        </div>

        {/* Action slot */}
        {action && (
          <div className="pl-2 ml-1 border-l border-border-subtle">
            {action}
          </div>
        )}

        {/* Profile */}
        <div className="relative pl-2 ml-1 border-l border-border-subtle" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className={cn(
              'flex items-center gap-2 pl-1 pr-1.5 h-8 rounded-md',
              'hover:bg-surface-2 transition-colors duration-base'
            )}
          >
            {userData?.avatar ? (
              <img
                src={userData.avatar}
                alt={userName}
                className="w-6 h-6 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-[10.5px] font-bold text-white flex-shrink-0"
                style={{
                  background:
                    'linear-gradient(135deg, hsl(var(--accent)) 0%, hsl(var(--accent-hover)) 100%)',
                  boxShadow:
                    'inset 0 1px 0 rgb(255 255 255 / 0.16), 0 0 0 1px hsl(var(--accent-hover))',
                }}
              >
                {initials}
              </div>
            )}
            <span className="text-[12.5px] font-medium text-text-primary hidden md:block tracking-[-0.005em]">
              {userName}
            </span>
            <ChevronDown className="w-3 h-3 text-text-tertiary hidden md:block" />
          </button>

          {profileOpen && (
            <div
                className={cn(
                  'absolute right-0 top-full mt-1.5 w-56 z-20 overflow-hidden py-1',
                  'rounded-lg bg-surface-3/95 backdrop-blur-xl',
                  'border border-border-strong shadow-lg'
                )}
              >
                <div className="px-3 py-2.5 border-b border-border-subtle">
                  <div className="text-[13px] font-semibold text-text-primary">
                    {userName}
                  </div>
                  <div className="text-[11.5px] text-text-tertiary mt-0.5">
                    {userEmail}
                  </div>
                </div>
                {[
                  { label: 'My profile', href: '/settings' },
                  { label: 'Workspace settings', href: '/settings#workspace' },
                  { label: 'Billing & plan', href: '/settings#billing' },
                ].map(({ label, href }) => (
                  <Link
                    key={label}
                    href={href}
                    onClick={() => setProfileOpen(false)}
                    className={cn(
                      'w-full text-left px-3 h-8 flex items-center',
                      'text-[13px] font-medium text-text-secondary',
                      'hover:bg-surface-2 hover:text-text-primary',
                      'transition-colors duration-fast'
                    )}
                  >
                    {label}
                  </Link>
                ))}
                <div className="border-t border-border-subtle mt-1 pt-1">
                  <Link
                    href="/"
                    className={cn(
                      'flex items-center px-3 h-8',
                      'text-[13px] font-medium text-text-secondary',
                      'hover:text-danger hover:bg-danger-soft',
                      'transition-colors duration-fast'
                    )}
                  >
                    Sign out
                  </Link>
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </header>
  )
}
