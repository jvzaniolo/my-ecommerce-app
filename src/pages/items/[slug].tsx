import type { GetServerSideProps, NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { MdOutlineAddShoppingCart } from 'react-icons/md'
import {
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
import type { Item } from '~/types/item'

const ItemDetails: NextPage<{ item: Item }> = ({ item }) => {
  const router = useRouter()

  async function handleAddToCart() {
    await api.post('/cart', {
      ...item,
      quantity: 1,
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

      <Flex gap="4">
        <Img src={item.image} alt={item.name} />
        <Flex gap="3" direction="column">
          <Flex justify="space-between">
            <Heading>{item.name}</Heading>
            <Heading>
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(item.price)}
            </Heading>
          </Flex>
          <Text>Quantity: {item.quantity}</Text>
          <Divider />
          <Text>{item.description}</Text>

          <Button mt="8" gap="3" onClick={handleAddToCart}>
            <Icon as={MdOutlineAddShoppingCart} />
            Add to cart
          </Button>
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

export default ItemDetails
