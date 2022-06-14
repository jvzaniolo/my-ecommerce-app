import type { Item } from './item'
import type { FormData } from './checkout-form'

export type Order = {
  id: number
  total: number
  items: Item[]
  email: string
} & FormData
