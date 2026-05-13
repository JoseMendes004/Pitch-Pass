import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import auth from '@react-native-firebase/auth'
import apiClient, { setTokenGetter } from '@/lib/api-client'
import type { UserProfile } from '@pitch-pass/types'

interface AuthContextValue {
  profile: UserProfile | null
  loading: boolean
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = auth().onAuthStateChanged(async (user) => {
      if (user) {
        setTokenGetter(() => user.getIdToken())
        try {
          const { data } = await apiClient.get<{ data: UserProfile }>('/auth/me')
          setProfile(data.data)
        } catch {
          setProfile(null)
        }
      } else {
        setTokenGetter(async () => null)
        setProfile(null)
      }
      setLoading(false)
    })
    return unsub
  }, [])

  const logout = () => auth().signOut()

  return (
    <AuthContext.Provider value={{ profile, loading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
