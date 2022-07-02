import { z } from 'zod'
import { createRouter } from '../createRouter'
import { prisma } from '../prisma'

export const productRouter = createRouter()
  .query('all', {
    async resolve() {
      const products = await prisma.product.findMany()

      return products.map(p => ({ ...p, createdAt: p.createdAt.toISOString() }))
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

      if (!product) throw new Error('Product not found')

      return { ...product, createdAt: product.createdAt.toISOString() }
    },
  })
