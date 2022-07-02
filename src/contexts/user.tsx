import { useToast } from '@chakra-ui/react'
import { Session } from '@supabase/supabase-js'
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'
import { InferMutationOutput } from '~/pages/api/trpc/[trpc]'
import { supabase } from '~/server/supabase'
import { axios } from '~/utils/axios'
import { trpc } from '~/utils/trpc'

type User = InferMutationOutput<'user.signIn'>['user']

type UserContextValue = {
  user: User
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
  const signInMutation = trpc.useMutation(['user.signIn'])
  const signUpMutation = trpc.useMutation(['user.create'])

  useEffect(() => {
    const session = supabase.auth.session()

    setSession(session)

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)

        if (session) {
          await axios.post('/api/auth', { event, session })
        } else {
          await axios.delete('/api/auth')
        }

        utils.invalidateQueries('cart.all')
      }
    )

    return () => {
      authListener?.unsubscribe()
    }
  }, [utils])

  async function signIn(email: string, password: string) {
    signInMutation.mutate(
      {
        email,
        password,
      },
      {
        onSuccess({ user, session }) {
          setUser(user)
          setSession(session)
        },
      }
    )
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut()

    if (error) return Promise.reject(error)

    setUser(null)
    setSession(null)
  }

  async function signUp(email: string, password: string) {
    signUpMutation.mutate(
      {
        email,
        password,
      },
      {
        onSuccess({ user, session }) {
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
        },
      }
    )
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
