import useSWR, { useSWRConfig } from 'swr'
import { api } from '~/services/axios'
import type { Item } from '~/types/item'

export const useCart = () => {
  const { mutate } = useSWRConfig()
  const {
    data: cart,
    error,
    mutate: mutateCart,
    isValidating,
  } = useSWR<Item[]>('/cart')

  async function addItem(newItem: Item) {
    await mutate('/cart', () => {
      api.post('/cart', newItem)
    })
  }

  async function removeItem(id: string) {
    if (!cart) return

    const filteredCart = cart.filter(item => item.id !== id)

    mutate(
      '/cart',
      async () => {
        await api.delete(`/cart/${id}`)

        return filteredCart
      },
      {
        optimisticData: filteredCart,
        rollbackOnError: true,
        revalidate: false,
        populateCache: true,
      }
    )
  }

  async function updateItemQuantity(id: string, quantity: number) {
    if (!cart) return

    const cartWithUpdatedQuantity = cart.map(item =>
      item.id === id ? { ...item, quantity } : item
    )

    mutate(
      '/cart',
      async () => {
        await api.patch(`/cart/${id}`, { quantity })

        return cartWithUpdatedQuantity
      },
      {
        optimisticData: cartWithUpdatedQuantity,
        rollbackOnError: true,
        revalidate: false,
        populateCache: true,
      }
    )
  }

  return {
    cart,
    error,
    isValidating,
    mutateCart,
    addItem,
    removeItem,
    updateItemQuantity,
  }
}
