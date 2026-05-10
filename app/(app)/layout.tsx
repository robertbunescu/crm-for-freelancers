import { AppShell } from '@/components/layout/AppShell'
import { ProtectedLayout } from '@/components/protected-layout'

export default function AppGroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedLayout>
      <AppShell>{children}</AppShell>
    </ProtectedLayout>
  )
}
