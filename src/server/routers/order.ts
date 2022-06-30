import { z } from 'zod'
import { Context } from '../context'
import { createRouter } from '../createRouter'
import { prisma } from '../prisma'

export const orderRouter = createRouter()
  .query('all', {
    async resolve({ ctx }) {
      const { user } = ctx as Context

      const order = await prisma.order.findFirst({
        where: { userId: user.id },
        include: {
          user: true,
          orderItems: {
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
      const { user } = ctx as Context

      const order = await prisma.order.findFirst({
        where: { userId: user.id, id: input.id },
        include: {
          user: true,
          orderItems: {
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
      const { user } = ctx as Context

      if (!user.id) throw new Error('User not found')

      const order = await prisma.order.create({
        data: {
          userId: user.id,
          orderItems: {
            create: input.cart.items.map(i => ({
              productId: i.productId,
              quantity: i.quantity,
            })),
          },
        },
        include: { user: true, orderItems: { include: { product: true } } },
      })

      return order
    },
  })
