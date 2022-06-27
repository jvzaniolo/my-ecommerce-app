import { z } from 'zod'
import { Order } from '~/types'
import { Context } from '../context'
import { createRouter } from '../createRouter'
import { supabase } from '../supabase'

export const orderRouter = createRouter()
  .query('all', {
    async resolve() {
      const { data } = await supabase
        .from<Order>('order')
        .select('*, user(*), items:order_item(*, product(*))')

      return data
    },
  })
  .query('byId', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input }) {
      const { data } = await supabase
        .from<Order>('order')
        .select('*, user(*), items:order_item(*, product(*))')
        .match({ id: input.id })
        .single()

      return data
    },
  })
  .mutation('create', {
    input: z.object({
      cart: z.object({
        items: z.array(
          z.object({
            product_id: z.string(),
            quantity: z.number(),
          })
        ),
      }),
    }),
    async resolve({ input, ctx }) {
      const { user } = ctx as Context

      const orderRes = await supabase
        .from('order')
        .insert([
          {
            user_id: user?.id,
          },
        ])
        .select('*, user(*)')
        .single()

      const orderItemRes = await supabase
        .from('order_item')
        .insert([
          ...input.cart.items.map(item => ({
            order_id: orderRes.data.id,
            product_id: item.product_id,
            quantity: item.quantity,
            user_id: user?.id,
          })),
        ])
        .select('*, product(*)')

      return { ...orderRes.data, items: orderItemRes.data } as Order
    },
  })
