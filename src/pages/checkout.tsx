import type { GetServerSideProps, NextPage } from 'next'
import type { Item } from '~/types/item'
import type { Fallback } from '~/types/swr'
import type { FormData } from '~/types/checkout-form'

import useSWR from 'swr'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { Box, Button, Checkbox, Flex, Heading, Stack } from '@chakra-ui/react'
import api, { fetcher } from '~/services/axios'
import Input from '~/components/input'
import OrderSummary from '~/components/order-summary'
import ShippingForm from '~/components/shipping-form'

const Checkout: NextPage<{ fallback: Fallback }> = ({ fallback }) => {
  const { data: cart } = useSWR<Item[]>('/cart', fetcher, { fallback })
  const { handleSubmit, register } = useForm<FormData>()

  const onPurchase: SubmitHandler<FormData> = data => {
    console.log(data)
  }

  return (
    <Box w="full">
      <Heading as="h1" size="xl">
        Checkout
      </Heading>

      <Flex
        as="form"
        mt="4"
        gap="10"
        direction={['column', 'column', 'row']}
        onSubmit={handleSubmit(onPurchase)}
      >
        <Flex flex="2" gap="6" direction="column">
          <Flex as="section" direction="column">
            <ShippingForm register={register} />
          </Flex>

          <Flex as="section" direction="column">
            <Heading as="h2" size="lg">
              Billing
            </Heading>

            <Flex direction="row" mt="3">
              <Checkbox defaultChecked={true}>Use same as Shipping</Checkbox>
            </Flex>
          </Flex>

          <Flex as="section" direction="column">
            <Heading as="h2" size="lg">
              Payment
            </Heading>

            <Flex mt="3" direction="column">
              <Input label="Card Number" {...register('payment.cardNumber')} />
              <Stack direction="row">
                <Input label="Expiry" {...register('payment.expiry')} />
                <Input label="CVV" {...register('payment.cvv')} />
              </Stack>
            </Flex>
          </Flex>
        </Flex>

        <Box h="sm" flex="1" pos="sticky" top="20">
          <OrderSummary cartItems={cart}>
            <Button type="submit">Purchase</Button>
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

export default Checkout
