import { useToast } from '@chakra-ui/react'
import type { ApiError, Session, User } from '@supabase/supabase-js'

import { useRouter } from 'next/router'
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
  signIn: (
    email: string,
    password: string,
    onError?: (error: ApiError | null) => void
  ) => Promise<void>
  signOut: (onError?: (error: ApiError | null) => void) => Promise<void>
  signUp: (
    email: string,
    password: string,
    onError?: (error: ApiError | null) => void
  ) => Promise<void>
}

const UserContext = createContext<UserContextValue | null>(null)

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const toast = useToast()
  const router = useRouter()
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

  async function signIn(
    email: string,
    password: string,
    onError?: (error: ApiError | null) => void
  ) {
    const { session, user, error } = await supabase.auth.signIn({
      email,
      password,
    })

    if (error) {
      onError?.(error)
    } else {
      setSession(session)
      setUser(user)
      router.push('/')
    }
  }

  async function signOut(onError?: (error: ApiError | null) => void) {
    const { error } = await supabase.auth.signOut()

    if (error) {
      onError?.(error)
    } else {
      setSession(null)
      setUser(null)
    }
  }

  async function signUp(
    email: string,
    password: string,
    onError?: (error: ApiError | null) => void
  ) {
    const { session, user, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      onError?.(error)
    } else {
      if (!session) {
        toast({
          title: 'Sign Up',
          description: 'Please confirm your e-mail before signing in.',
          status: 'success',
          duration: 5000,
        })
      }

      setUser(user)
      setSession(session)
    }
  }

  return (
    <UserContext.Provider value={{ user, session, signIn, signUp, signOut }}>
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
