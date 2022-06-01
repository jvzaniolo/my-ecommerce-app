import type { GetServerSideProps, NextPage } from 'next'
import Link from 'next/link'
import { useState } from 'react'
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Img,
  Stack,
  Text,
} from '@chakra-ui/react'
import { api } from '~/services/axios'
import type { Item } from '~/types/item'
import { removeFromCart } from '~/handlers/cart'

const Cart: NextPage<{ initialCartData: Item[] }> = ({ initialCartData }) => {
  const [cart, setCart] = useState(() => initialCartData)

  const cartTotal = cart.reduce((acc, item) => {
    return acc + item.price * item.quantity
  }, 0)

  function handleRemoveItem(id: string) {
    setCart(cart.filter(item => item.id !== id))
    removeFromCart(id)
  }

  return (
    <Box>
      <Heading as="h1" size="xl">
        Cart
      </Heading>

      <Stack direction={['column', 'column', 'row']} spacing="10" mt="6">
        <Stack as="ul" flex="2" spacing="4">
          {cart.length > 0 ? (
            cart.map(item => (
              <Flex key={item.id} as="li" shadow="md" borderRightRadius="md">
                <Img src={item.image} alt={item.name} borderLeftRadius="md" />
                <Flex p="4" flex="1" align="flex-start">
                  <Stack flex="1">
                    <Heading as="h2" size="md">
                      {item.name}
                    </Heading>

                    <Text>{item.description}</Text>
                    <Text>Quantity: {item.quantity}</Text>
                    <Text>
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      }).format(item.price)}
                    </Text>
                  </Stack>
                  <Button
                    variant="link"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    Remove
                  </Button>
                </Flex>
              </Flex>
            ))
          ) : (
            <Text>Your cart is empty</Text>
          )}
        </Stack>

        <Flex
          p="4"
          h="sm"
          flex="1"
          shadow="md"
          direction="column"
          borderRadius="md"
        >
          <Stack flex="1" spacing="4">
            <Heading size="lg">Order Summary</Heading>
            {cart.map(item => (
              <Flex key={item.id} justify="space-between">
                <Box>
                  <Text>{item.name}</Text>
                  <Text ml="3" color="gray.600">
                    Quantity: {item.quantity}
                  </Text>
                </Box>
                <Text>
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(item.price * item.quantity)}
                </Text>
              </Flex>
            ))}
            <Divider />
            <Flex justify="space-between">
              <Text fontWeight="bold">Total:</Text>
              <Text fontWeight="bold">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(cartTotal)}
              </Text>
            </Flex>
          </Stack>

          <Link href="/checkout" passHref>
            <Button as="a">Checkout</Button>
          </Link>
        </Flex>
      </Stack>
    </Box>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const { data } = await api.get('/cart')

  return {
    props: {
      initialCartData: data || [],
    },
  }
}

export default Cart
