import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    }).catch(() => setLoading(false))

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signInWithProvider = async (provider) => {
    if (!supabase) return
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/coach`,
      },
    })
    if (error) console.error('Auth error:', error.message)
  }

  const signOut = async () => {
    if (!supabase) return
    await supabase.auth.signOut()
  }

  const value = {
    user,
    session,
    loading,
    signInWithProvider,
    signOut,
    // Helper to get display name
    displayName: user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'Racer',
    avatarUrl: user?.user_metadata?.avatar_url || null,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
