import type { ReactNode } from 'react'
import type { Item } from '~/types/item'

import { Box, Divider, Flex, Heading, Stack, Text } from '@chakra-ui/react'
import { toUSCurrency } from '~/utils/format'

const OrderSummary = ({
  cartItems,
  children,
}: {
  cartItems: Item[] | undefined
  children: ReactNode
}) => {
  const cartTotal = cartItems?.reduce((acc, item) => {
    return acc + item.price * item.quantity
  }, 0)

  return (
    <Stack spacing="4" p="4" shadow="md" borderRadius="md">
      <Heading size="lg">Order Summary</Heading>
      {cartItems?.map(item => (
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
        <Text fontWeight="bold">{toUSCurrency(cartTotal || 0)}</Text>
      </Flex>

      {children}
    </Stack>
  )
}

export default OrderSummary
