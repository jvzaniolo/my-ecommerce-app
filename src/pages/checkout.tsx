import type { GetServerSideProps, NextPage } from 'next'
import type { SubmitHandler } from 'react-hook-form'
import type { Fallback } from '~/types/swr'
import type { FormData } from '~/types/checkout-form'

import { useRouter } from 'next/router'
import useSWR from 'swr'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Button, Checkbox, Flex, Heading, Stack } from '@chakra-ui/react'
import { fetcher } from '~/services/fetcher'
import Input from '~/components/input'
import OrderSummary from '~/components/order-summary'
import ShippingForm from '~/components/shipping-form'
import { checkoutFormSchema } from '~/utils/checkout-form-schema'
import { Order } from '~/types/order'
import type { CartItemWithProduct } from '~/lib/cart'

const Checkout: NextPage<{ fallback: Fallback }> = ({ fallback }) => {
  const router = useRouter()
  const { data: cart, mutate } = useSWR<CartItemWithProduct[]>(
    '/cart',
    () => fetcher('http://localhost:3000/api/cart'),
    { fallback }
  )
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    mode: 'onBlur',
    resolver: yupResolver(checkoutFormSchema, { abortEarly: false }),
  })

  const onPurchase: SubmitHandler<FormData> = async data => {
    const order = await fetcher<Order>('http://localhost:3000/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // body: JSON.stringify({ cart_id: cart?.id }),
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

            <Stack mt="3" direction="column">
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
            </Stack>
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
  const { data } = await fetcher<CartItemWithProduct[]>(
    'http://localhost:3000/api/cart'
  )

  if (data.length > 0) {
    return {
      props: {
        fallback: {
          '/cart': data,
        },
      },
    }
  }

  return {
    props: {},
    redirect: {
      destination: '/?error=cart-is-empty',
      permanent: false,
    },
  }
}

export default Checkout
