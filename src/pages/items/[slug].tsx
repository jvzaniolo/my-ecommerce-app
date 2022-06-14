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
  useToast,
} from '@chakra-ui/react'
import Quantity from '~/components/quantity'
import { toUSCurrency } from '~/utils/format'
import { useCartDrawer } from '~/contexts/cart-drawer'
import { fetcher } from '~/services/fetcher'

const Item: NextPage<{ fallback: Fallback }> = ({ fallback }) => {
  const toast = useToast()
  const router = useRouter()
  const { slug } = router.query
  const { data: item } = useSWR<ItemType>(
    `/api/products/${slug}`,
    () => fetcher(`http://localhost:3000/api/products/${slug}`),
    {
      fallback,
    }
  )
  const [quantity, setQuantity] = useState(1)
  const { onOpenCartDrawer } = useCartDrawer()

  if (!item) return <>Loading...</>

  async function onAddToCart() {
    try {
      await mutate('/cart', () => {
        fetcher('http://localhost:3333/cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...item, quantity }),
        })
      })

      toast({
        title: 'Added to cart',
        description: `${item?.name} has been added to your cart`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      })

      onOpenCartDrawer()
    } catch (error) {
      toast({
        title: 'Something went wrong',
        description: `${item?.name} was not added to your cart`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
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
  const data = await fetcher<ItemType>(
    `http://localhost:3000/api/products/${slug}`
  )

  return {
    props: {
      fallback: {
        [`/api/products/${slug}`]: data,
      },
    },
  }
}

export default Item
