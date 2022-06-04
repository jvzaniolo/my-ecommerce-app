import type { NextPage } from 'next'

import { Heading } from '@chakra-ui/react'
import { useSWRConfig } from 'swr'

const CheckoutPage: NextPage = () => {
  const { cache } = useSWRConfig()

  const cart = cache.get('/cart')

  console.log({ cart })

  return (
    <>
      <Heading size="lg">Checkout</Heading>
    </>
  )
}

export default CheckoutPage
