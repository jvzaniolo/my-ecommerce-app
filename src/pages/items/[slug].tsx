import type { GetServerSideProps, NextPage } from 'next'
import type { Fallback } from '~/types/swr'
import type { Item as ItemType } from '~/types/item'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import useSWR, { mutate } from 'swr'
import { MdOutlineAddShoppingCart } from 'react-icons/md'
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Divider,
  Flex,
  Heading,
  Icon,
  Img,
  Text,
} from '@chakra-ui/react'
import Quantity from '~/components/quantity'
import { toUSCurrency } from '~/utils/format'
import api, { fetcher } from '~/services/axios'

const Item: NextPage<{ fallback: Fallback }> = ({ fallback }) => {
  const router = useRouter()
  const { slug } = router.query
  const { data } = useSWR<[ItemType]>(
    `/items/${slug}`,
    () => fetcher(`/items?slug=${slug}`),
    { fallback }
  )
  const { isValidating } = useSWR('/cart', fetcher)
  const [quantity, setQuantity] = useState(1)

  const item = data?.[0]

  if (!item) return <>Loading...</>

  async function onAddToCart() {
    await mutate('/cart', () => {
      api.post('/cart', { ...item, quantity })
    })
    router.push('/cart')
  }

  return (
    <Box w="full">
      <Breadcrumb mt="3" mb="6">
        <BreadcrumbItem>
          <Link href="/" passHref>
            <BreadcrumbLink>Home</BreadcrumbLink>
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>{item.name}</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <Flex gap="14" wrap="wrap">
        <Box flex="1" pos="relative" h="xl" minW="xs">
          <Img as={Image} layout="fill" src={item.image} alt={item.name} />
        </Box>
        <Flex flex="1" gap="3" direction="column">
          <Flex justify="space-between">
            <Heading>{item.name}</Heading>
            <Heading>{toUSCurrency(item.price)}</Heading>
          </Flex>
          <Text>In-Stock: {item.stock}</Text>
          <Divider />
          <Text>{item.description}</Text>

          <Box mt="8">
            <Quantity
              value={quantity}
              onChange={value => setQuantity(value)}
              maxQuantity={item.stock}
            />

            <Button
              w="full"
              mt="3"
              onClick={onAddToCart}
              isLoading={isValidating}
            >
              <Icon mr="2" as={MdOutlineAddShoppingCart} />
              Add to cart
            </Button>
          </Box>
        </Flex>
      </Flex>
    </Box>
  )
}

export const getServerSideProps: GetServerSideProps = async context => {
  const { slug } = context.query
  const { data } = await api.get(`/items?slug=${slug}`)

  return {
    props: {
      fallback: {
        [`/items/${slug}`]: data,
      },
    },
  }
}

export default Item
