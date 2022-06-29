import { z } from 'zod'
import { Context } from '../context'
import { createRouter } from '../createRouter'
import { prisma } from '../prisma'

export const cartRouter = createRouter()
  .query('all', {
    async resolve({ ctx }) {
      const { user } = ctx as Context

      return await prisma.cart.findFirst({
        where: { userId: user.id },
        include: {
          cartItems: {
            include: { product: true },
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
      })
    },
  })
  .mutation('add-item', {
    input: z.object({
      productId: z.string(),
      quantity: z.number().min(0),
    }),
    async resolve({ input, ctx }) {
      const { user } = ctx as Context

      if (!user.id) throw new Error('User not found')

      return await prisma.cart.update({
        where: { userId: user.id },
        data: {
          cartItems: {
            upsert: {
              where: { productId: input.productId },
              create: {
                userId: user.id,
                productId: input.productId,
                quantity: input.quantity,
              },
              update: {
                quantity: input.quantity,
              },
            },
          },
        },
      })
    },
  })
  .mutation('update-quantity', {
    input: z.object({
      itemId: z.string(),
      quantity: z.number().min(1),
    }),
    async resolve({ input, ctx }) {
      const { user } = ctx as Context

      return await prisma.cart.update({
        where: { userId: user.id },
        data: {
          cartItems: {
            update: {
              where: { id: input.itemId },
              data: { quantity: input.quantity },
            },
          },
        },
        include: { cartItems: { include: { product: true } } },
      })
    },
  })
  .mutation('remove', {
    input: z.object({
      itemId: z.string(),
    }),
    async resolve({ input }) {
      return await prisma.cartItem.delete({
        where: { id: input.itemId },
        include: { product: true },
      })
    },
  })
