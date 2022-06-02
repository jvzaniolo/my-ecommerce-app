import type { GetServerSideProps, NextPage } from 'next'
import NextLink from 'next/link'
import Image from 'next/image'
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
  Link,
} from '@chakra-ui/react'
import { api } from '~/services/axios'
import type { Item } from '~/types/item'
import { toUSCurrency } from '~/utils/format'
import Quantity from '~/components/quantity'

const Cart: NextPage<{ initialCartData: Item[] }> = ({ initialCartData }) => {
  const [cart, setCart] = useState(() => initialCartData)

  const cartTotal = cart.reduce((acc, item) => {
    return acc + item.price * item.quantity
  }, 0)

  function onRemoveItem(id: string) {
    setCart(cart.filter(item => item.id !== id))
    api.delete(`/cart/${id}`)
  }

  function onChangeQuantity(id: string, quantity: number) {
    setCart(cart.map(item => (item.id === id ? { ...item, quantity } : item)))
    api.patch(`/cart/${id}`, { quantity })
  }

  return (
    <>
      <Breadcrumb mt="3" mb="6">
        <BreadcrumbItem>
          <NextLink href="/" passHref>
            <BreadcrumbLink>Home</BreadcrumbLink>
          </NextLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>Cart</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <Box>
        <Heading as="h1" size="xl">
          Cart
        </Heading>

        <Flex direction={['column', 'column', 'row']} gap="10" mt="4">
          <Stack as="ul" flex="2" spacing="4">
            {cart.length > 0 ? (
              cart.map(item => (
                <Flex
                  key={item.id}
                  as="li"
                  h="56"
                  shadow="md"
                  borderRightRadius="md"
                >
                  <Box pos="relative" flex="1">
                    <Img
                      as={Image}
                      layout="fill"
                      src={item.image}
                      alt={item.name}
                      borderLeftRadius="md"
                    />
                  </Box>
                  <Flex p="4" h="full" direction="column" gap="2" flex="2">
                    <NextLink href={`/items/${item.slug}`}>
                      <Link size="md" fontWeight="bold" fontSize="xl">
                        {item.name}
                      </Link>
                    </NextLink>

                    <Text noOfLines={3} title={item.description}>
                      {item.description}
                    </Text>
                    <Quantity
                      value={item.quantity}
                      onChange={quantity => onChangeQuantity(item.id, quantity)}
                      maxQuantity={item.stock}
                    />

                    <Flex justify="space-between" mt="auto">
                      <Text fontWeight="bold">{toUSCurrency(item.price)}</Text>
                      <Button
                        variant="link"
                        onClick={() => onRemoveItem(item.id)}
                      >
                        Remove
                      </Button>
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
            <Stack spacing="4">
              <Heading size="lg">Order Summary</Heading>
              {cart.map(item => (
                <Box key={item.id}>
                  <Text noOfLines={1}>{item.name}</Text>
                  <Flex justify="space-between">
                    <Text color="gray.500">Quantity: {item.quantity}</Text>
                    <Text>{toUSCurrency(item.price * item.quantity)}</Text>
                  </Flex>
                </Box>
              ))}
              <Divider />
              <Flex justify="space-between">
                <Text fontWeight="bold">Total:</Text>
                <Text fontWeight="bold">{toUSCurrency(cartTotal)}</Text>
              </Flex>
            </Stack>

            <NextLink href="/checkout" passHref>
              <Button mt="auto" as="a" w="full">
                Checkout
              </Button>
            </NextLink>
          </Flex>
        </Flex>
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
