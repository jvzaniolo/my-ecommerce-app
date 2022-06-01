import { api } from '~/services/axios'
import { Item } from '~/types/item'

export async function addToCart(item: Item) {
  const { data } = await api.get<Item[]>('/cart')

  const product = data.find((p: any) => p.id === item.id)

  if (product) {
    await api.patch(`/cart/${product.id}`, {
      quantity: product.quantity + 1,
    })
  } else {
    await api.post('/cart', {
      ...item,
      quantity: 1,
    })
  }
}

export function removeFromCart(id: string) {
  api.delete(`/cart/${id}`)
}
