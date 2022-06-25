import { Box, Divider, Flex, Heading, Stack, Text } from '@chakra-ui/react'
import { AxiosError } from 'axios'
import { FC, ReactNode } from 'react'
import useSWR from 'swr'
import { fetcher } from '~/services/axios'
import { Cart } from '~/types'
import { toUSCurrency } from '~/utils/format'

type OrderSummary = {
  children: ReactNode
}

export const OrderSummary: FC<OrderSummary> = ({ children }) => {
  const { data: cart, error } = useSWR<Cart, AxiosError>('/api/cart', fetcher)

  if (cart) {
    const cartTotal = cart.items.reduce((acc: any, item: any) => {
      return acc + item.product.price * item.quantity
    }, 0)

    return (
      <Stack spacing="4" p="4" shadow="md" borderRadius="md">
        <Heading size="lg">Order Summary</Heading>
        {cart.items.map((item: any) => (
          <Box key={item.id}>
            <Text noOfLines={1}>{item.product.name}</Text>
            <Flex justify="space-between">
              <Text color="gray.500">Quantity: {item.quantity}</Text>
              <Text>{toUSCurrency(item.product.price * item.quantity)}</Text>
            </Flex>
          </Box>
        ))}
        <Divider />
        <Flex justify="space-between">
          <Text fontWeight="bold">Total:</Text>
          <Text fontWeight="bold">{toUSCurrency(cartTotal || 0)}</Text>
        </Flex>

        {children}
      </Stack>
    )
  }

  if (error) return <>{error.message}</>

  return <>Loading...</>
}
