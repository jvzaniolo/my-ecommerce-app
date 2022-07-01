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
        include: {
          items: {
            include: { product: true },
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
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

      if (!user.id) throw new Error('User not found')

      const cart = await prisma.cart.findFirst({
        where: { userId: user.id },
        select: { id: true },
      })

      if (!cart) throw new Error('Cart not found')

      // const raw =
      //   await prisma.$executeRaw`INSERT INTO "public"."CartItem" ("cartId","productId","userId","quantity") VALUES (${cart.id},${input.productId},${user.id},${input.quantity});`

      const hasCartItem = await prisma.cartItem.findFirst({
        where: { productId: input.productId, cartId: cart.id },
        select: { quantity: true },
      })

      if (hasCartItem) {
        return await prisma.cart.update({
          where: { userId: user.id },
          data: {
            items: {
              update: {
                where: { productId: input.productId },
                data: { quantity: hasCartItem.quantity + input.quantity },
              },
            },
          },
        })
      }

      return await prisma.cart.update({
        where: { userId: user.id },
        data: {
          items: {
            create: {
              userId: user.id,
              productId: input.productId,
              quantity: input.quantity,
            },
          },
        },
      })

      // console.log({ raw })

      const newCart = await prisma.cart.findFirst({
        where: { userId: user.id },
        include: {
          items: {
            include: { product: true },
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
      })

      return newCart
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
    async resolve({ input }) {
      const cart = await prisma.cartItem.delete({
        where: { id: input.itemId },
        include: { product: true },
      })

      return cart
    },
  })
