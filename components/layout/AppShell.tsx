'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Sidebar } from './Sidebar'
import { MobileSidebar } from './MobileSidebar'
import { Toaster } from '@/components/ui/sonner'
import { MobileMenuProvider, useMobileMenu } from '@/contexts/MobileMenuContext'

function AppShellInner({ children }: { children: React.ReactNode }) {
  const { open, closeMenu } = useMobileMenu()
  const pathname = usePathname()

  useEffect(() => {
    closeMenu()
  }, [pathname])

  return (
    <div className="min-h-screen bg-bg-app text-text-primary">
      <Sidebar />
      <MobileSidebar open={open} onClose={closeMenu} />
      <main className="lg:ml-[232px] min-h-screen flex flex-col">
        {children}
      </main>
      <Toaster position="bottom-right" richColors closeButton />
    </div>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <MobileMenuProvider>
      <AppShellInner>{children}</AppShellInner>
    </MobileMenuProvider>
  )
}
