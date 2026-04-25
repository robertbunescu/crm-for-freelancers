'use client'

import { createContext, useContext, useState } from 'react'

interface MobileMenuContextType {
  open: boolean
  openMenu: () => void
  closeMenu: () => void
}

const MobileMenuContext = createContext<MobileMenuContextType>({
  open: false,
  openMenu: () => {},
  closeMenu: () => {},
})

export function MobileMenuProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <MobileMenuContext.Provider value={{ open, openMenu: () => setOpen(true), closeMenu: () => setOpen(false) }}>
      {children}
    </MobileMenuContext.Provider>
  )
}

export function useMobileMenu() {
  return useContext(MobileMenuContext)
}
