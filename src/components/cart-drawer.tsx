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
import { useRouter } from 'next/router'
import { FC } from 'react'
import { useCartDrawer } from '~/contexts/cart-drawer'
import { useUser } from '~/contexts/user'
import {
  useRemoveCartItemMutation,
  useUpdateCartItemMutation,
} from '~/lib/useCartMutations'
import { toUSCurrency } from '~/utils/format'
import { trpc } from '~/utils/trpc'
import { Quantity } from './quantity'

type CartDrawerProps = {
  isOpen: boolean
  onClose: () => void
}

export const CartDrawer: FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const router = useRouter()
  const { session } = useUser()
  const { onCloseCartDrawer } = useCartDrawer()
  const { data: cart, error } = trpc.useQuery(['cart.all'])
  const removeItem = useRemoveCartItemMutation()
  const updateItemQuantity = useUpdateCartItemMutation()

  const cartTotal = cart
    ? cart.items.reduce(
        (acc, item) => acc + item.product.price * item.quantity,
        0
      )
    : 0

  return (
    <Drawer size="sm" isOpen={isOpen} placement="right" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader shadow="md">Cart</DrawerHeader>

        <DrawerBody>
          <Stack spacing="8">
            {error && <Text>{error.message}</Text>}
            {!error && cart ? (
              cart.items.length ? (
                cart.items.map(item => (
                  <Flex key={item.id} gap="3">
                    <AspectRatio ratio={1} flex="1">
                      <Img
                        as={Image}
                        src={item.product.imageUrl}
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
                            removeItem.mutate({ itemId: item.id })
                          }}
                        >
                          Remove
                        </Button>
                      </Flex>
                      <Quantity
                        max={item.product.stock}
                        value={item.quantity}
                        onChange={value => {
                          updateItemQuantity.mutate({
                            itemId: item.id,
                            quantity: value,
                          })
                        }}
                      />
                    </Flex>
                  </Flex>
                ))
              ) : (
                <Text>No items in the cart</Text>
              )
            ) : (
              <Text>
                {session ? (
                  'Loading...'
                ) : (
                  <Link href="/sign-in" passHref>
                    <Button
                      as="a"
                      variant="link"
                      onClick={() => {
                        onCloseCartDrawer()
                        router.push('/sign-in')
                      }}
                    >
                      Sign In to see your cart
                    </Button>
                  </Link>
                )}
              </Text>
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
                router.push('/checkout')
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
