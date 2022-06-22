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
import { GetServerSideProps, NextPage } from 'next'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { MdChevronLeft } from 'react-icons/md'
import useSWR from 'swr'
import { fetcher } from '~/services/fetcher'
import { Fallback } from '~/types/swr'
import { toUSCurrency } from '~/utils/format'

const Order: NextPage<{ fallback: Fallback }> = ({ fallback }) => {
  const router = useRouter()
  const { id } = router.query
  const { data } = useSWR<[any]>(
    `/api/order/${id}`,
    () => fetcher(`http://localhost:3333/api/order/${id}`),
    { fallback }
  )

  const order = data?.[0]

  if (!order) return <>Loading...</>

  return (
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
          <Text>Email: {order.email}</Text>
        </Box>

        <Box>
          <Heading size="sm" mb="3">
            Items
          </Heading>

          {order.items.map((item: any) => (
            <Flex key={item.id}>
              <Flex w="full" justify="space-between">
                <Text>
                  {item.quantity} x {item.name}
                </Text>
                <Text>{toUSCurrency(item.price)}</Text>
              </Flex>
            </Flex>
          ))}
        </Box>

        <Box>
          <Flex justify="space-between">
            <Heading size="sm">Total</Heading>
            <Heading size="sm">{toUSCurrency(order.total)}</Heading>
          </Flex>

          <Alert
            mt="10"
            as={Stack}
            status="success"
            variant="subtle"
            flexDirection="column"
          >
            <AlertIcon boxSize="40px" />
            <AlertTitle fontSize="lg">Thank you for your purchase!</AlertTitle>
            <AlertDescription maxWidth="sm">
              Your order has been placed and is being processed.
            </AlertDescription>
          </Alert>
        </Box>
      </Stack>
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps = async context => {
  const { id } = context.query
  const order = await fetcher(`http://localhost:3000/api/order/${id}`)

  return {
    props: {
      fallback: {
        [`/api/order/${id}`]: order,
      },
    },
  }
}

export default Order
