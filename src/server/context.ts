import * as trpc from '@trpc/server'
import * as trpcNext from '@trpc/server/adapters/next'
import { supabase } from './supabase'

export async function createContextInner(
  _opts: trpcNext.CreateNextContextOptions
) {
  const { token, user } = await supabase.auth.api.getUserByCookie(_opts.req)

  if (token) supabase.auth.setAuth(token)

  return { user }
}

export type Context = trpc.inferAsyncReturnType<typeof createContextInner>

export async function createContext(
  opts: trpcNext.CreateNextContextOptions
): Promise<Context> {
  return await createContextInner(opts)
}
