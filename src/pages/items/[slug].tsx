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
  AspectRatio,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Divider,
  Flex,
  Heading,
  Img,
  Stack,
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
    <Flex h="full" direction="column">
      <Breadcrumb mb="4">
        <BreadcrumbItem>
          <Link href="/" passHref>
            <BreadcrumbLink>Home</BreadcrumbLink>
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>{item.name}</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <Flex h="full" gap="14" wrap="wrap">
        <Box flex="3">
          <AspectRatio minW="300" h="100%" ratio={16 / 9}>
            <Img
              as={Image}
              layout="fill"
              src={item.image}
              alt={item.name}
              objectFit="cover"
            />
          </AspectRatio>
        </Box>
        <Flex flex="2" direction="column" gap="3">
          <Flex justify="space-between">
            <Heading as="h2">{item.name}</Heading>
            <Heading as="h3">{toUSCurrency(item.price)}</Heading>
          </Flex>
          <Text>In-Stock: {item.stock}</Text>
          <Divider />
          <Text>{item.description}</Text>

          <Stack mt="8">
            <Quantity
              value={quantity}
              onChange={value => setQuantity(value)}
              max={item.stock}
            />

            <Button
              w="full"
              colorScheme="purple"
              onClick={onAddToCart}
              isLoading={isValidating}
              leftIcon={<MdOutlineAddShoppingCart />}
            >
              Add to cart
            </Button>
          </Stack>
        </Flex>
      </Flex>
    </Flex>
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
