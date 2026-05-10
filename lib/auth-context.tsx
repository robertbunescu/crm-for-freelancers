'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from './supabase'

interface UserData {
  id: string
  email: string
  name: string | null
  avatar?: string | null
  jobTitle?: string | null
  bio?: string | null
  timezone?: string | null
  language?: string | null
  createdAt: string
  updatedAt: string
}

interface AuthContextType {
  user: User | null
  userData: UserData | null
  loading: boolean
  signUp: (email: string, password: string, name: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUserData = async (email: string) => {
    try {
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const data = await response.json()
      if (data.id) {
        setUserData(data)
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error)
    }
  }

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
        if (session?.user?.email) {
          fetchUserData(session.user.email)
        } else {
          setUserData(null)
        }
        setLoading(false)
      }
    )

    return () => subscription?.unsubscribe()
  }, [])

  useEffect(() => {
    const handleUserUpdated = () => {
      if (user?.email) {
        fetchUserData(user.email)
      }
    }

    window.addEventListener('user-updated', handleUserUpdated)
    return () => window.removeEventListener('user-updated', handleUserUpdated)
  }, [user?.email])

  const signUp = async (email: string, password: string, name: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    })
    if (error) throw error
    await fetchUserData(email)
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw error
    await fetchUserData(email)
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setUserData(null)
  }

  return (
    <AuthContext.Provider value={{ user, userData, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
