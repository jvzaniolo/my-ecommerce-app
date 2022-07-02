import { inferProcedureOutput } from '@trpc/server'
import * as trpcNext from '@trpc/server/adapters/next'
import { createContext } from '~/server/context'
import { AppRouter, appRouter } from '~/server/routers/_app'

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext,
})

export type InferQueryOutput<
  TRouteKey extends keyof AppRouter['_def']['queries']
> = inferProcedureOutput<AppRouter['_def']['queries'][TRouteKey]>

export type InferMutationOutput<
  TRouteKey extends keyof AppRouter['_def']['mutations']
> = inferProcedureOutput<AppRouter['_def']['mutations'][TRouteKey]>
