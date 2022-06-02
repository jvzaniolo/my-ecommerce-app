import { useState } from 'react'
import type { GetServerSideProps, NextPage } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
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
import { api } from '~/services/axios'
import type { Item as ItemType } from '~/types/item'
import Quantity from '~/components/quantity'

const Item: NextPage<{ item: ItemType }> = ({ item }) => {
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)

  async function onAddToCart() {
    await api.post('/cart', {
      ...item,
      quantity,
    })

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
            <Heading>
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(item.price)}
            </Heading>
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

export const getServerSideProps: GetServerSideProps = async context => {
  const { slug } = context.query
  const { data } = await api.get('/items', {
    params: {
      slug,
    },
  })

  return {
    props: { item: data[0] || {} },
  }
}

export default Item
