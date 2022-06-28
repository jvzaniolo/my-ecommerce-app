import * as trpc from '@trpc/server'
import * as trpcNext from '@trpc/server/adapters/next'
import { supabase } from './supabase'

export async function createContextInner(
  _opts: trpcNext.CreateNextContextOptions
) {
  const auth = await supabase.auth.api.getUserByCookie(_opts.req)

  if (auth.token) supabase.auth.setAuth(auth.token)
  // if (auth.error || !auth.user || !auth.data) throw new Error('Unauthorized')

  return auth
}

export type Context = trpc.inferAsyncReturnType<typeof createContextInner>

export async function createContext(
  opts: trpcNext.CreateNextContextOptions
): Promise<Context> {
  return await createContextInner(opts)
}
