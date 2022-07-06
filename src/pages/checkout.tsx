import {
  Box,
  Button,
  Checkbox,
  Flex,
  Heading,
  Stack,
  useToast,
} from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Input } from '~/components/input'
import { OrderSummary } from '~/components/order-summary'
import { ShippingForm } from '~/components/shipping-form'
import { supabase } from '~/server/db/supabase'
import { trpc } from '~/utils/trpc'

const checkoutFormSchema = z.object({
  shipping: z.object({
    email: z.string().min(1, 'Email is required'),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    address: z.string().min(1, 'Address is required'),
    secondaryAddress: z.string().optional(),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zipCode: z.string().min(1, 'Zip code is required'),
    country: z.string().min(1, 'Country is required'),
    phone: z.string().min(1, 'Phone is required'),
  }),
  billing: z.object({
    isSameAsShipping: z.boolean(),
  }),
  payment: z.object({
    cardNumber: z.string().length(16, 'Card number is invalid'),
    expiry: z
      .string()
      .regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, 'Expiry is invalid'),
    cvv: z.string().length(3, 'CVV is invalid'),
  }),
})

export type CheckoutFormSchema = z.infer<typeof checkoutFormSchema>

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { data: user } = await supabase.auth.api.getUserByCookie(req)

  if (!user) {
    return {
      props: {},
      redirect: {
        destination: '/sign-in',
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}

const Checkout: NextPage = () => {
  const toast = useToast()
  const router = useRouter()
  const utils = trpc.useContext()
  const { data: cart, error } = trpc.useQuery(['cart.all'])
  const createOrder = trpc.useMutation(['order.create'])
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<CheckoutFormSchema>({
    mode: 'onBlur',
    resolver: zodResolver(checkoutFormSchema),
  })

  if (cart) {
    const onPurchase: SubmitHandler<CheckoutFormSchema> = async formData => {
      createOrder.mutate(
        { cart },
        {
          onSuccess(data) {
            utils.invalidateQueries(['cart.all'])

            router.push(`/orders/${data.id}`)
          },
          onError(error) {
            toast({
              title: 'Error',
              description: error.message || 'Something went wrong',
              status: 'error',
              duration: 5000,
              isClosable: true,
            })
          },
        }
      )
    }

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
                    placeholder="1234 1234 1234 1234"
                    {...register('payment.cardNumber')}
                    error={errors.payment?.cardNumber?.message}
                  />
                  <Stack direction="row">
                    <Input
                      label="Expiry"
                      placeholder="MM/YY"
                      {...register('payment.expiry')}
                      error={errors.payment?.expiry?.message}
                    />
                    <Input
                      label="CVV"
                      placeholder="123"
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

export default Checkout
