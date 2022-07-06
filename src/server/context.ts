import * as trpc from '@trpc/server'
import { TRPCError } from '@trpc/server'
import * as trpcNext from '@trpc/server/adapters/next'
import { prisma } from './db/prisma'
import { supabase } from './db/supabase'

export async function createContext(opts: trpcNext.CreateNextContextOptions) {
  const { req, res } = opts
  const { user, token, error } = await supabase.auth.api.getUserByCookie(req)

  if (error)
    throw new TRPCError({ code: 'UNAUTHORIZED', message: error.message })

  return { req, res, user, authToken: token, prisma }
}

type Context = trpc.inferAsyncReturnType<typeof createContext>

export const createRouter = () => trpc.router<Context>()
