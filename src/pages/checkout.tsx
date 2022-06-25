import { Box, Button, Checkbox, Flex, Heading, Stack } from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { AxiosError } from 'axios'
import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { SubmitHandler, useForm } from 'react-hook-form'
import useSWR from 'swr'
import { Input } from '~/components/input'
import { OrderSummary } from '~/components/order-summary'
import { ShippingForm } from '~/components/shipping-form'
import { axios, fetcher } from '~/services/axios'
import { Cart } from '~/types'
import { FormData } from '~/types/checkout-form'
import { checkoutFormSchema } from '~/utils/checkout-form-schema'

const Checkout: NextPage<{ initialCart: Cart }> = ({ initialCart }) => {
  const router = useRouter()
  const { data: cart, error } = useSWR<Cart, AxiosError>('/api/cart', fetcher, {
    fallbackData: initialCart,
  })
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    mode: 'onBlur',
    resolver: yupResolver(checkoutFormSchema, { abortEarly: false }),
  })

  const onPurchase: SubmitHandler<FormData> = async formData => {
    const { data: order } = await axios.post('/api/orders', {
      cart,
      ...formData,
    })

    router.push(`/orders/${order.id}`)
  }

  if (cart) {
    return (
      <>
        <Head>
          <title>My E-Com | Checkout</title>
        </Head>

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
      </>
    )
  }

  if (error) return <>{error.message}</>

  return <>Loading...</>
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const { data: cart } = await axios.get('/api/cart')

    return {
      props: {
        initialCart: cart || {},
      },
    }
  } catch (error) {
    return {
      props: {
        initialCart: {},
      },
    }
  }
}

export default Checkout
