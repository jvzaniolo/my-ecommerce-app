import { mutate } from 'swr'
import { axios } from '~/services/axios'

export async function optimisticUpdateItemQuantity(
  cart: any,
  cartItemId: string,
  quantity: number
) {
  const updatedCartItems = cart.items.map((item: any) =>
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
        items: cart.items.map((item: any) =>
          item.id === data.id ? data : item
        ),
      }
    },
    {
      optimisticData: { ...cart, items: updatedCartItems },
      rollbackOnError: true,
    }
  )
}

export async function optimisticDeleteItem(cart: any, cartItemId: string) {
  mutate(
    '/api/cart',
    async () => {
      const { data } = await axios.delete(`/api/cart/${cartItemId}`)

      return {
        ...cart,
        items: cart.items.filter((item: any) => item.id !== data.id),
      }
    },
    {
      optimisticData: {
        ...cart,
        items: cart.items.filter((item: any) => item.id !== cartItemId),
      },
      rollbackOnError: true,
    }
  )
}
