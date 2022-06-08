import type { GetServerSideProps, NextPage } from 'next'
import type { Item } from '~/types/item'
import type { Fallback } from '~/types/swr'

import Image from 'next/image'
import NextLink from 'next/link'
import useSWR, { mutate } from 'swr'
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Flex,
  Heading,
  Img,
  Link,
  Stack,
  Text,
} from '@chakra-ui/react'
import api, { fetcher } from '~/services/axios'
import { toUSCurrency } from '~/utils/format'
import Quantity from '~/components/quantity'
import OrderSummary from '~/components/order-summary'

const Cart: NextPage<{ fallback: Fallback }> = ({ fallback }) => {
  const { data: cart } = useSWR<Item[]>('/cart', fetcher, { fallback })

  async function onUpdateItemQuantity(id: string, quantity: number) {
    if (!cart) return

    const cartWithUpdatedQuantity = cart.map(item =>
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
    if (!cart) return

    const filteredCart = cart.filter(item => item.id !== id)

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
    <Box w="full">
      <Heading as="h1" size="xl">
        Cart
      </Heading>

      <Flex direction={['column', 'column', 'row']} gap="10" mt="4">
        <Stack as="ul" flex="2" spacing="4">
          {cart && cart.length > 0 ? (
            cart?.map(item => (
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
                    onChange={value => onUpdateItemQuantity(item.id, value)}
                    max={item.stock}
                  />

                  <Flex justify="space-between" mt="auto">
                    <Text fontWeight="bold">{toUSCurrency(item.price)}</Text>
                    <Button
                      variant="link"
                      onClick={() => onRemoveCartItem(item.id)}
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

        <Box h="sm" flex="1" pos="sticky" top="20">
          <OrderSummary cartItems={cart}>
            <NextLink href="/checkout" passHref>
              <Button mt="auto" as="a" w="full">
                Checkout
              </Button>
            </NextLink>
          </OrderSummary>
        </Box>
      </Flex>
    </Box>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const { data } = await api.get('/cart')

  return {
    props: {
      fallback: {
        '/cart': data,
      },
    },
  }
}

export default Cart
