import { z } from 'zod'
import { createRouter } from '../createRouter'
import { prisma } from '../prisma'
import { supabase } from '../supabase'

export const userRouter = createRouter()
  .mutation('signIn', {
    input: z.object({
      email: z.string().email(),
      password: z.string(),
    }),

    async resolve({ input }) {
      const {
        session,
        user: authUser,
        error,
      } = await supabase.auth.signIn({
        email: input.email,
        password: input.password,
      })

      if (error) throw new Error(error.message)

      const user = await prisma.user.findUnique({
        where: { id: authUser?.id },
      })

      return { session, user }
    },
  })
  .mutation('create', {
    input: z.object({
      email: z.string().email(),
      password: z.string(),
    }),

    async resolve({ input }) {
      const {
        session,
        user: authUser,
        error,
      } = await supabase.auth.signUp({
        email: input.email,
        password: input.password,
      })

      if (error) throw new Error(error.message)

      const user = await prisma.user.create({
        data: {
          id: authUser?.id,
          email: input.email,
          cart: {
            create: {},
          },
        },
      })

      return { session, user }
    },
  })
