import type { GetServerSideProps, NextPage } from 'next'
import Link from 'next/link'
import { useState } from 'react'
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
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

const Cart: NextPage<{ initialCartData: Item[] }> = ({ initialCartData }) => {
  const [cart, setCart] = useState(() => initialCartData)

  const cartTotal = cart.reduce((acc, item) => {
    return acc + item.price * item.quantity
  }, 0)

  function handleRemoveItem(id: string) {
    setCart(cart.filter(item => item.id !== id))
    api.delete(`/cart/${id}`)
  }

  return (
    <>
      <Breadcrumb mt="3" mb="6">
        <BreadcrumbItem>
          <Link href="/" passHref>
            <BreadcrumbLink>Home</BreadcrumbLink>
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>Cart</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <Box>
        <Heading as="h1" size="xl">
          Cart
        </Heading>

        <Stack direction={['column', 'column', 'row']} spacing="10" mt="4">
          <Stack as="ul" flex="2" spacing="4">
            {cart.length > 0 ? (
              cart.map(item => (
                <Flex key={item.id} as="li" shadow="md" borderRightRadius="md">
                  <Img
                    src={item.image}
                    alt={item.name}
                    borderLeftRadius="md"
                    w="64"
                  />
                  <Flex p="4" align="flex-start">
                    <Flex h="full" direction="column" gap="2">
                      <Heading as="h2" size="md">
                        {item.name}
                      </Heading>

                      <Text>{item.description}</Text>
                      <Text>Quantity: {item.quantity}</Text>

                      <Flex justify="space-between" mt="auto">
                        <Text fontWeight="bold">
                          {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD',
                          }).format(item.price)}
                        </Text>
                        <Button
                          variant="link"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          Remove
                        </Button>
                      </Flex>
                    </Flex>
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
                    <Text noOfLines={1}>{item.name}</Text>
                    <Text ml="2" color="gray.500">
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
    </>
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
