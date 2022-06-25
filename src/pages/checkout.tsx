import { Box, Button, Checkbox, Flex, Heading, Stack } from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import { SubmitHandler, useForm } from 'react-hook-form'
import useSWR, { SWRConfiguration } from 'swr'
import { Input } from '~/components/input'
import { OrderSummary } from '~/components/order-summary'
import { ShippingForm } from '~/components/shipping-form'
import { axios, fetcher } from '~/services/axios'
import { Cart } from '~/types'
import { FormData } from '~/types/checkout-form'
import { checkoutFormSchema } from '~/utils/checkout-form-schema'

const Checkout: NextPage<{ fallback: SWRConfiguration['fallback'] }> = ({
  fallback,
}) => {
  const router = useRouter()
  const { data: cart } = useSWR<Cart>('/api/cart', fetcher, { fallback })
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    mode: 'onBlur',
    resolver: yupResolver(checkoutFormSchema, { abortEarly: false }),
  })

  if (!cart) return <>Loading...</>

  const onPurchase: SubmitHandler<FormData> = async data => {
    const { data: order } = await axios.post('/api/orders', {
      cart,
      ...data,
    })

    router.push(`/orders/${order.id}`)
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
          <OrderSummary>
            <Button type="submit">Purchase</Button>
          </OrderSummary>
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

export default Checkout
