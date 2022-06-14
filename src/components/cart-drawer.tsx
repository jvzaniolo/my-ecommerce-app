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
import api, { fetcher } from '~/services/axios'
import { Item } from '~/types/item'
import { toUSCurrency } from '~/utils/format'
import Quantity from './quantity'

type CartDrawerProps = {
  isOpen: boolean
  onClose: () => void
}

const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
  const { onCloseCartDrawer } = useCartDrawer()
  const { data: items } = useSWR<Item[]>('/cart', fetcher)

  async function onUpdateItemQuantity(id: string, quantity: number) {
    if (!items) return

    const cartWithUpdatedQuantity = items.map(item =>
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

  async function onRemoveCartItem(id: string) {
    if (!items) return

    const filteredCart = items.filter(item => item.id !== id)

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
            {items?.map(item => (
              <Flex key={item.id} gap="3">
                <AspectRatio ratio={1} flex="1">
                  <Img
                    as={Image}
                    src={item.image}
                    alt={item.name}
                    layout="fill"
                    objectFit="cover"
                  />
                </AspectRatio>
                <Flex flex="2" direction="column" justify="space-between">
                  <Heading as="h3" size="md" fontWeight="medium">
                    {item.name}
                  </Heading>
                  <Flex justify="space-between">
                    <Text fontSize="lg" fontWeight="semibold">
                      {toUSCurrency(item.price * item.quantity)}
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
                    max={item.stock}
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