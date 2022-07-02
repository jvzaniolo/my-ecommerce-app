import { Box, Divider, Flex, Heading, Stack, Text } from '@chakra-ui/react'
import { FC, ReactNode } from 'react'
import { toUSCurrency } from '~/utils/format'
import { trpc } from '~/utils/trpc'

export const OrderSummary: FC<{ children: ReactNode }> = ({ children }) => {
  const { data: cart, error } = trpc.useQuery(['cart.all'])

  const cartTotal = cart
    ? cart.items.reduce((acc, item) => {
        return acc + item.product.price * item.quantity
      }, 0)
    : 0

  return (
    <Stack spacing="4" p="4" shadow="md" borderRadius="md">
      <Heading size="lg">Order Summary</Heading>
      {error && <Text>{error.message}</Text>}
      {!error && cart ? (
        cart.items ? (
          cart.items.map(item => (
            <Box key={item.id}>
              <Text noOfLines={1}>{item.product.name}</Text>
              <Flex justify="space-between">
                <Text color="gray.500">Quantity: {item.quantity}</Text>
                <Text>{toUSCurrency(item.product.price * item.quantity)}</Text>
              </Flex>
            </Box>
          ))
        ) : (
          <Text>No items in the cart</Text>
        )
      ) : (
        <Text>Loading...</Text>
      )}
      <Divider />
      <Flex justify="space-between">
        <Text fontWeight="bold">Total:</Text>
        <Text fontWeight="bold">{toUSCurrency(cartTotal || 0)}</Text>
      </Flex>

      {children}
    </Stack>
  )
}
