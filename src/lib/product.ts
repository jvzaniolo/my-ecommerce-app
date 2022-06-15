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

export const getProductBySlug = <T>(slug: T[keyof T], columns = '*') =>
  supabase
    .from<T>('product')
    .select(columns)
    .eq('slug' as keyof T, slug)
    .single()
