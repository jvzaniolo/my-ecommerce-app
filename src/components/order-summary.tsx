import type { Item } from '~/types/item'

import Link from 'next/link'
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Stack,
  Text,
} from '@chakra-ui/react'
import { toUSCurrency } from '~/utils/format'
import { useSWRConfig } from 'swr'

const OrderSummary = () => {
  const { cache } = useSWRConfig()

  const cart: Item[] = cache.get('/cart')

  const cartTotal = cart.reduce((acc, item) => {
    return acc + item.price * item.quantity
  }, 0)

  return (
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
        {cart?.map(item => (
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
      </Stack>

      <Link href="/checkout" passHref>
        <Button mt="auto" as="a" w="full">
          Checkout
        </Button>
      </Link>
    </Flex>
  )
}

export default OrderSummary
