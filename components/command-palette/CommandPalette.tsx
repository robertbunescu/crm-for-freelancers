'use client'

import { useEffect, useRef, useState } from 'react'
import { Search, X, Zap, User, CheckCircle, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface SearchResult {
  id: string
  type: 'lead' | 'client' | 'task'
  name: string
  description?: string
}

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId?: string
}

export function CommandPalette({ open, onOpenChange, userId }: CommandPaletteProps) {
  const [search, setSearch] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus()
    }
  }, [open])

  useEffect(() => {
    const performSearch = async () => {
      if (!search.trim() || !userId) {
        setResults([])
        setSelectedIndex(0)
        return
      }

      try {
        const query = encodeURIComponent(search.toLowerCase())
        const res = await fetch(`/api/search?q=${query}&userId=${userId}`)
        if (res.ok) {
          const data = await res.json()
          setResults(data)
          setSelectedIndex(0)
        }
      } catch {
        setResults([])
      }
    }

    const timer = setTimeout(performSearch, 200)
    return () => clearTimeout(timer)
  }, [search, userId])

  const getIcon = (type: SearchResult['type']) => {
    const iconClass = 'w-4 h-4'
    switch (type) {
      case 'lead':
        return <User className={iconClass} />
      case 'client':
        return <Users className={iconClass} />
      case 'task':
        return <CheckCircle className={iconClass} />
      default:
        return <Search className={iconClass} />
    }
  }

  const handleSelect = (result: SearchResult) => {
    const routes: Record<string, string> = {
      lead: `/leads`,
      client: `/clients`,
      task: `/tasks`,
    }

    router.push(routes[result.type])
    onOpenChange(false)
    setSearch('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onOpenChange(false)
      setSearch('')
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => (prev + 1) % Math.max(results.length, 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => (prev - 1 + Math.max(results.length, 1)) % Math.max(results.length, 1))
    } else if (e.key === 'Enter' && results.length > 0) {
      e.preventDefault()
      handleSelect(results[selectedIndex])
    }
  }

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
        <div
          className={cn(
            'w-full max-w-xl bg-surface-1 border border-border-default',
            'rounded-lg shadow-xl overflow-hidden',
            'animate-in fade-in slide-in-from-top-4'
          )}
          onClick={e => e.stopPropagation()}
        >
          {/* Search Input */}
          <div className="flex items-center gap-2.5 px-3.5 py-3 border-b border-border-subtle">
            <Search className="w-3.5 h-3.5 text-text-tertiary flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search leads, pipeline, clients, and tasks..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              className={cn(
                'flex-1 pl-2 bg-transparent text-[13px] text-text-primary',
                'placeholder:text-text-tertiary',
                'outline-none'
              )}
            />
            <button
              onClick={() => onOpenChange(false)}
              className="w-5 h-5 rounded flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-surface-2 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Results */}
          <div className="max-h-80 overflow-y-auto">
            {results.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Zap className="w-5 h-5 text-text-tertiary mb-2 opacity-40" />
                <p className="text-[12px] text-text-tertiary">
                  {search ? 'No results found' : 'Search leads, pipeline, clients, and tasks'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border-subtle">
                {results.map((result, idx) => (
                  <button
                    key={result.id}
                    onClick={() => handleSelect(result)}
                    className={cn(
                      'w-full flex items-center gap-2.5 px-3.5 py-2.5 text-left transition-colors',
                      idx === selectedIndex
                        ? 'bg-surface-2 text-text-primary'
                        : 'text-text-secondary hover:bg-surface-2/50'
                    )}
                  >
                    <div className="flex-shrink-0 text-text-tertiary">
                      {getIcon(result.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[12.5px] font-medium text-text-primary truncate">
                        {result.name}
                      </div>
                      {result.description && (
                        <div className="text-[11px] text-text-tertiary mt-0.5 truncate">
                          {result.description}
                        </div>
                      )}
                    </div>
                    <div className="text-[9px] text-text-tertiary font-mono flex-shrink-0 uppercase">
                      {result.type}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer hint */}
          {results.length > 0 && (
            <div className="flex items-center justify-between px-3.5 py-2 border-t border-border-subtle bg-surface-2/20 text-[10px] text-text-tertiary">
              <span>Use ↑↓ to navigate</span>
              <span>Press Enter to select</span>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
