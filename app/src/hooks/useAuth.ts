import { useState, useEffect } from "react"
import type { User } from "@supabase/supabase-js"
import { supabase, supabaseConfigured } from "@/lib/supabase"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabaseConfigured) {
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string) => {
    return supabase.auth.signInWithOtp({ email })
  }

  const signOut = async () => {
    return supabase.auth.signOut()
  }

  return { user, loading, signIn, signOut }
}
