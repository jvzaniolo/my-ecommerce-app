import { z } from 'zod'
import { prisma } from '~/lib/prisma'
import { createRouter } from '../context'

export const userRouter = createRouter()
  .query('byEmail', {
    input: z.object({
      email: z.string().email().optional(),
    }),
    async resolve({ input }) {
      const user = await prisma.user.findFirst({
        where: { email: input.email },
      })

      return user
    },
  })
  .mutation('create', {
    input: z.object({
      id: z.string().uuid(),
      email: z.string().email(),
    }),
    async resolve({ input }) {
      const user = await prisma.user.create({
        data: {
          id: input.id,
          email: input.email,
          cart: {
            create: {},
          },
        },
      })

      return user
    },
  })
