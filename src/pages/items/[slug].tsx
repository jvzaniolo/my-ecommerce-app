import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useSWRConfig } from 'swr'
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
import { Quantity } from '~/components/quantity'
import { useCart } from '~/hooks/cart'
import { toUSCurrency } from '~/utils/format'

import type { NextPage } from 'next'
import type { Item as ItemType } from '~/types/item'

const Item: NextPage = () => {
  const router = useRouter()
  const { slug } = router.query
  const { cache } = useSWRConfig()
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)

  const item: ItemType = cache
    .get('/items')
    ?.find((item: ItemType) => item.slug === slug)

  if (!item) return <>Loading...</>

  async function onAddToCart() {
    await addItem({ ...item, quantity })
    router.push('/cart')
  }

  return (
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
  )
}

export default Item
