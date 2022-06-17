import { supabase } from '~/services/supabase'

export type Product = {
  id: string
  slug: string
  name: string
  description: string
  price: number
  image: string
  quantity: number
  stock: number
}

export const getProducts = <T>(columns = '*') =>
  supabase.from<T>('product').select(columns)

export const getProductBySlug = <T>(slug: string, columns = '*') =>
  supabase.from<T>('product').select(columns).match({ slug }).single()
