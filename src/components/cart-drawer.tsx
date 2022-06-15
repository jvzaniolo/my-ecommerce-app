import {
  AspectRatio,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Heading,
  Img,
  Stack,
  Text,
} from '@chakra-ui/react'
import Image from 'next/image'
import Link from 'next/link'
import useSWR, { mutate } from 'swr'
import { useCartDrawer } from '~/contexts/cart-drawer'
import { fetcher } from '~/services/fetcher'
import type { CartItemWithProduct } from '~/lib/cart'
import { toUSCurrency } from '~/utils/format'
import Quantity from './quantity'

type CartDrawerProps = {
  isOpen: boolean
  onClose: () => void
}

const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
  const { onCloseCartDrawer } = useCartDrawer()
  const { data: cart } = useSWR<CartItemWithProduct[]>('/cart', () =>
    fetcher('http://localhost:3000/api/cart')
  )

  async function onUpdateItemQuantity(id: string, quantity: number) {
    if (!cart) return

    const cartWithUpdatedQuantity = cart.map(item =>
      item.id === id ? { ...item, quantity } : item
    )

    mutate(
      '/cart',
      async () => {
        await fetcher(`http://localhost:3000/api/cart/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ quantity }),
        })

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

  async function onRemoveCartItem(id: string) {
    if (!cart) return

    const filteredCart = cart.filter(item => item.id !== id)

    mutate(
      '/cart',
      async () => {
        await fetcher(`http://localhost:3000/api/cart/${id}`, {
          method: 'DELETE',
        })

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

  return (
    <Drawer
      id="cart"
      size="sm"
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader shadow="md">Cart</DrawerHeader>

        <DrawerBody>
          <Stack spacing="8">
            {cart?.map(item => (
              <Flex key={item.id} gap="3">
                <AspectRatio ratio={1} flex="1">
                  <Img
                    as={Image}
                    src={item.product.image}
                    alt={item.product.name}
                    layout="fill"
                    objectFit="cover"
                  />
                </AspectRatio>
                <Flex flex="2" direction="column" justify="space-between">
                  <Heading as="h3" size="md" fontWeight="medium">
                    {item.product.name}
                  </Heading>
                  <Flex justify="space-between">
                    <Text fontSize="lg" fontWeight="semibold">
                      {toUSCurrency(item.product.price * item.quantity)}
                    </Text>
                    <Button
                      variant="link"
                      onClick={() => onRemoveCartItem(item.id)}
                    >
                      Remove
                    </Button>
                  </Flex>
                  <Quantity
                    value={item.quantity}
                    onChange={value => onUpdateItemQuantity(item.id, value)}
                    max={item.product.stock}
                  />
                </Flex>
              </Flex>
            ))}
          </Stack>
        </DrawerBody>

        <DrawerFooter>
          <Link href="/checkout" passHref>
            <Button
              as="a"
              flex="1"
              colorScheme="purple"
              onClick={() => {
                onCloseCartDrawer()
              }}
            >
              Checkout
            </Button>
          </Link>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default CartDrawer
