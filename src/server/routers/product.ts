import { z } from 'zod'
import { createRouter } from '../context'
import { prisma } from '../db/prisma'

export const productRouter = createRouter()
  .query('all', {
    async resolve() {
      const products = await prisma.product.findMany()

      return products
    },
  })
  .query('bySlug', {
    input: z.object({
      slug: z.string(),
    }),
    async resolve({ input }) {
      const product = await prisma.product.findFirst({
        where: { slug: input.slug },
      })

      return product
    },
  })
