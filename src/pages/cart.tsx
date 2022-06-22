import {
  Box,
  Button,
  Flex,
  Heading,
  Img,
  Link,
  Stack,
  Text,
} from '@chakra-ui/react'
import { GetServerSideProps, NextPage } from 'next'
import Image from 'next/image'
import NextLink from 'next/link'
import useSWR, { mutate, SWRConfiguration } from 'swr'
import { Quantity } from '~/components/quantity'
import { axios } from '~/services/axios'
import { toUSCurrency } from '~/utils/format'

/**
 * @deprecated
 * @see Using CartDrawer for now
 * @see src/components/cart-drawer.tsx
 */
const Cart: NextPage<{ fallback: SWRConfiguration['fallback'] }> = ({
  fallback,
}) => {
  const { data: cart } = useSWR('/api/cart', { fallback })

  async function onUpdateItemQuantity(id: string, quantity: number) {
    const cartWithUpdatedQuantity = cart.map((item: any) =>
      item.id === id ? { ...item, quantity } : item
    )

    mutate(
      '/api/cart',
      async () => {
        await axios.patch(`/api/cart/${id}`, { quantity })

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
    const filteredCart = cart.filter((item: any) => item.id !== id)

    mutate(
      '/api/cart',
      async () => {
        await axios.delete(`/api/cart/${id}`)

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
            cart?.map((item: any) => (
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
                    src={item.product.image}
                    alt={item.product.name}
                    borderLeftRadius="md"
                  />
                </Box>
                <Flex p="4" h="full" direction="column" gap="2" flex="2">
                  <NextLink href={`/items/${item.product.slug}`}>
                    <Link size="md" fontWeight="bold" fontSize="xl">
                      {item.product.name}
                    </Link>
                  </NextLink>

                  <Text noOfLines={3} title={item.product.description}>
                    {item.product.description}
                  </Text>
                  <Quantity
                    value={item.quantity}
                    onChange={value => onUpdateItemQuantity(item.id, value)}
                    max={item.product.stock}
                  />

                  <Flex justify="space-between" mt="auto">
                    <Text fontWeight="bold">
                      {toUSCurrency(item.product.price)}
                    </Text>
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
          {/* <OrderSummary cartItems={cart}>
            <NextLink href="/checkout" passHref>
              <Button mt="auto" as="a" w="full">
                Checkout
              </Button>
            </NextLink>
          </OrderSummary> */}
        </Box>
      </Flex>
    </Box>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const { data } = await axios.get('/api/cart')

  return {
    props: {
      fallback: {
        '/api/cart': data,
      },
    },
  }
}

export default Cart
