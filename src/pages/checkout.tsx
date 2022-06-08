import type { GetServerSideProps, NextPage } from 'next'
import type { SubmitHandler } from 'react-hook-form'
import type { Item } from '~/types/item'
import type { Fallback } from '~/types/swr'
import type { FormData } from '~/types/checkout-form'

import { useRouter } from 'next/router'
import useSWR from 'swr'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Button, Checkbox, Flex, Heading, Stack } from '@chakra-ui/react'
import api, { fetcher } from '~/services/axios'
import Input from '~/components/input'
import OrderSummary from '~/components/order-summary'
import ShippingForm from '~/components/shipping-form'
import { checkoutFormSchema } from '~/utils/checkout-form-schema'

const Checkout: NextPage<{ fallback: Fallback }> = ({ fallback }) => {
  const router = useRouter()
  const { data: cart, mutate } = useSWR<Item[]>('/cart', fetcher, { fallback })
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(checkoutFormSchema, { abortEarly: false }),
  })

  const onPurchase: SubmitHandler<FormData> = async data => {
    const { data: order } = await api.post('/orders', {
      ...data,
      items: cart,
    })

    mutate([])

    router.push(`/purchase/${order.id}`)
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
            <ShippingForm register={register} control={control} />
          </Flex>

          <Flex as="section" direction="column">
            <Heading as="h2" size="lg">
              Billing
            </Heading>

            <Flex direction="row" mt="3">
              <Checkbox
                defaultChecked={true}
                {...register('billing.isSameAsShipping')}
              >
                Use same as Shipping
              </Checkbox>
            </Flex>
          </Flex>

          <Flex as="section" direction="column">
            <Heading as="h2" size="lg">
              Payment
            </Heading>

            <Flex mt="3" direction="column">
              <Input
                label="Card Number"
                {...register('payment.cardNumber')}
                error={errors.payment?.cardNumber?.message}
              />
              <Stack direction="row">
                <Input
                  label="Expiry"
                  {...register('payment.expiry')}
                  error={errors.payment?.expiry?.message}
                />
                <Input
                  label="CVV"
                  {...register('payment.cvv')}
                  error={errors.payment?.cvv?.message}
                />
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
