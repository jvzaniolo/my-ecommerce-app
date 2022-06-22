import { Box, Button, Checkbox, Flex, Heading, Stack } from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Input } from '~/components/input'
import { OrderSummary } from '~/components/order-summary'
import { ShippingForm } from '~/components/shipping-form'
import { fetcher } from '~/services/fetcher'
import { FormData } from '~/types/checkout-form'
import { checkoutFormSchema } from '~/utils/checkout-form-schema'

const Checkout: NextPage<{ cart: any }> = ({ cart }) => {
  const router = useRouter()
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
    const order = await fetcher<any>('http://localhost:3000/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cartId: cart.id }),
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
          <OrderSummary cartItems={cart.items}>
            <Button type="submit">Purchase</Button>
          </OrderSummary>
        </Box>
      </Flex>
    </Box>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const cart = await fetcher('http://localhost:3000/api/cart')

  if (cart) {
    return {
      props: {
        cart,
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
