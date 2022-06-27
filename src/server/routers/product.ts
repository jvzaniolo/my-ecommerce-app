import { Product } from '~/types'
import { createRouter } from '../createRouter'
import { supabase } from '../supabase'

export const productRouter = createRouter().query('all', {
  async resolve() {
    return await supabase.from<Product>('product').select('*')
  },
})
