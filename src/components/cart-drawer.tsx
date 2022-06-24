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
import { axios } from '~/services/axios'
import { toUSCurrency } from '~/utils/format'
import { Quantity } from './quantity'

type CartDrawerProps = {
  isOpen: boolean
  onClose: () => void
}

export const CartDrawer: FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { data: cart } = useSWR('/api/cart', url =>
    axios.get(url).then(res => res.data)
  )
  const { onCloseCartDrawer } = useCartDrawer()

  const cartTotal = cart.items.reduce((acc: any, item: any) => {
    return acc + item.product.price * item.quantity
  }, 0)

  async function onUpdateItemQuantity(id: string, quantity: number) {
    optimisticUpdateItemQuantity(cart, id, quantity)
  }

  async function onRemoveCartItem(id: string) {
    optimisticDeleteItem(cart, id)
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
