import { z } from 'zod'
import { Product } from '~/types'
import { createRouter } from '../createRouter'
import { supabase } from '../supabase'

export const productRouter = createRouter()
  .query('all', {
    async resolve() {
      const { data } = await supabase.from<Product>('product').select('*')

      if (!data) throw new Error('Error fetching products')

      return data
    },
  })
  .query('bySlug', {
    input: z.object({
      slug: z.string(),
    }),
    async resolve({ input }) {
      const { data } = await supabase
        .from<Product>('product')
        .select('*')
        .match({ slug: input.slug })

      if (!data) throw new Error('Product not found')

      return data[0]
    },
  })
