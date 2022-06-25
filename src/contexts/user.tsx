import { useToast } from '@chakra-ui/react'
import { Session, User } from '@supabase/supabase-js'
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'
import { mutate } from 'swr'
import { axios } from '~/services/axios'
import { supabase } from '~/services/supabase'

type UserContextValue = {
  user: User | null
  session: Session | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const UserContext = createContext<UserContextValue | null>(null)

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const toast = useToast()
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    const session = supabase.auth.session()

    setSession(session)
    setUser(session?.user ?? null)

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)

        if (session) {
          await axios.post('/api/auth', { event, session })
        } else {
          await axios.delete('/api/auth')
        }

        mutate('/api/cart')
      }
    )

    return () => {
      authListener?.unsubscribe()
    }
  }, [])

  async function signIn(email: string, password: string) {
    const { session, user, error } = await supabase.auth.signIn({
      email,
      password,
    })

    if (error) return Promise.reject(error)

    setUser(user)
    setSession(session)

    return Promise.resolve()
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut()

    if (error) return Promise.reject(error)

    setUser(null)
    setSession(null)
  }

  async function signUp(email: string, password: string) {
    const { session, user, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) return Promise.reject(error)

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
