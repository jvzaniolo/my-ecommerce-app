import {
  AspectRatio,
  Box,
  Button,
  Divider,
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
import api, { fetcher } from '~/services/axios'
import { Item } from '~/types/item'
import { toUSCurrency } from '~/utils/format'
import Quantity from './quantity'

type CartDrawer = {
  isOpen: boolean
  onClose: () => void
}

const CartDrawer = ({ isOpen, onClose }: CartDrawer) => {
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
                  <Text fontSize="lg" fontWeight="semibold">
                    {toUSCurrency(item.price * item.quantity)}
                  </Text>
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
            <Button as="a" flex="1" colorScheme="purple">
              Checkout
            </Button>
          </Link>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default CartDrawer
