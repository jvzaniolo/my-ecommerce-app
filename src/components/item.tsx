import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import useSWR, { useSWRConfig } from 'swr'
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
import { MdOutlineAddShoppingCart } from 'react-icons/md'
import { Quantity } from './quantity'
import { api, fetcher } from '~/services/axios'
import { toUSCurrency } from '~/utils/format'
import type { Item as ItemType } from '~/types/item'

export function Item({ slug }: { slug: string | string[] | undefined }) {
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  const { mutate } = useSWRConfig()
  const { data } = useSWR<[ItemType]>(`/items/${slug}`, () =>
    fetcher(`/items?slug=${slug}`)
  )
  const item = data?.[0]

  async function onAddToCart() {
    await mutate('/cart', async () => {
      const newItem = { ...item, quantity }

      const { data } = await api.post('/cart', newItem)

      return data
    })

    router.push('/cart')
  }

  return item ? (
    <>
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

            <Button w="full" mt="3" onClick={onAddToCart}>
              <Icon as={MdOutlineAddShoppingCart} />
              Add to cart
            </Button>
          </Box>
        </Flex>
      </Flex>
    </>
  ) : null
}
