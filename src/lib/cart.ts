import { mutate } from 'swr'
import { axios } from '~/services/axios'
import { Cart } from '~/types'

export async function optimisticUpdateItemQuantity(
  cart: Cart,
  cartItemId: string,
  quantity: number
) {
  const updatedCartItems = cart.items.map(item =>
    item.id === cartItemId ? { ...item, quantity } : item
  )

  mutate(
    '/api/cart',
    async () => {
      const { data } = await axios.patch(`/api/cart/${cartItemId}`, {
        quantity,
      })

      return {
        ...cart,
        items: cart.items.map(item => (item.id === data.id ? data : item)),
      }
    },
    {
      optimisticData: { ...cart, items: updatedCartItems },
      rollbackOnError: true,
    }
  )
}

export async function optimisticDeleteItem(cart: Cart, cartItemId: string) {
  mutate(
    '/api/cart',
    async () => {
      const { data } = await axios.delete(`/api/cart/${cartItemId}`)

      return {
        ...cart,
        items: cart.items.filter(item => item.id !== data.id),
      }
    },
    {
      optimisticData: {
        ...cart,
        items: cart.items.filter(item => item.id !== cartItemId),
      },
      rollbackOnError: true,
    }
  )
}
