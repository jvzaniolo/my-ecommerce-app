import type { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import { MdOutlineAddShoppingCart } from 'react-icons/md'
import {
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
import { addToCart } from '~/handlers/cart'

const ItemDetails: NextPage<{ item: Item }> = ({ item }) => {
  const router = useRouter()

  async function handleAddToCart() {
    await addToCart(item)

    router.push('/cart')
  }

  return (
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
  )
}

export const getServerSideProps: GetServerSideProps = async context => {
  const { id } = context.query
  const { data } = await api.get(`/items/${id}`)

  return {
    props: { item: data || {} },
  }
}

export default ItemDetails
