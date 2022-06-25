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
import { FC } from 'react'
import useSWR from 'swr'
import { useCartDrawer } from '~/contexts/cart-drawer'
import { optimisticDeleteItem, optimisticUpdateItemQuantity } from '~/lib/cart'
import { fetcher } from '~/services/axios'
import { Cart } from '~/types'
import { toUSCurrency } from '~/utils/format'
import { Quantity } from './quantity'

type CartDrawerProps = {
  isOpen: boolean
  onClose: () => void
}

export const CartDrawer: FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { data: cart } = useSWR<Cart>('/api/cart', fetcher)
  const { onCloseCartDrawer } = useCartDrawer()

  if (!cart) return <>Loading...</>

  const cartTotal = cart.items.reduce((acc: any, item: any) => {
    return acc + item.product.price * item.quantity
  }, 0)

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
            {cart.items.length > 0 ? (
              cart.items.map((item: any) => (
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
                        onClick={() => {
                          optimisticDeleteItem(cart, item.id)
                        }}
                      >
                        Remove
                      </Button>
                    </Flex>
                    <Quantity
                      max={item.product.stock}
                      value={item.quantity}
                      onChange={value => {
                        optimisticUpdateItemQuantity(cart, item.id, value)
                      }}
                    />
                  </Flex>
                </Flex>
              ))
            ) : (
              <Text>Your cart is empty.</Text>
            )}
          </Stack>
        </DrawerBody>

        <DrawerFooter>
          <Link href="/checkout" passHref>
            <Button
              as="a"
              flex="1"
              colorScheme="purple"
              onClick={event => {
                event.preventDefault()
                onCloseCartDrawer()
              }}
            >
              Checkout: {toUSCurrency(cartTotal)}
            </Button>
          </Link>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
