import type { NextPage } from 'next'

import { useSWRConfig } from 'swr'
import { Box, Flex, Heading } from '@chakra-ui/react'
import OrderSummary from '~/components/order-summary'

const CheckoutPage: NextPage = () => {
  const { cache } = useSWRConfig()

  const cart = cache.get('/cart')

  console.log({ cart })

  return (
    <>
      <Heading size="lg">Checkout</Heading>

      <Flex>
        <Box flex="2">Hello</Box>

        <OrderSummary />
      </Flex>
    </>
  )
}

export default CheckoutPage
