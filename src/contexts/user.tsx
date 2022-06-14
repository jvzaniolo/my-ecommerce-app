import type { Session, User } from '@supabase/supabase-js'

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'
import { supabase } from '~/services/supabase'

type UserContextValue = {
  user: User | null
  session: Session | null
}

const UserContext = createContext<UserContextValue | null>(null)

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    const session = supabase.auth.session()

    setSession(session)
    setUser(session?.user ?? null)

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setSession(session)
        setUser(session?.user ?? null)
      }
    )

    return () => {
      authListener?.unsubscribe()
    }
  }, [])

  return (
    <UserContext.Provider value={{ user, session }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)

  if (!context) {
    throw new Error(`useUser must be used within a UserContextProvider.`)
  }

  return context
}
