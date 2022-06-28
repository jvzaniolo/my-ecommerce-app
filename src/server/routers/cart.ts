import { z } from 'zod'
import { Cart } from '~/types'
import { Context } from '../context'
import { createRouter } from '../createRouter'
import { supabase } from '../supabase'

export const cartRouter = createRouter()
  .query('all', {
    async resolve() {
      const { data } = await supabase
        .from<Cart>('cart')
        .select('*, items:cart_item(*, product(*))')
        .single()

      return data
    },
  })
  .mutation('add-item', {
    input: z.object({
      productId: z.string(),
      quantity: z.number().min(0),
    }),
    async resolve({ input, ctx }) {
      const { user } = ctx as Context

      // Get the user cart id
      const cartRes = await supabase
        .from<Pick<Cart, 'id'>>('cart')
        .select('id')
        .match({ user_id: user?.id })
        .single()

      // Find existing item in cart
      const cartItemRes = await supabase
        .from<Pick<Cart['items'][0], 'id' | 'quantity'>>('cart_item')
        .select('id, quantity')
        .match({ product_id: input.productId })

      // If cart item exists, update the quantity with the new quantity
      if (cartItemRes.data && cartItemRes.data.length > 0) {
        const updatedItemRes = await supabase
          .from('cart_item')
          .update({ quantity: cartItemRes.data[0].quantity + input.quantity })
          .select('*, product(*)')
          .match({ product_id: input.productId })
          .single()

        return updatedItemRes.data
      }

      // Or else, create a new cart item
      const newItemRes = await supabase
        .from('cart_item')
        .insert([
          {
            quantity: input.quantity,
            cart_id: cartRes.data?.id,
            user_id: user?.id,
            product_id: input.productId,
          },
        ])
        .select('*, product(*)')
        .single()

      return newItemRes.data
    },
  })
  .mutation('update-item-qty', {
    input: z.object({
      itemId: z.string(),
      quantity: z.number().min(1),
    }),
    async resolve({ input }) {
      const { data } = await supabase
        .from('cart_item')
        .update({ quantity: input.quantity })
        .select('*, product(*)')
        .match({ id: input.itemId })
        .single()

      return data
    },
  })
  .mutation('remove-item', {
    input: z.object({
      itemId: z.string(),
    }),
    async resolve({ input }) {
      const { data } = await supabase
        .from('cart_item')
        .delete()
        .match({ id: input.itemId })

      return data
    },
  })
