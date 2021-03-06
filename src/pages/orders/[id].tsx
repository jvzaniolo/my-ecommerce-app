import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Container,
  Divider,
  Flex,
  Heading,
  Icon,
  Link,
  Stack,
  Text,
} from '@chakra-ui/react'
import { NextPage } from 'next'
import Head from 'next/head'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { MdChevronLeft } from 'react-icons/md'
import { toUSCurrency } from '~/utils/format'
import { trpc } from '~/utils/trpc'

const Order: NextPage = () => {
  const router = useRouter()
  const id = router.query.id as string
  const { data: order, error } = trpc.useQuery(['order.byId', { id }])

  if (order) {
    const orderTotal = order.items.reduce(
      (acc, item) => acc + item.quantity * item.product.price,
      0
    )

    return (
      <>
        <Head>
          <title>My E-Com | Order</title>
        </Head>

        <Container size="md">
          <Flex align="flex-end" justify="space-between">
            <Heading as="h1" size="xl">
              Purchase
            </Heading>
            <NextLink href="/" passHref>
              <Link display="flex" alignItems="center" gap="2">
                <Icon as={MdChevronLeft} />
                Continue Shopping
              </Link>
            </NextLink>
          </Flex>

          <Stack mt="5" spacing={4} divider={<Divider />}>
            <Box>
              <Heading size="sm" mb="3">
                Contact
              </Heading>
              <Text>Email: {order.user.email}</Text>
            </Box>

            <Box>
              <Heading size="sm" mb="3">
                Items
              </Heading>

              {order.items.map(item => (
                <Flex key={item.id}>
                  <Flex w="full" justify="space-between">
                    <Text>
                      {item.quantity} x {item.product.name}
                    </Text>
                    <Text>{toUSCurrency(item.product.price)}</Text>
                  </Flex>
                </Flex>
              ))}
            </Box>

            <Box>
              <Flex justify="space-between">
                <Heading size="sm">Total</Heading>
                <Heading size="sm">{toUSCurrency(orderTotal)}</Heading>
              </Flex>

              <Alert
                mt="10"
                as={Stack}
                status="success"
                variant="subtle"
                flexDirection="column"
              >
                <AlertIcon boxSize="40px" />
                <AlertTitle fontSize="lg">
                  Thank you for your purchase!
                </AlertTitle>
                <AlertDescription maxWidth="sm">
                  Your order has been placed and is being processed.
                </AlertDescription>
              </Alert>
            </Box>
          </Stack>
        </Container>
      </>
    )
  }

  if (error) return <>{error.message}</>

  return <>Loading...</>
}

export default Order
