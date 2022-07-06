import { useToast } from '@chakra-ui/react'
import { Session } from '@supabase/supabase-js'
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'
import { InferQueryOutput } from '~/pages/api/trpc/[trpc]'
import { supabase } from '~/server/db/supabase'
import { trpc } from '~/utils/trpc'

type User = InferQueryOutput<'user.byEmail'>

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
  const utils = trpc.useContext()
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const createUser = trpc.useMutation(['user.create'])

  useEffect(() => {
    const session = supabase.auth.session()

    setSession(session)

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)

        if (session) {
          await fetch(
            `${
              process.env.NEXT_PUBLIC_VERCEL_URL || 'http://localhost:3000'
            }/api/auth`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ event, session }),
            }
          )
        } else {
          await fetch(
            `${
              process.env.NEXT_PUBLIC_VERCEL_URL || 'http://localhost:3000'
            }/api/auth`,
            {
              method: 'DELETE',
            }
          )
        }

        utils.invalidateQueries('cart.all')
      }
    )

    return () => {
      authListener?.unsubscribe()
    }
  }, [utils])

  async function signIn(email: string, password: string) {
    const {
      session,
      user: authUser,
      error,
    } = await supabase.auth.signIn({
      email,
      password,
    })

    if (error) throw error
    if (!authUser?.email) throw new Error('User not found on supabase')

    setSession(session)

    const data = await utils.fetchQuery(['user.byEmail', { email }])

    setUser(data)
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut()

    if (error) return Promise.reject(error)

    utils.invalidateQueries('cart.all')

    setUser(null)
    setSession(null)
  }

  async function signUp(email: string, password: string) {
    const {
      session,
      user: authUser,
      error,
    } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) throw error
    if (!authUser?.email) throw new Error('User not found on supabase')
    setSession(session)

    if (!session) {
      toast({
        title: 'Sign Up',
        description: 'Please confirm your e-mail before signing in.',
        status: 'success',
        duration: 5000,
      })
    }

    createUser.mutate({ id: authUser.id, email: authUser.email })
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
