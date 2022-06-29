import { z } from 'zod'
import { createRouter } from '../createRouter'
import { prisma } from '../prisma'

export const productRouter = createRouter()
  .query('all', {
    async resolve() {
      return await prisma.product.findMany()
    },
  })
  .query('bySlug', {
    input: z.object({
      slug: z.string(),
    }),
    async resolve({ input }) {
      return await prisma.product.findFirst({ where: { slug: input.slug } })
    },
  })
