'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import apiClient from '@/lib/api-client'
import type { UserProfile } from '@pitch-pass/types'

interface AuthContextValue {
  firebaseUser: User | null
  profile: UserProfile | null
  loading: boolean
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user)
      if (user) {
        try {
          const { data } = await apiClient.get<{ data: UserProfile }>('/auth/me')
          setProfile(data.data)
        } catch {
          // API unavailable — keep user logged in via Firebase, profile null
        }
      } else {
        setProfile(null)
      }
      setLoading(false)
    })
    return unsub
  }, [])

  const logout = async () => {
    await signOut(auth)
    setProfile(null)
  }

  return (
    <AuthContext.Provider value={{ firebaseUser, profile, loading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
