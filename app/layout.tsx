import './globals.css'
import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/lib/auth-context'

export const metadata: Metadata = {
  title: 'Nexus CRM — Run your pipeline with precision',
  description:
    'A premium CRM for operators. Manage leads, clients, and revenue with surgical clarity.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      style={{
        '--font-inter': 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
        '--font-geist-mono': 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
      } as React.CSSProperties}
    >
      <body className="font-sans">
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
