import { supabaseServerClient } from '@supabase/auth-helpers-nextjs'
import * as trpc from '@trpc/server'
import * as trpcNext from '@trpc/server/adapters/next'

export async function createContext(opts: trpcNext.CreateNextContextOptions) {
  const { user, token } = await supabaseServerClient({
    req: opts.req,
  }).auth.api.getUserByCookie(opts.req)

  return { user, authToken: token }
}

type Context = trpc.inferAsyncReturnType<typeof createContext>

export const createRouter = () => trpc.router<Context>()
