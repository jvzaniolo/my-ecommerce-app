import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { prisma } from '~/lib/prisma'
import { createRouter } from '../context'

export const cartRouter = createRouter()
  .middleware(({ ctx, next }) => {
    if (!ctx.user) {
      throw new TRPCError({ code: 'UNAUTHORIZED' })
    }

    return next()
  })
  .query('all', {
    async resolve({ ctx }) {
      const cart = await prisma.cart.findFirst({
        where: { userId: ctx.user?.id },
        include: { items: { include: { product: true } } },
        orderBy: { createdAt: 'desc' },
      })

      return cart
    },
  })
  .mutation('add-item', {
    input: z.object({
      productId: z.string(),
      quantity: z.number(),
    }),
    async resolve({ input, ctx }) {
      const cart = await prisma.cart.findFirst({
        where: { userId: ctx.user?.id },
        select: { id: true },
      })

      const hasCartItem = await prisma.cartItem.findFirst({
        where: { productId: input.productId, cartId: cart?.id },
        select: { id: true, quantity: true },
      })

      if (hasCartItem) {
        const updatedCart = await prisma.cart.update({
          where: { userId: ctx.user?.id },
          data: {
            items: {
              update: {
                where: { id: hasCartItem.id },
                data: { quantity: hasCartItem.quantity + input.quantity },
              },
            },
          },
          include: { items: { include: { product: true } } },
        })

        return updatedCart
      }

      const updatedCart = await prisma.cart.update({
        where: { userId: ctx.user?.id },
        data: {
          items: {
            create: {
              productId: input.productId,
              quantity: input.quantity,
            },
          },
        },
        include: { items: { include: { product: true } } },
      })

      return updatedCart
    },
  })
  .mutation('update-quantity', {
    input: z.object({
      itemId: z.string(),
      quantity: z.number().min(1),
    }),
    async resolve({ input, ctx }) {
      const cart = await prisma.cart.update({
        where: { userId: ctx.user?.id },
        data: {
          items: {
            update: {
              where: { id: input.itemId },
              data: { quantity: input.quantity },
            },
          },
        },
        include: { items: { include: { product: true } } },
      })

      return cart
    },
  })
  .mutation('remove', {
    input: z.object({
      itemId: z.string(),
    }),
    async resolve({ input, ctx }) {
      const cart = await prisma.cart.update({
        where: { userId: ctx.user?.id },
        data: {
          items: {
            delete: {
              id: input.itemId,
            },
          },
        },
        include: { items: { include: { product: true } } },
      })

      return cart
    },
  })
