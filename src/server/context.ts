import * as trpc from '@trpc/server'
import * as trpcNext from '@trpc/server/adapters/next'
import { supabase } from './supabase'

export async function createContextInner(
  _opts: trpcNext.CreateNextContextOptions
) {
  if (_opts.req.url?.includes('api/trpc/auth.create')) {
    if (_opts.req.method === 'POST') {
      supabase.auth.api.setAuthCookie(_opts.req, _opts.res)
    }

    if (_opts.req.method === 'DELETE') {
      supabase.auth.api.deleteAuthCookie(_opts.req, _opts.res, {})
    }
  }

  const { user } = await supabase.auth.api.getUserByCookie(_opts.req)

  return { user }
}

export type Context = trpc.inferAsyncReturnType<typeof createContextInner>

export async function createContext(
  opts: trpcNext.CreateNextContextOptions
): Promise<Context> {
  return await createContextInner(opts)
}
