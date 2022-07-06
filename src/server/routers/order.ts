import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { createRouter } from '../context'
import { prisma } from '../db/prisma'

export const orderRouter = createRouter()
  .middleware(({ ctx, next }) => {
    if (!ctx.user) {
      throw new TRPCError({ code: 'UNAUTHORIZED' })
    }

    return next()
  })
  .query('all', {
    async resolve({ ctx }) {
      const order = await prisma.order.findFirst({
        where: { userId: ctx.user?.id },
        include: {
          user: true,
          items: {
            include: { product: true },
            orderBy: { createdAt: 'desc' },
          },
        },
        orderBy: { createdAt: 'desc' },
      })

      return order
    },
  })
  .query('byId', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input, ctx }) {
      const order = await prisma.order.findFirst({
        where: { userId: ctx.user?.id, id: input.id },
        include: {
          user: true,
          items: {
            include: { product: true },
            orderBy: { createdAt: 'desc' },
          },
        },
      })

      return order
    },
  })
  .mutation('create', {
    input: z.object({
      cart: z.object({
        items: z.array(
          z.object({
            productId: z.string(),
            quantity: z.number(),
          })
        ),
      }),
    }),
    async resolve({ input, ctx }) {
      if (!ctx.user) return

      const order = await prisma.order.create({
        data: {
          userId: ctx.user.id,
          items: {
            createMany: {
              data: input.cart.items.map(i => ({
                productId: i.productId,
                quantity: i.quantity,
              })),
            },
          },
        },
        include: { user: true, items: { include: { product: true } } },
      })

      return order
    },
  })
