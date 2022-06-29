import { InferQueryOutput } from '~/pages/api/trpc/[trpc]'
import { trpc } from '~/utils/trpc'

type Cart = InferQueryOutput<'cart.all'>

export const useRemoveCartItemMutation = () => {
  const utils = trpc.useContext()

  return trpc.useMutation(['cart.remove'], {
    onMutate({ itemId }) {
      utils.cancelQuery(['cart.all'])

      const prevCart = utils.getQueryData(['cart.all'])

      utils.setQueryData(['cart.all'], old => {
        return {
          ...old,
          items: old?.items.filter(i => i.id !== itemId),
        } as Cart
      })

      return { prevCart }
    },
    onError: (_, __, context) => {
      utils.setQueryData(['cart.all'], context?.prevCart as Cart)
    },
    onSettled: () => {
      utils.invalidateQueries(['cart.all'])
    },
  })
}

export const useUpdateCartItemMutation = () => {
  const utils = trpc.useContext()

  return trpc.useMutation(['cart.update-quantity'], {
    onMutate({ itemId, quantity }) {
      utils.cancelQuery(['cart.all'])

      const prevCart = utils.getQueryData(['cart.all'])

      utils.setQueryData(['cart.all'], old => {
        return {
          ...old,
          items: old?.items.map(i => {
            if (i.id === itemId) {
              return {
                ...i,
                quantity,
              }
            }
            return i
          }),
        } as Cart
      })

      return { prevCart }
    },
    onError: (_, __, context) => {
      utils.setQueryData(['cart.all'], context?.prevCart as Cart)
    },
    onSettled: () => {
      utils.invalidateQueries(['cart.all'])
    },
  })
}
