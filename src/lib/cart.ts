import { supabase } from '~/services/supabase'
import type { Product } from './product'

export type CartItem = {
  id: string
  user_id: string
  quantity: number
  product_id: string
}

export type CartItemWithProduct = CartItem & {
  product: Product
}

export const addCartItem = (payload: CartItem) =>
  supabase.from<CartItem>('cart').insert([payload]).single()

export const getCartItems = <T>(columns = '*, product(*)') =>
  supabase.from<T>('cart').select(columns)

export const getCartItemByProductId = <T>(
  productId: T[keyof T],
  columns = '*, product(*)'
) =>
  supabase
    .from<T>('cart')
    .select(columns)
    .eq('product_id' as keyof T, productId)
    .single()

export const updateCartItemById = (id: string, payload: any) =>
  supabase
    .from<CartItem>('cart')
    .update({ ...payload })
    .eq('id', id)
    .single()

export const updateCartItemByProductId = <T>(
  product_id: T[keyof T],
  payload: any
) =>
  supabase
    .from<T>('cart')
    .update({ ...payload })
    .eq('product_id' as keyof T, product_id)
    .single()

export const deleteCartItemById = (id: string) =>
  supabase.from<CartItem>('cart').delete().eq('id', id)
