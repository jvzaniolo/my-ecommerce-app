import { useDisclosure } from '@chakra-ui/react'
import { createContext, ReactNode, useContext } from 'react'
import { CartDrawer } from '~/components/cart-drawer'

type CartDrawerContextValue = {
  isCartDrawerOpen: boolean
  onOpenCartDrawer: () => void
  onCloseCartDrawer: () => void
}

const CartDrawerContext = createContext<CartDrawerContextValue | null>(null)

function CartDrawerProvider({ children }: { children: ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const value = {
    isCartDrawerOpen: isOpen,
    onOpenCartDrawer: onOpen,
    onCloseCartDrawer: onClose,
  }

  return (
    <CartDrawerContext.Provider value={value}>
      {children}
      <CartDrawer isOpen={isOpen} onClose={onClose} />
    </CartDrawerContext.Provider>
  )
}

function useCartDrawer() {
  const context = useContext(CartDrawerContext)

  if (!context) {
    throw new Error('useCartDrawer must be used within a CartDrawerProvider')
  }

  return context
}

export { CartDrawerProvider, useCartDrawer }
