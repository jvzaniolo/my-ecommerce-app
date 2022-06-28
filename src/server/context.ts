import * as trpc from '@trpc/server'
import * as trpcNext from '@trpc/server/adapters/next'
import { Cart } from '~/types'
import { supabase } from './supabase'

export async function createContextInner(
  _opts: trpcNext.CreateNextContextOptions
) {
  const { token, user } = await supabase.auth.api.getUserByCookie(_opts.req)

  if (token) supabase.auth.setAuth(token)

  const { data: cart } = await supabase
    .from<Pick<Cart, 'id'>>('cart')
    .select('id')
    .match({ user_id: user?.id })
    .single()

  return { user: { ...user, cartId: cart?.id } }
}

export type Context = trpc.inferAsyncReturnType<typeof createContextInner>

export async function createContext(
  opts: trpcNext.CreateNextContextOptions
): Promise<Context> {
  return await createContextInner(opts)
}
