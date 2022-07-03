import { z } from 'zod'
import { Context } from '../context'
import { createRouter } from '../createRouter'
import { prisma } from '../prisma'

export const cartRouter = createRouter()
  .query('all', {
    async resolve({ ctx }) {
      const { user } = ctx as Context

      const cart = await prisma.cart.findFirst({
        where: { userId: user.id },
        include: { items: { include: { product: true } } },
        orderBy: { createdAt: 'desc' },
      })

      return cart
    },
  })
  .mutation('add-item', {
    input: z.object({
      productId: z.string(),
      quantity: z.number().min(1),
    }),
    async resolve({ input, ctx }) {
      const { user } = ctx as Context

      const cart = await prisma.cart.findFirst({
        where: { userId: user.id },
        select: { id: true },
      })

      if (!cart) throw new Error('Cart not found')

      const hasCartItem = await prisma.cartItem.findFirst({
        where: { productId: input.productId, cartId: cart.id },
        select: { id: true, quantity: true },
      })

      if (hasCartItem) {
        const updatedCart = await prisma.cart.update({
          where: { userId: user.id },
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
        where: { userId: user.id },
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
      const { user } = ctx as Context

      const cart = await prisma.cart.update({
        where: { userId: user.id },
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
      const { user } = ctx as Context

      const cart = await prisma.cart.update({
        where: { userId: user.id },
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
